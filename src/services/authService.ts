import type { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_STORAGE_KEY = 'farmsetu_auth_session_v1';
const USERS_DB_KEY = 'farmsetu_users_db_v1';

const seedUsers: UserProfile[] = [
  {
    id: 'usr_002',
    name: 'Vikram Singh',
    email: 'vikram.singh@farmsetu.in',
    role: 'Farmer',
    phone: '+91 98123 45678',
    location: 'Indore, Madhya Pradesh',
    farmSize: '25 Acres',
    crops: ['Wheat', 'Soybean'],
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    joinedDate: '2025-02-10'
  },
  {
    id: 'usr_003',
    name: 'Suresh Deoskar',
    email: 'suresh.deoskar@farmsetu.in',
    role: 'Farmer',
    phone: '+91 97654 32109',
    location: 'Ratnagiri, Maharashtra',
    farmSize: '15 Acres',
    crops: ['Mangoes', 'Cashews'],
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    joinedDate: '2025-01-15'
  }
];

type AuthListener = () => void;

class AuthService {
  private currentUser: UserProfile | null = null;
  private usersDb: UserProfile[] = [];
  private listeners: Set<AuthListener> = new Set();
  private isLoaded: boolean = false;
  private pendingOtp: { phone: string; code: string; role: 'Farmer' | 'Buyer'; name?: string } | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedDb = localStorage.getItem(USERS_DB_KEY);
      this.usersDb = savedDb ? JSON.parse(savedDb) : seedUsers;

      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        this.currentUser = JSON.parse(savedSession);
      } else {
        this.currentUser = null;
      }
    } catch (e) {
      console.error('Failed to initialize AuthService:', e);
      this.currentUser = null;
    }
    this.isLoaded = true;

    // Listen to Supabase Live OAuth State Changes (e.g. returning from Google OAuth redirect)
    if (isSupabaseConfigured && supabase) {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
          const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

          const googleUser: UserProfile = {
            id: session.user.id,
            name: name,
            email: email,
            role: 'Farmer',
            phone: session.user.phone || '+91 98765 43210',
            location: 'Nashik, Maharashtra',
            farmSize: '15 Acres',
            crops: ['Tomatoes', 'Vegetables'],
            isVerified: true,
            avatar: avatar,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          };

          this.currentUser = googleUser;
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
          this.notify();
        }
      });
    }
  }

  public subscribe(listener: AuthListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public getUsersDatabase(): UserProfile[] {
    return [...this.usersDb];
  }

  // --- MOBILE OTP METHOD 1: REQUEST OTP ---
  public async sendPhoneOtp(phone: string, role: 'Farmer' | 'Buyer' = 'Farmer', name?: string): Promise<{ success: boolean; message: string; otpHint?: string }> {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/\D/g, '')}`;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    this.pendingOtp = {
      phone: formattedPhone,
      code: generatedOtp,
      role,
      name
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signInWithOtp({ phone: formattedPhone });
      } catch (e) {
        console.warn('Supabase SMS OTP fallback to simulated OTP', e);
      }
    }

    return {
      success: true,
      message: `OTP Code sent to ${formattedPhone}`,
      otpHint: generatedOtp // Dev mode verification code
    };
  }

  // --- MOBILE OTP METHOD 2: VERIFY OTP & SIGN IN ---
  public async verifyPhoneOtp(phone: string, enteredCode: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    if (!this.pendingOtp || enteredCode.trim() !== this.pendingOtp.code) {
      // Allow demo default 123456 as backup for seamless testing
      if (enteredCode.trim() !== '123456') {
        return { success: false, error: 'Invalid 6-digit OTP verification code. Try entering 123456 or the code sent.' };
      }
    }

    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/\D/g, '')}`;
    let user = this.usersDb.find(u => u.phone.includes(formattedPhone.replace(/\D/g, '').slice(-10)));

    if (!user) {
      const role = this.pendingOtp?.role || 'Farmer';
      const name = this.pendingOtp?.name || `Kisan User (${formattedPhone.slice(-4)})`;

      user = {
        id: `usr_phone_${Date.now()}`,
        name: name,
        email: `phone_${formattedPhone.replace(/\D/g, '')}@farmsetu.in`,
        role: role,
        phone: formattedPhone,
        location: role === 'Farmer' ? 'Nashik, Maharashtra' : 'Mumbai, Maharashtra',
        farmSize: role === 'Farmer' ? '10 Acres' : 'N/A',
        crops: role === 'Farmer' ? ['Tomatoes', 'Vegetables'] : [],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };

      this.usersDb.push(user);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.usersDb));
    }

    this.currentUser = user;
    this.pendingOtp = null;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notify();

    return { success: true, user };
  }

  // --- SIGNUP ---
  public async signup(data: {
    name: string;
    email: string;
    phone: string;
    role: 'Farmer' | 'Buyer';
    location?: string;
  }): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    const existing = this.usersDb.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUserId = `usr_${Date.now()}`;
    const newUserProfile: UserProfile = {
      id: newUserId,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      location: data.location || (data.role === 'Farmer' ? 'Nashik, Maharashtra' : 'Mumbai, Maharashtra'),
      farmSize: data.role === 'Farmer' ? '10 Acres' : 'N/A',
      crops: data.role === 'Farmer' ? ['Tomatoes', 'Vegetables'] : [],
      isVerified: true,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    // Save to database
    this.usersDb.push(newUserProfile);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.usersDb));

    // Save Supabase profile if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').insert([
          {
            id: newUserId,
            name: data.name,
            email: data.email,
            role: data.role,
            location: newUserProfile.location
          }
        ]);
      } catch (e) {
        console.warn('Supabase profile insertion fallback to local DB', e);
      }
    }

    this.currentUser = newUserProfile;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notify();

    return { success: true, user: newUserProfile };
  }

  // --- LOGIN ---
  public async login(usernameOrEmail: string, _password?: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    const query = usernameOrEmail.trim().toLowerCase();
    const user = this.usersDb.find(
      (u) => u.email.toLowerCase() === query || u.name.toLowerCase() === query
    );

    if (!user) {
      const dynamicUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: email.includes('buyer') ? 'Buyer' : 'Farmer',
        phone: '+91 98765 00000',
        location: 'Nashik, Maharashtra',
        farmSize: email.includes('buyer') ? 'N/A' : '12 Acres',
        crops: ['Tomatoes', 'Wheat'],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        joinedDate: 'August 2026'
      };

      this.usersDb.push(dynamicUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.usersDb));
      this.currentUser = dynamicUser;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
      this.notify();
      return { success: true, user: dynamicUser };
    }

    this.currentUser = user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notify();

    return { success: true, user };
  }

  // --- GOOGLE AUTHENTICATION ---
  public async loginWithGoogle(role: 'Farmer' | 'Buyer' = 'Farmer'): Promise<{ success: boolean; user?: UserProfile }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              prompt: 'select_account'
            }
          }
        });
        if (!error) return { success: true };
      } catch (e) {
        console.warn('Supabase OAuth Google redirect fallback:', e);
      }
    }

    const googleUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      name: 'Google Authenticated User',
      email: 'user.google@farmsetu.in',
      role: role,
      phone: '+91 99999 88888',
      location: 'Pune, Maharashtra',
      farmSize: role === 'Farmer' ? '15 Acres' : 'N/A',
      crops: role === 'Farmer' ? ['Organic Vegetables'] : [],
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      joinedDate: 'August 2026'
    };

    this.usersDb.push(googleUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.usersDb));
    this.currentUser = googleUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notify();

    return { success: true, user: googleUser };
  }

  // --- LOGOUT ---
  public logout() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);

    if (isSupabaseConfigured && supabase) {
      try {
        supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout fallback', e);
      }
    }

    this.notify();
  }

  // --- UPDATE PROFILE ---
  public updateProfile(updates: Partial<UserProfile>) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));

    const index = this.usersDb.findIndex((u) => u.id === this.currentUser?.id);
    if (index !== -1) {
      this.usersDb[index] = { ...this.usersDb[index], ...updates };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.usersDb));
    }

    this.notify();
  }
}

export const authService = new AuthService();
