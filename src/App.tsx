import { useState, useEffect } from 'react';
import { store } from './services/store';
import { authService } from './services/authService';
import { Sidebar } from './components/common/Sidebar';
import type { NavTab } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Toast } from './components/common/Toast';
import type { ToastMessage } from './components/common/Toast';
import { EurekaDemoBar } from './components/common/EurekaDemoBar';
import { AuthModal } from './components/auth/AuthModal';

// Feature Pages
import { LandingPage } from './components/landing/LandingPage';
import { FarmerDashboard } from './components/dashboard/FarmerDashboard';
import { BuyerDashboard } from './components/dashboard/BuyerDashboard';
import { Marketplace } from './components/marketplace/Marketplace';
import { MyFarm } from './components/myfarm/MyFarm';
import { FarmCheckTool } from './components/myfarm/FarmCheckTool';
import { FarmIntelligence } from './components/intelligence/FarmIntelligence';
import { EquipmentHub } from './components/equipment/EquipmentHub';
import { MyActivity } from './components/activity/MyActivity';
import { FarmAI } from './components/farmAI/FarmAI';
import { UserProfileView } from './components/profile/UserProfile';
import { VerifyReport } from './components/verify/VerifyReport';

import type { Product, Equipment, FarmCheckReport, UserProfile } from './types';

