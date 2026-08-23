import type { Product, Equipment, RentalRequest, UserProfile, Order } from '../types';

export const initialProfile: UserProfile = {
  id: 'usr_001',
  name: 'Ramesh Patel',
  email: 'ramesh.patel@farmsetu.in',
  role: 'Unified User',
  phone: '+91 98765 43210',
  location: 'Nashik, Maharashtra',
  farmSize: '18 Acres',
  crops: ['Tomatoes', 'Red Onions', 'Basmati Rice', 'Sugarcane'],
  isVerified: true,
  avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80',
  joinedDate: 'January 2025'
};

export const initialProducts: Product[] = [
  {
    id: 'prod_101',
    name: 'Organic Red Tomatoes (Grade A)',
    category: 'Vegetables',
    price: 34,
    unit: 'kg',
    quantity: 1200,
    location: 'Nashik, Maharashtra',
    description: 'Freshly harvested vine-ripened organic tomatoes. Rich colour, firm texture, verified zero pesticide residues.',
    harvestDate: '2026-08-14',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    farmerId: 'usr_001',
    farmerName: 'Ramesh Patel',
    farmerVerified: true,
    createdAt: '2026-08-14T08:30:00Z',
    farmCheck: {
      id: 'FC-2026-8942',
      productId: 'prod_101',
      productName: 'Organic Red Tomatoes (Grade A)',
      overallScore: 92,
      grade: 'GRADE A',
      verified: true,
      verificationDate: '2026-08-15 10:15 AM',
      inspector: 'FarmCheck Sensor Rig v2',
      metrics: {
        weightScore: 94,
        sizeScore: 89,
        colourScore: 92,
        defectScore: 95,
        weightVal: '50 kg crate batch',
        sizeVal: '65-75 mm uniform size',
        colourVal: 'Deep Crimson Red (Reflectance 94%)',
        defectsVal: 'Defects < 1.2%'
      }
    }
  },
  {
    id: 'prod_102',
    name: 'Sharbati Wheat (Premium Grain)',
    category: 'Grains',
    price: 38,
    unit: 'kg',
    quantity: 4500,
    location: 'Indore, Madhya Pradesh',
    description: 'Golden Sharbati wheat grains from Malwa region. High gluten strength and golden luster.',
    harvestDate: '2026-08-10',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    farmerId: 'usr_002',
    farmerName: 'Vikram Singh',
    farmerVerified: true,
    createdAt: '2026-08-10T09:00:00Z',
    farmCheck: {
      id: 'FC-2026-7811',
      productId: 'prod_102',
      productName: 'Sharbati Wheat (Premium Grain)',
      overallScore: 88,
      grade: 'GRADE A',
      verified: true,
      verificationDate: '2026-08-11 02:30 PM',
      inspector: 'FarmCheck Sensor Rig v2',
      metrics: {
        weightScore: 90,
        sizeScore: 88,
        colourScore: 87,
        defectScore: 89,
        weightVal: '100 kg bags',
        sizeVal: 'Plump Grain',
        colourVal: 'Lustrous Golden',
        defectsVal: 'Foreign matter < 0.5%'
      }
    }
  },
  {
    id: 'prod_103',
    name: 'Alphonso Mangoes (Export Quality)',
    category: 'Fruits',
    price: 650,
    unit: 'dozen',
    quantity: 350,
    location: 'Ratnagiri, Maharashtra',
    description: 'Geographically Indicated (GI) Ratnagiri Alphonso mangoes. Naturally ripened, heavenly aroma.',
    harvestDate: '2026-08-12',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    farmerId: 'usr_003',
    farmerName: 'Suresh Deoskar',
    farmerVerified: true,
    createdAt: '2026-08-12T11:20:00Z',
    farmCheck: {
      id: 'FC-2026-9023',
      productId: 'prod_103',
      productName: 'Alphonso Mangoes (Export Quality)',
      overallScore: 96,
      grade: 'GRADE A',
      verified: true,
      verificationDate: '2026-08-13 11:00 AM',
      inspector: 'FarmCheck Sensor Rig v2',
      metrics: {
        weightScore: 97,
        sizeScore: 95,
        colourScore: 98,
        defectScore: 94,
        weightVal: '250g - 300g per fruit',
        sizeVal: 'Export Grade 1',
        colourVal: 'Saffron Yellow',
        defectsVal: 'Zero blemishes'
      }
    }
  },
  {
    id: 'prod_104',
    name: 'Fresh Red Onions',
    category: 'Vegetables',
    price: 26,
    unit: 'kg',
    quantity: 8000,
    location: 'Nashik, Maharashtra',
    description: 'Pungent, dry outer skin red onions with high storage shelf life.',
    harvestDate: '2026-08-08',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    farmerId: 'usr_001',
    farmerName: 'Ramesh Patel',
    farmerVerified: true,
    createdAt: '2026-08-08T07:45:00Z',
    farmCheck: {
      id: 'FC-2026-6541',
      productId: 'prod_104',
      productName: 'Fresh Red Onions',
      overallScore: 91,
      grade: 'GRADE A',
      verified: true,
      verificationDate: '2026-08-09 09:00 AM',
      inspector: 'FarmCheck Sensor Rig v2',
      metrics: {
        weightScore: 92,
        sizeScore: 90,
        colourScore: 91,
        defectScore: 91,
        weightVal: '50 kg jute sacks',
        sizeVal: '55-65 mm',
        colourVal: 'Deep Magenta Outer',
        defectsVal: 'Defects < 2%'
      }
    }
  },
  {
    id: 'prod_105',
    name: 'Organic Turmeric Finger',
    category: 'Spices',
    price: 140,
    unit: 'kg',
    quantity: 900,
    location: 'Erode, Tamil Nadu',
    description: 'High-curcumin (5.2%) organic turmeric fingers. Sun-dried and unpolished.',
    harvestDate: '2026-08-02',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    farmerId: 'usr_004',
    farmerName: 'Karthik Subramanian',
    farmerVerified: true,
    createdAt: '2026-08-02T14:10:00Z',
    farmCheck: {
      id: 'FC-2026-4432',
      productId: 'prod_105',
      productName: 'Organic Turmeric Finger',
      overallScore: 94,
      grade: 'GRADE A',
      verified: true,
      verificationDate: '2026-08-03 04:00 PM',
      inspector: 'FarmCheck Sensor Rig v2',
      metrics: {
        weightScore: 95,
        sizeScore: 93,
        colourScore: 96,
        defectScore: 92,
        weightVal: '30 kg bags',
        sizeVal: 'Standard Finger',
        colourVal: 'Bright Ochre',
        defectsVal: 'Clean & Dry'
      }
    }
  }
];

