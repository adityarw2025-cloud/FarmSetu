import React, { useState } from 'react';
import { 
  Sprout, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  KeyRound,
  User,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { authService } from '../../services/authService';
import type { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [role, setRole] = useState<'Farmer' | 'Buyer'>('Farmer');
  const [showManualForm, setShowManualForm] = useState(false);

  // Signup Form State
  const [signupStep, setSignupStep] = useState<'info' | 'otp'>('info');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP Verification State
  const [otpCodeInput, setOtpCodeInput] = useState('');

  // Login Form State
  const [loginUsernameOrEmail, setLoginUsernameOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // System Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // --- 1-CLICK GOOGLE SIGN IN ---
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const res = await authService.loginWithGoogle(role);
    setLoading(false);
    if (res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  // --- STEP 1: SUBMIT SIGNUP INFO & REQUEST OTP ---
  const handleSignupInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!fullName || !phone || !email || !password) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    const res = await authService.sendPhoneOtp(phone, role, fullName);
    setLoading(false);

    if (res.success) {
      setSignupStep('otp');
      setInfoMsg(res.message);
    } else {
      setErrorMsg('Failed to send OTP code. Please check your mobile number.');
    }
  };

  // --- STEP 2: VERIFY OTP & COMPLETE REGISTRATION ---
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCodeInput || otpCodeInput.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    const otpRes = await authService.verifyPhoneOtp(phone, otpCodeInput);
    if (!otpRes.success) {
      setLoading(false);
      setErrorMsg(otpRes.error || 'Invalid OTP verification code. Try 123456.');
      return;
    }

    const regRes = await authService.signup({
      name: fullName,
      email,
      phone,
      role,
      location
    });
    setLoading(false);

    if (regRes.success && regRes.user) {
      onAuthSuccess(regRes.user);
      onClose();
    } else {
      setErrorMsg(regRes.error || 'Registration failed.');
    }
  };

  // --- LOGIN SUBMIT ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginUsernameOrEmail || !loginPassword) {
      setErrorMsg('Please enter your Username or Email and Password.');
      return;
    }

    setLoading(true);
    const res = await authService.login(loginUsernameOrEmail, loginPassword);
    setLoading(false);

    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Check username/email and password.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        maxHeight: '92vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px 14px 24px',
          borderBottom: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Sprout size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', margin: 0, letterSpacing: '-0.02em' }}>FARMSETU</h3>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>From Farm to Buyer. Connected by Data.</p>
            </div>
          </div>

          <button onClick={onClose} style={{ padding: '6px', borderRadius: '50%', background: 'var(--surface-hover)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector: Sign Up vs Login */}
        <div style={{ display: 'flex', padding: '6px', background: '#F8FAFC', borderBottom: '1px solid var(--surface-border)' }}>
          <button 
            onClick={() => { setMode('signup'); setSignupStep('info'); setErrorMsg(''); setInfoMsg(''); }} 
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: mode === 'signup' ? 'white' : 'transparent',
              color: mode === 'signup' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              border: mode === 'signup' ? '1px solid var(--surface-border)' : '1px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            ✨ Sign Up
          </button>
          <button 
            onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg(''); }} 
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: mode === 'login' ? 'white' : 'transparent',
              color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              border: mode === 'login' ? '1px solid var(--surface-border)' : '1px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            🔑 Member Login
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#FEE2E2',
              color: '#991B1B',
              fontSize: '0.825rem',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#DCFCE7',
              color: '#14532D',
              fontSize: '0.825rem',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: SIGN UP SECTION (Google First 1-Click Sign In) */}
          {/* ======================================================== */}
          {mode === 'signup' && (
            <div>
              {signupStep === 'info' ? (
                <div>
                  {/* Account Role Selector */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Account Type</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setRole('Farmer')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: `2px solid ${role === 'Farmer' ? 'var(--emerald)' : 'var(--surface-border)'}`,
                          background: role === 'Farmer' ? '#DCFCE7' : 'white',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: role === 'Farmer' ? '#14532D' : 'var(--text-muted)'
                        }}
                      >
                        🌾 Farmer Producer
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('Buyer')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: `2px solid ${role === 'Buyer' ? '#0369A1' : 'var(--surface-border)'}`,
                          background: role === 'Buyer' ? '#E0F2FE' : 'white',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: role === 'Buyer' ? '#0369A1' : 'var(--text-muted)'
                        }}
                      >
                        🛒 Produce Buyer
                      </button>
                    </div>
                  </div>

                  {/* 🏆 PRIMARY HERO ACTION: 1-CLICK GOOGLE ACCOUNT SELECTION */}
                  <div style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)',
                    border: '1px solid #BBF7D0',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                      ⚡ Instant 1-Click Registration
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      No manual typing required! Select your Google account to auto-fill your name & email.
                    </p>

                    <button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="btn"
                      style={{ 
                        width: '100%', 
                        borderRadius: '12px', 
                        padding: '12px', 
                        justify: 'center',
                        background: 'white',
                        color: '#1E293B',
                        border: '1px solid #CBD5E1',
                        boxShadow: 'var(--shadow-sm)',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}
                      disabled={loading}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Sign up with Google ({role})</span>
                    </button>
                  </div>

                  {/* OPTIONAL MANUAL FORM TOGGLE */}
                  <div style={{ textAlign: 'center', margin: '14px 0 10px 0' }}>
                    <button
                      type="button"
                      onClick={() => setShowManualForm(!showManualForm)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{showManualForm ? 'Hide Manual Form' : '── Or fill in details manually ──'}</span>
                      {showManualForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {showManualForm && (
                    <form onSubmit={handleSignupInfoSubmit} style={{ marginTop: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name / Username</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ramesh Patil"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Mobile Phone Number (+91)</label>
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder="ramesh@farmsetu.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Location (District / State)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Nashik, Maharashtra"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="Create password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-emerald" 
                        style={{ width: '100%', borderRadius: '12px', padding: '12px', marginTop: '10px' }}
                        disabled={loading}
                      >
                        {loading ? 'Sending OTP...' : 'Send OTP & Complete Registration'} <ArrowRight size={16} />
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* REALTIME OTP VERIFICATION STEP */
                <form onSubmit={handleVerifyOtpAndRegister}>
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                      <KeyRound size={26} />
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Enter 6-Digit OTP Code</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sent to mobile <strong>{phone}</strong> for account verification</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ textAlign: 'center' }}>Enter Verification Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: '1.5rem', letterSpacing: '0.4em', textAlign: 'center', fontWeight: 800 }}
                      placeholder="1 2 3 4 5 6"
                      maxLength={6}
                      value={otpCodeInput}
                      onChange={(e) => setOtpCodeInput(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-emerald" 
                    style={{ width: '100%', borderRadius: '12px', padding: '12px', marginTop: '14px' }}
                    disabled={loading}
                  >
                    {loading ? 'Verifying OTP...' : 'Verify OTP & Complete Sign Up'} <ShieldCheck size={16} />
                  </button>

                  <button 
                    type="button"
                    onClick={() => setSignupStep('info')}
                    style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  >
                    ← Edit Registration Information
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LOGIN SECTION (Username/Email + Password OR Google) */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Welcome Back to FarmSetu</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sign in with Google or enter your username/email</p>
              </div>

              {/* GOOGLE SIGN IN BUTTON IN LOGIN */}
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="btn"
                style={{ 
                  width: '100%', 
                  borderRadius: '12px', 
                  padding: '12px', 
                  justify: 'center',
                  background: 'white',
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  boxShadow: 'var(--shadow-sm)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  marginBottom: '16px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                ── OR SIGN IN WITH USERNAME & PASSWORD ──
              </div>

              <div className="form-group">
                <label className="form-label">Username or Email Address</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '38px' }}
                    placeholder="Username or email entered during signup"
                    value={loginUsernameOrEmail}
                    onChange={(e) => setLoginUsernameOrEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ paddingLeft: '38px' }}
                    placeholder="Your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-emerald" 
                style={{ width: '100%', borderRadius: '12px', padding: '12px', marginTop: '14px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
