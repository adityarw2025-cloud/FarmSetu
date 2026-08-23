import type { Product, Equipment, RentalRequest, Order, FarmCheckReport } from '../types';
import { initialProducts, initialEquipment, initialRentals, initialOrders } from '../lib/mockData';
import { authService } from './authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cleanLocation, getNumericPrice, getNumericQuantity } from '../utils/formatters';

const STORAGE_KEYS = {
  PRODUCTS: 'farmsetu_products_v3',
  EQUIPMENT: 'farmsetu_equipment_v3',
  RENTALS: 'farmsetu_rentals_v3',
  ORDERS: 'farmsetu_orders_v3'
};

type Listener = () => void;

class Store {
  private products: Product[] = [];
  private equipment: Equipment[] = [];
  private rentals: RentalRequest[] = [];
  private orders: Order[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
    if (isSupabaseConfigured) {
      this.initSupabaseSync();
    }
  }

  private loadFromStorage() {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const rawProds: Product[] = savedProducts ? JSON.parse(savedProducts) : initialProducts;
      this.products = rawProds.map((p) => ({
        ...p,
        location: cleanLocation(p.location),
        price: getNumericPrice(p.price),
        quantity: getNumericQuantity(p.quantity),
        harvestDate: p.harvestDate?.includes('60822') ? '2026-08-14' : p.harvestDate
      }));

      const savedEquipment = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      this.equipment = savedEquipment ? JSON.parse(savedEquipment) : initialEquipment;

      const savedRentals = localStorage.getItem(STORAGE_KEYS.RENTALS);
      this.rentals = savedRentals ? JSON.parse(savedRentals) : initialRentals;

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      this.orders = savedOrders ? JSON.parse(savedOrders) : initialOrders;
    } catch (e) {
      console.error('Failed to load from LocalStorage, fallback to initial data', e);
      this.products = initialProducts;
      this.equipment = initialEquipment;
      this.rentals = initialRentals;
      this.orders = initialOrders;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(this.equipment));
      localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(this.rentals));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    } catch (e) {
      console.error('Failed to save state to LocalStorage', e);
    }
    this.notify();
  }

  private async initSupabaseSync() {
    if (!supabase) return;
    try {
      // 1. Initial Fetch Products from Supabase
      const { data: dbProducts } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (dbProducts && dbProducts.length > 0) {
        this.products = dbProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          unit: p.unit,
          quantity: Number(p.quantity),
          location: p.location,
          farmerId: p.farmer_id || 'usr_unauth',
          farmerName: p.farmer_name || 'Registered Farmer',
          farmerVerified: p.farmer_verified ?? true,
          harvestDate: p.harvest_date || new Date().toISOString().split('T')[0],
          image: p.image_url,
          description: p.description || '',
          createdAt: p.created_at
        }));
        this.saveToStorage();
      }

      // 2. Realtime Listener for Live Product Additions/Updates across devices
      supabase
        .channel('farmsetu-realtime-products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const p: any = payload.new;
            const newP: Product = {
              id: p.id,
              name: p.name,
              category: p.category,
              price: Number(p.price),
              unit: p.unit,
              quantity: Number(p.quantity),
              location: p.location,
              farmerId: p.farmer_id || 'usr_unauth',
              farmerName: p.farmer_name || 'Registered Farmer',
              farmerVerified: p.farmer_verified ?? true,
              harvestDate: p.harvest_date || new Date().toISOString().split('T')[0],
              image: p.image_url,
              description: p.description || '',
              createdAt: p.created_at
            };
            if (!this.products.some(existing => existing.id === newP.id)) {
              this.products.unshift(newP);
              this.saveToStorage();
            }
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('Supabase sync initialization warning:', err);
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public addProduct(product: Omit<Product, 'id' | 'createdAt' | 'farmerId' | 'farmerName' | 'farmerVerified'>): Product {
    const user = authService.getCurrentUser();
    const farmerId = user ? user.id : 'usr_unauth';
    const farmerName = user ? user.name : 'Registered Farmer';
    const farmerVerified = user ? user.isVerified : false;

    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      farmerId,
      farmerName,
      farmerVerified,
      createdAt: new Date().toISOString()
    };

    this.products.unshift(newProduct);
    this.saveToStorage();

    // Async Insert into live Supabase database
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').insert([{
        farmer_name: farmerName,
        farmer_verified: farmerVerified,
        name: product.name,
        category: product.category,
        price: product.price,
        unit: product.unit,
        quantity: product.quantity,
        location: product.location,
        harvest_date: product.harvestDate,
        image_url: product.image,
        description: product.description || ''
      }]).then(({ error }) => {
        if (error) console.error('Supabase product insert warning:', error);
      });
    }

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): boolean {
    const user = authService.getCurrentUser();
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      if (user && this.products[index].farmerId !== user.id) {
        console.warn('Unauthorized product modification attempt');
        return false;
      }
      this.products[index] = { ...this.products[index], ...updates };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public removeProduct(id: string): boolean {
    const user = authService.getCurrentUser();
    const target = this.products.find((p) => p.id === id);
    if (target && user && target.farmerId !== user.id && user.role === 'Farmer') {
      console.warn('Unauthorized product deletion attempt');
      return false;
    }

    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    if (this.products.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public attachFarmCheckReport(productId: string, report: FarmCheckReport): boolean {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this.products[index].farmCheck = report;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // --- EQUIPMENT ---
  public getEquipment(): Equipment[] {
    return [...this.equipment];
  }

  public getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find((e) => e.id === id);
  }

  public addEquipment(equip: Omit<Equipment, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'rating'>): Equipment {
    const user = authService.getCurrentUser();
    const ownerId = user ? user.id : 'usr_unauth';
    const ownerName = user ? user.name : 'Equipment Owner';

    const newEquipment: Equipment = {
      ...equip,
      id: `eq_${Date.now()}`,
      ownerId,
      ownerName,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    this.equipment.unshift(newEquipment);
    this.saveToStorage();
    return newEquipment;
  }

  public updateEquipment(id: string, updates: Partial<Equipment>): boolean {
    const user = authService.getCurrentUser();
    const index = this.equipment.findIndex((e) => e.id === id);
    if (index !== -1) {
      if (user && this.equipment[index].ownerId !== user.id) {
        console.warn('Unauthorized equipment modification attempt');
        return false;
      }
      this.equipment[index] = { ...this.equipment[index], ...updates };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public removeEquipment(id: string): boolean {
    const user = authService.getCurrentUser();
    const target = this.equipment.find((e) => e.id === id);
    if (target && user && target.ownerId !== user.id) {
      console.warn('Unauthorized equipment deletion attempt');
      return false;
    }
    const initialLen = this.equipment.length;
    this.equipment = this.equipment.filter((e) => e.id !== id);
    if (this.equipment.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // --- RENTALS ---
  public getRentals(): RentalRequest[] {
    return [...this.rentals];
  }

  public createRentalRequest(req: { equipmentId: string; startDate: string; endDate: string; durationDays: number; totalPrice: number; message?: string }): RentalRequest | null {
    const user = authService.getCurrentUser();
    const equip = this.getEquipmentById(req.equipmentId);
    if (!equip) return null;

    const newRequest: RentalRequest = {
      id: `rnt_${Date.now()}`,
      equipmentId: equip.id,
      equipmentName: equip.name,
      equipmentImage: equip.image,
      ownerId: equip.ownerId,
      ownerName: equip.ownerName,
      requesterId: user ? user.id : 'usr_unauth',
      requesterName: user ? user.name : 'Equipment Requester',
      startDate: req.startDate,
      endDate: req.endDate,
      durationDays: req.durationDays,
      totalPrice: req.totalPrice,
      status: 'Pending',
      message: req.message,
      createdAt: new Date().toISOString()
    };
    this.rentals.unshift(newRequest);
    this.saveToStorage();
    return newRequest;
  }

  public updateRentalStatus(id: string, status: RentalRequest['status']): boolean {
    const index = this.rentals.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.rentals[index].status = status;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return [...this.orders];
  }

  public createOrder(productId: string, quantity: number): Order | null {
    const user = authService.getCurrentUser();
    const product = this.getProductById(productId);
    if (!product || product.quantity < quantity) return null;

    const totalPrice = product.price * quantity;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      buyerId: user ? user.id : 'usr_unauth',
      buyerName: user ? user.name : 'Harvest Buyer',
      sellerId: product.farmerId,
      sellerName: product.farmerName,
      quantity,
      unit: product.unit,
      totalPrice,
      status: 'Confirmed',
      date: new Date().toISOString().split('T')[0]
    };

    // deduct stock
    this.updateProduct(productId, { quantity: product.quantity - quantity });

    this.orders.unshift(newOrder);
    this.saveToStorage();

    // Async Insert into Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert([{
        quantity,
        total_price: totalPrice,
        status: 'Confirmed'
      }]).then(({ error }) => {
        if (error) console.error('Supabase order insert warning:', error);
      });
    }

    return newOrder;
  }

  // Reset to initial sample data
  public resetDemoData() {
    this.products = initialProducts;
    this.equipment = initialEquipment;
    this.rentals = initialRentals;
    this.orders = initialOrders;
    this.saveToStorage();
  }
}

export const store = new Store();