export const initialEquipment: Equipment[] = [
  {
    id: 'eq_201',
    name: 'Mahindra 575 DI Tractor (45 HP)',
    category: 'Tractors',
    dailyPrice: 1200,
    weeklyPrice: 7500,
    monthlyPrice: 28000,
    location: 'Nashik, Maharashtra',
    description: 'Heavy duty 45 HP 4WD tractor equipped with power steering and high torque engine. Ideal for deep plowing & heavy haulage.',
    condition: 'Excellent',
    year: 2024,
    availability: 'Available',
    rating: 4.9,
    ownerId: 'usr_001',
    ownerName: 'Ramesh Patel',
    image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'eq_202',
    name: 'Shaktiman Heavy Duty Rotavator (7 ft)',
    category: 'Rotavators',
    dailyPrice: 650,
    weeklyPrice: 4000,
    location: 'Pune, Maharashtra',
    description: '7-foot multi-speed rotavator with boron steel blades for superior soil pulverization and field preparation.',
    condition: 'Good',
    year: 2023,
    availability: 'Available',
    rating: 4.7,
    ownerId: 'usr_005',
    ownerName: 'Anil Deshmukh',
    image: 'https://images.unsplash.com/photo-1530267981608-bc70a2974bce?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-07-25T11:30:00Z'
  },
  {
    id: 'eq_203',
    name: 'Kirloskar 7.5 HP Diesel Water Pump',
    category: 'Pumps',
    dailyPrice: 350,
    weeklyPrice: 2000,
    location: 'Nashik, Maharashtra',
    description: 'High discharge diesel water pump set for irrigation. Includes 100m suction & delivery hoses.',
    condition: 'Excellent',
    year: 2024,
    availability: 'Available',
    rating: 4.8,
    ownerId: 'usr_001',
    ownerName: 'Ramesh Patel',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-08-01T15:00:00Z'
  },
  {
    id: 'eq_204',
    name: 'ASPEE Tractor-Mounted Boom Sprayer (500L)',
    category: 'Sprayers',
    dailyPrice: 850,
    weeklyPrice: 5200,
    location: 'Ahmednagar, Maharashtra',
    description: '500 Litres PTO operated boom sprayer with 12m swath width. Ideal for large cotton, soybean, and onion crops.',
    condition: 'Excellent',
    year: 2023,
    availability: 'Available',
    rating: 4.9,
    ownerId: 'usr_006',
    ownerName: 'Sunil Pawar',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-08-05T09:15:00Z'
  }
];

export const initialRentals: RentalRequest[] = [
  {
    id: 'rnt_301',
    equipmentId: 'eq_201',
    equipmentName: 'Mahindra 575 DI Tractor (45 HP)',
    equipmentImage: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
    ownerId: 'usr_001',
    ownerName: 'Ramesh Patel',
    requesterId: 'usr_007',
    requesterName: 'Mahesh Gaikwad',
    startDate: '2026-08-18',
    endDate: '2026-08-21',
    durationDays: 3,
    totalPrice: 3600,
    status: 'Pending',
    message: 'Need for 3 days of deep plowing before sowing monsoon crop.',
    createdAt: '2026-08-16T12:00:00Z'
  },
  {
    id: 'rnt_302',
    equipmentId: 'eq_203',
    equipmentName: 'Kirloskar 7.5 HP Diesel Water Pump',
    equipmentImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ownerId: 'usr_001',
    ownerName: 'Ramesh Patel',
    requesterId: 'usr_008',
    requesterName: 'Ganesh Jadhav',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    durationDays: 2,
    totalPrice: 700,
    status: 'Completed',
    message: 'Emergency irrigation for tomato fields.',
    createdAt: '2026-08-09T16:20:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord_401',
    productId: 'prod_101',
    productName: 'Organic Red Tomatoes (Grade A)',
    buyerId: 'usr_009',
    buyerName: 'FreshAgro Foods Pvt Ltd',
    sellerId: 'usr_001',
    sellerName: 'Ramesh Patel',
    quantity: 500,
    unit: 'kg',
    totalPrice: 17000,
    status: 'Delivered',
    date: '2026-08-14'
  },
  {
    id: 'ord_402',
    productId: 'prod_102',
    productName: 'Sharbati Wheat (Premium Grain)',
    buyerId: 'usr_001',
    buyerName: 'Ramesh Patel',
    sellerId: 'usr_002',
    sellerName: 'Vikram Singh',
    quantity: 200,
    unit: 'kg',
    totalPrice: 7600,
    status: 'Shipped',
    date: '2026-08-15'
  }
];