export function App() {
  // Auth Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Active Tab State (Default to 'landing' for unauthenticated visitors)
  const [activeTab, setActiveTab] = useState<NavTab>(
    authService.getCurrentUser() ? 'home' : 'landing'
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Verification Report ID State for /verify/:id
  const [verifyReportId, setVerifyReportId] = useState<string | null>(null);

  // Store Reactive State
  const [products, setProducts] = useState(store.getProducts());
  const [equipment, setEquipment] = useState(store.getEquipment());
  const [rentals, setRentals] = useState(store.getRentals());
  const [orders, setOrders] = useState(store.getOrders());

  useEffect(() => {
    // Subscribe to Store updates
    const unsubscribeStore = store.subscribe(() => {
      setProducts(store.getProducts());
      setEquipment(store.getEquipment());
      setRentals(store.getRentals());
      setOrders(store.getOrders());
    });

    // Subscribe to Auth updates
    const unsubscribeAuth = authService.subscribe(() => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    });

    return () => {
      unsubscribeStore();
      unsubscribeAuth();
    };
  }, []);

  const showToast = (type: ToastMessage['type'], title: string, text?: string) => {
    setToast({ id: `${Date.now()}`, type, title, text });
  };

  // Open Auth Modal helper
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Logout Handler
  const handleLogout = () => {
    authService.logout();
    setActiveTab('landing');
    showToast('info', 'Logged Out', 'You have been signed out. Protected pages are now restricted.');
  };

  // Guard tab switcher for protected routes
  const handleNavigate = (tab: NavTab) => {
    setIsMobileMenuOpen(false);
    const protectedTabs: NavTab[] = ['home', 'myfarm', 'profile', 'activity', 'my-equipment', 'rentals'];
    if (!currentUser && protectedTabs.includes(tab)) {
      handleOpenAuth('login');
      return;
    }
    setActiveTab(tab);
  };

  // Product Actions
  const handleAddProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'farmerId' | 'farmerName' | 'farmerVerified'>) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const newP = store.addProduct(prodData);
    showToast('success', 'Product Listed Successfully', `${newP.name} is now live on the marketplace.`);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    store.updateProduct(id, updates);
    showToast('success', 'Listing Updated', 'Product changes have been persisted.');
  };

  const handleRemoveProduct = (id: string) => {
    store.removeProduct(id);
    showToast('info', 'Listing Removed', 'The produce listing was deleted.');
  };

  const handleSaveFarmCheckReport = (productId: string, report: FarmCheckReport) => {
    store.attachFarmCheckReport(productId, report);
    showToast('success', 'FarmCheck Report Issued!', `Score: ${report.overallScore}/100 (${report.grade}) attached to product.`);
  };

  // Equipment Actions
  const handleAddEquipment = (equipData: Omit<Equipment, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'rating'>) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const newE = store.addEquipment(equipData);
    showToast('success', 'Equipment Listed', `${newE.name} is now available for rental.`);
  };

  const handleUpdateEquipment = (id: string, updates: Partial<Equipment>) => {
    store.updateEquipment(id, updates);
    showToast('success', 'Equipment Updated');
  };

  const handleRemoveEquipment = (id: string) => {
    store.removeEquipment(id);
    showToast('info', 'Equipment Removed');
  };

  const handleRequestRental = (req: { equipmentId: string; startDate: string; endDate: string; durationDays: number; totalPrice: number; message?: string }) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const r = store.createRentalRequest(req);
    if (r) {
      showToast('success', 'Rental Request Sent', `Booking request for ${r.equipmentName} sent to owner.`);
    }
  };

  const handleUpdateRentalStatus = (id: string, status: any) => {
    store.updateRentalStatus(id, status);
    showToast('info', 'Rental Status Updated', `Rental ID ${id} set to ${status}.`);
  };

  // Order Action
  const handleBuyProduct = (productId: string, quantity: number) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const order = store.createOrder(productId, quantity);
    if (order) {
      showToast('success', 'Order Confirmed!', `Direct harvest order created for ${order.productName}.`);
    } else {
      showToast('error', 'Order Failed', 'Insufficient stock or invalid product.');
    }
  };

  // QR Report Opener
  const handleOpenQRReport = (reportId: string) => {
    setVerifyReportId(reportId);
  };

  // If public landing page selected
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage 
          onNavigate={handleNavigate} 
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setActiveTab('home');
            showToast('success', `Welcome, ${user.name}!`, `Logged in as ${user.role}.`);
          }}
        />
      </>
    );
  }

  // If standalone QR verification route active
  if (verifyReportId) {
    const allReports = products.map(p => p.farmCheck).filter(Boolean) as FarmCheckReport[];
    return (
      <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-app)' }}>
        <VerifyReport 
          reportId={verifyReportId} 
          reports={allReports} 
          onBack={() => setVerifyReportId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('home');
          showToast('success', `Welcome, ${user.name}!`, `Logged in as ${user.role}.`);
        }}
      />

      {/* Desktop Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main App Content Area */}
      <div className="main-content">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={handleNavigate} 
          profile={currentUser} 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        <main className="page-body">
          {activeTab === 'home' && (
            currentUser ? (
              currentUser.role === 'Farmer' ? (
                <FarmerDashboard 
                  currentUser={currentUser}
                  products={products}
                  orders={orders}
                  onNavigate={handleNavigate}
                  onOpenAddProductModal={() => handleNavigate('myfarm')}
                />
              ) : (
                <BuyerDashboard 
                  currentUser={currentUser}
                  products={products}
                  orders={orders}
                  onNavigate={handleNavigate}
                  onSelectProduct={(_p) => handleNavigate('marketplace')}
                />
              )
            ) : (
              <LandingPage 
                onNavigate={handleNavigate} 
                currentUser={currentUser}
                onOpenAuth={handleOpenAuth}
                onLogout={handleLogout}
              />
            )
          )}

          {activeTab === 'marketplace' && (
            <Marketplace 
              products={products}
              equipment={equipment}
              currentUser={currentUser}
              onBuyProduct={handleBuyProduct}
              onOpenQRReport={handleOpenQRReport}
              onOpenEquipmentRentModal={() => handleNavigate('equipment')}
              onEditProduct={() => handleNavigate('myfarm')}
            />
          )}

          {activeTab === 'myfarm' && (
            <MyFarm 
              products={products}
              currentUser={currentUser}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onRemoveProduct={handleRemoveProduct}
              onRunFarmCheck={() => handleNavigate('farmcheck')}
            />
          )}

          {activeTab === 'farmcheck' && (
            <FarmCheckTool 
              products={products}
              onSaveReport={handleSaveFarmCheckReport}
              onOpenQRReport={handleOpenQRReport}
            />
          )}

          {activeTab === 'intelligence' && (
            <FarmIntelligence 
              profile={currentUser}
              onToggleHardware={() => {}}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentHub 
              equipment={equipment}
              rentals={rentals}
              currentUser={currentUser}
              activeSubTab="find"
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              onRemoveEquipment={handleRemoveEquipment}
              onRequestRental={handleRequestRental}
              onUpdateRentalStatus={handleUpdateRentalStatus}
            />
          )}

          {activeTab === 'my-equipment' && (
            <EquipmentHub 
              equipment={equipment}
              rentals={rentals}
              currentUser={currentUser}
              activeSubTab="my-equipment"
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              onRemoveEquipment={handleRemoveEquipment}
              onRequestRental={handleRequestRental}
              onUpdateRentalStatus={handleUpdateRentalStatus}
            />
          )}

          {activeTab === 'rentals' && (
            <EquipmentHub 
              equipment={equipment}
              rentals={rentals}
              currentUser={currentUser}
              activeSubTab="rentals"
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              onRemoveEquipment={handleRemoveEquipment}
              onRequestRental={handleRequestRental}
              onUpdateRentalStatus={handleUpdateRentalStatus}
            />
          )}

          {activeTab === 'activity' && (
            <MyActivity 
              orders={orders}
              rentals={rentals}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'farmAI' && (
            <FarmAI />
          )}

          {activeTab === 'profile' && (
            <UserProfileView 
              profile={currentUser}
              products={products}
              equipment={equipment}
              onUpdateProfile={(updates) => {
                authService.updateProfile(updates);
                showToast('success', 'Profile Saved');
              }}
              onOpenAuth={handleOpenAuth}
            />
          )}
        </main>
      </div>

      {/* Eureka Demo Pipeline Bar */}
      <EurekaDemoBar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate}
        onOpenProductModal={() => handleNavigate('marketplace')}
        onOpenEquipmentModal={() => handleNavigate('equipment')}
      />
    </div>
  );
}
