export type ProduceCategory = 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices' | 'Organic';

export type EquipmentCategory = 'Tractors' | 'Rotavators' | 'Pumps' | 'Sprayers' | 'Harvesters' | 'Tillers';

export type QualityGrade = 'GRADE A' | 'GRADE B' | 'GRADE C' | 'UNVERIFIED';

export interface FarmCheckMetrics {
  weightScore: number; // percentage
  sizeScore: number;
  colourScore: number;
  defectScore: number;
  weightVal?: string; // e.g. "50 kg bag"
  sizeVal?: string; // e.g. "Medium - Uniform"
  colourVal?: string; // e.g. "Vibrant Natural Red"
  defectsVal?: string; // e.g. "< 2% minor surface spot"
}

export interface FarmCheckReport {
  id: string; // e.g. FC-2026-8942
  productId: string;
  productName: string;
  overallScore: number; // e.g. 92
  grade: QualityGrade;
  verified: boolean;
  metrics: FarmCheckMetrics;
  verificationDate: string;
  inspector: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProduceCategory;
  price: number; // per unit (e.g. ₹35 per kg)
  unit: string; // kg, quintal, ton
  quantity: number; // total stock available
  location: string;
  description: string;
  harvestDate: string;
  image: string;
  farmerId: string;
  farmerName: string;
  farmerVerified: boolean;
  farmCheck?: FarmCheckReport;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  dailyPrice: number; // ₹ per day
  weeklyPrice: number; // ₹ per week
  monthlyPrice?: number;
  location: string;
  description: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  year: number;
  availability: 'Available' | 'Rented' | 'Maintenance';
  rating: number; // out of 5
  ownerId: string;
  ownerName: string;
  image: string;
  createdAt: string;
}

export type RentalStatus = 'Pending' | 'Confirmed' | 'Declined' | 'Completed' | 'Cancelled';

export interface RentalRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  ownerId: string;
  ownerName: string;
  requesterId: string;
  requesterName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalPrice: number;
  status: RentalStatus;
  message?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}



export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Farmer' | 'Buyer' | 'Unified User';
  phone: string;
  location: string;
  farmSize: string; // e.g. "12 Acres"
  crops: string[]; // e.g. ["Tomatoes", "Wheat", "Sugarcane"]
  isVerified: boolean;
  avatar: string;
  joinedDate: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
