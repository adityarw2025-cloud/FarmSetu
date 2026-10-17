import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Bot, 
  Image as ImageIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { analyzeCropDisease, SAMPLE_LEAVES } from '../../services/cropCareService';
import type { CropDiseaseDiagnosis } from '../../types';

interface CropCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFarmAI?: (prompt?: string) => void;
}

type ScanStage = 'viewfinder' | 'analyzing' | 'result';

export const CropCareModal: React.FC<CropCareModalProps> = ({
  isOpen,
  onClose,
  onNavigateToFarmAI
}) => {
  const [stage, setStage] = useState<ScanStage>('viewfinder');
  const [activeInputTab, setActiveInputTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<CropDiseaseDiagnosis | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('Initializing AI inference engine...');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream when camera tab is active
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (stage === 'viewfinder' && activeInputTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, stage, activeInputTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported on this device/browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please enable camera access in browser settings or upload a leaf photo.'
          : 'Unable to start camera preview. Please switch to file upload or select a test leaf.'
      );
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture frame from active video stream
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      triggerAnalysis(dataUrl);
    }
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      stopCamera();
      triggerAnalysis(url);
    };
    reader.readAsDataURL(file);
  };

  // Handle sample selection
  const handleSelectSample = (sampleId: string, imageUrl: string) => {
    stopCamera();
    triggerAnalysis(imageUrl, sampleId);
  };

  // Run AI analysis simulation
  const triggerAnalysis = (imageUrl: string, sampleId?: string) => {
    setCapturedImage(imageUrl);
    setStage('analyzing');
    setAnalysisProgress(15);
    setAnalysisStepText('Segmenting leaf contours & morphology...');

    const stepInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev < 45) {
          setAnalysisStepText('Extracting chlorotic lesions & fungal spores...');
          return prev + 12;
        } else if (prev < 80) {
          setAnalysisStepText('Classifying pathological patterns with Neural Vision model...');
          return prev + 10;
        } else if (prev < 95) {
          setAnalysisStepText('Formulating organic remedies & agronomic prescription...');
          return prev + 5;
        }
        return prev;
      });
    }, 280);

    analyzeCropDisease(imageUrl, sampleId)
      .then(res => {
        clearInterval(stepInterval);
        setAnalysisProgress(100);
        setTimeout(() => {
          setDiagnosis(res);
          setStage('result');
        }, 350);
      })
      .catch(() => {
        clearInterval(stepInterval);
        setStage('viewfinder');
      });
  };

  const handleReset = () => {
    setStage('viewfinder');
    setCapturedImage(null);
    setDiagnosis(null);
    setAnalysisProgress(0);
  };

  const handleClose = () => {
    stopCamera();
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 36, 25, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          backgroundColor: '#FAF6EC',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(224, 167, 46, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Shutter Flash Animation */}
        {flashEffect && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'white',
            zIndex: 110,
            pointerEvents: 'none',
            animation: 'flash 0.2s ease-out'
          }} />
        )}

        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1B4332 0%, #0F2419 100%)',
          color: '#FAF6EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(224, 167, 46, 0.2)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(224, 167, 46, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E0A72E'
              }}>
                <Sparkles size={18} />
              </div>
              <h2 style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-display, "Zilla Slab", serif)',
                fontWeight: 700,
                color: '#FAF6EC',
                margin: 0
              }}>
                FarmSetu CropCare AI
              </h2>
            </div>
            <p style={{
              fontSize: '0.725rem',
              color: '#D2E5DA',
              marginTop: '2px',
              fontStyle: 'italic',
              fontWeight: 500
            }}>
              Capture. Detect. Protect.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '20px',
              background: 'rgba(224, 167, 46, 0.2)',
              color: '#E0A72E',
              border: '1px solid rgba(224, 167, 46, 0.4)',
              whiteSpace: 'nowrap'
            }}>
              AI-powered feature in development
            </span>
            <button 
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FAF6EC',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          
          {/* STAGE 1: VIEWFINDER & INPUT MODES */}
          {stage === 'viewfinder' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Tab Selector */}
              <div style={{
                display: 'flex',
                background: '#F0EAD8',
                borderRadius: '12px',
                padding: '4px',
                gap: '4px'
              }}>
                <button
                  onClick={() => { setActiveInputTab('camera'); setCameraError(null); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: activeInputTab === 'camera' ? '#1B4332' : 'transparent',
                    color: activeInputTab === 'camera' ? '#FAF6EC' : '#5F5E5A',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Camera size={16} />
                  <span>Live Camera</span>
                </button>

                <button
                  onClick={() => setActiveInputTab('upload')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: activeInputTab === 'upload' ? '#1B4332' : 'transparent',
                    color: activeInputTab === 'upload' ? '#FAF6EC' : '#5F5E5A',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={16} />
                  <span>Upload Photo</span>
                </button>

                <button
                  onClick={() => setActiveInputTab('samples')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: activeInputTab === 'samples' ? '#1B4332' : 'transparent',
                    color: activeInputTab === 'samples' ? '#FAF6EC' : '#5F5E5A',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Sparkles size={16} />
                  <span>Test Presets</span>
                </button>
              </div>

              {/* TAB CONTENT: CAMERA */}
              {activeInputTab === 'camera' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cameraError ? (
                    <div style={{
                      height: '260px',
                      borderRadius: '16px',
                      background: '#FFF5F5',
                      border: '2px dashed #B5533C',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <AlertTriangle size={36} color="#B5533C" style={{ marginBottom: '10px' }} />
                      <p style={{ fontSize: '0.85rem', color: '#1F2420', fontWeight: 600, maxWidth: '320px' }}>
                        {cameraError}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button
                          onClick={startCamera}
                          style={{
                            padding: '8px 14px',
                            background: '#1B4332',
                            color: '#FAF6EC',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Retry Camera
                        </button>
                        <button
                          onClick={() => setActiveInputTab('upload')}
                          style={{
                            padding: '8px 14px',
                            background: '#E0A72E',
                            color: '#412402',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Upload Photo Instead
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      position: 'relative',
                      height: '280px',
                      backgroundColor: '#0F2419',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)'
                    }}>
                      {/* Video Stream Element */}
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />

                      {/* AR Targeting Bounding Corners & Scanner Animation */}
                      <div style={{
                        position: 'absolute',
                        inset: '24px',
                        pointerEvents: 'none',
                        border: '2px solid rgba(79, 139, 91, 0.4)',
                        borderRadius: '16px'
                      }}>
                        {/* Corner Accents */}
                        <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '24px', height: '24px', borderTop: '4px solid #4F8B5B', borderLeft: '4px solid #4F8B5B', borderTopLeftRadius: '12px' }} />
                        <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '24px', height: '24px', borderTop: '4px solid #4F8B5B', borderRight: '4px solid #4F8B5B', borderTopRightRadius: '12px' }} />
                        <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '24px', height: '24px', borderBottom: '4px solid #4F8B5B', borderLeft: '4px solid #4F8B5B', borderBottomLeftRadius: '12px' }} />
                        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderBottom: '4px solid #4F8B5B', borderRight: '4px solid #4F8B5B', borderBottomRightRadius: '12px' }} />

                        {/* Animated Laser Scanning Line */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, transparent, #4F8B5B, #E0A72E, transparent)',
                          boxShadow: '0 0 10px #4F8B5B, 0 0 5px #E0A72E',
                          animation: 'scanLaser 2.2s ease-in-out infinite'
                        }} />

                        {/* Center Reticle */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'rgba(250, 246, 236, 0.7)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}>
                          Place affected leaf inside frame
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Camera Controls Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '8px 0'
                  }}>
                    {/* Gallery Upload shortcut */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#F0EAD8',
                        border: '1px solid #E0A72E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1B4332',
                        cursor: 'pointer'
                      }}
                      title="Upload from Gallery"
                    >
                      <ImageIcon size={20} />
                    </button>

                    {/* Shutter Capture Button */}
                    <button
                      onClick={handleCapturePhoto}
                      disabled={!isCameraActive}
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        background: isCameraActive ? '#E0A72E' : '#C4C4C4',
                        border: '4px solid #1B4332',
                        boxShadow: isCameraActive ? '0 0 18px rgba(224, 167, 46, 0.6)' : 'none',
                        cursor: isCameraActive ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s, background 0.2s'
                      }}
                      aria-label="Capture Photo"
                    >
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: '#FAF6EC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Camera size={26} color="#1B4332" />
                      </div>
                    </button>

                    {/* Camera restart button */}
                    <button
                      onClick={startCamera}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#F0EAD8',
                        border: '1px solid #E0A72E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1B4332',
                        cursor: 'pointer'
                      }}
                      title="Restart Camera"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: UPLOAD */}
              {activeInputTab === 'upload' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: '240px',
                      borderRadius: '18px',
                      border: '2px dashed #4F8B5B',
                      background: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'rgba(79, 139, 91, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4F8B5B',
                      marginBottom: '12px'
                    }}>
                      <Upload size={26} />
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontFamily: 'var(--font-display, "Zilla Slab", serif)',
                      fontWeight: 700,
                      color: '#1B4332',
                      marginBottom: '4px'
                    }}>
                      Upload Crop Photo
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#5F5E5A', maxWidth: '280px' }}>
                      Tap to select an image from your photo gallery or files (JPG, PNG, WebP)
                    </p>
                    <span style={{
                      marginTop: '12px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: '#E0A72E',
                      color: '#412402',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      Browse Device Photos
                    </span>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: TEST SAMPLES */}
              {activeInputTab === 'samples' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '0.78rem', color: '#5F5E5A', margin: 0 }}>
                    Select a realistic leaf specimen to test the AI detection workflow instantly:
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '10px'
                  }}>
                    {SAMPLE_LEAVES.map(sample => (
                      <div
                        key={sample.id}
                        onClick={() => handleSelectSample(sample.id, sample.image)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px',
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #F0EAD8',
                          cursor: 'pointer',
                          transition: 'transform 0.15s, box-shadow 0.15s'
                        }}
                      >
                        <img 
                          src={sample.image} 
                          alt={sample.condition}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#1B4332',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {sample.crop}: {sample.condition}
                          </h4>
                          <span style={{
                            fontSize: '0.7rem',
                            color: '#5F5E5A',
                            display: 'block'
                          }}>
                            {sample.tag}
                          </span>
                        </div>
                        <ChevronRight size={16} color="#E0A72E" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* STAGE 2: AI SCANNING ANIMATION */}
          {stage === 'analyzing' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 10px',
              textAlign: 'center',
              gap: '16px'
            }}>
              <div style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(27, 67, 50, 0.25)',
                border: '3px solid #1B4332'
              }}>
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Scanning Leaf"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}

                {/* Biometric Scanning Grid */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(79, 139, 91, 0.4) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  pointerEvents: 'none'
                }} />

                {/* Vertical Laser Scan */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: '#E0A72E',
                  boxShadow: '0 0 12px #E0A72E, 0 0 6px #4F8B5B',
                  animation: 'scanLaser 1.4s ease-in-out infinite'
                }} />
              </div>

              <div style={{ width: '100%', maxWidth: '380px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1B4332' }}>
                    AI Pathology Analysis
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 700,
                    color: '#E0A72E'
                  }}>
                    {analysisProgress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '10px',
                  background: '#F0EAD8',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${analysisProgress}%`,
                    background: 'linear-gradient(90deg, #1B4332, #4F8B5B, #E0A72E)',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <p style={{
                  fontSize: '0.78rem',
                  color: '#5F5E5A',
                  marginTop: '10px',
                  minHeight: '20px'
                }}>
                  {analysisStepText}
                </p>
              </div>
            </div>
          )}

          {/* STAGE 3: RESULTS & TREATMENT GUIDANCE */}
          {stage === 'result' && diagnosis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s ease' }}>
              
              {/* Diagnosis Top Card */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #F0EAD8',
                display: 'flex',
                gap: '14px',
                boxShadow: '0 4px 12px rgba(31, 36, 32, 0.05)'
              }}>
                <img 
                  src={diagnosis.imageUrl} 
                  alt={diagnosis.diseaseName}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: diagnosis.severity === 'None (Healthy)' ? '#E8F3EA' : '#FDF0ED',
                      color: diagnosis.severity === 'None (Healthy)' ? '#1B4332' : '#B5533C'
                    }}>
                      Severity: {diagnosis.severity}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#1B4332',
                      color: '#FAF6EC',
                      fontFamily: 'var(--font-mono, monospace)'
                    }}>
                      {diagnosis.confidenceScore}% Confidence
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-display, "Zilla Slab", serif)',
                    fontWeight: 700,
                    color: '#1B4332',
                    margin: '2px 0'
                  }}>
                    {diagnosis.diseaseName}
                  </h3>

                  {diagnosis.scientificName && (
                    <p style={{ fontSize: '0.72rem', color: '#5F5E5A', fontStyle: 'italic', margin: 0 }}>
                      Pathogen: {diagnosis.scientificName}
                    </p>
                  )}
                  <p style={{ fontSize: '0.72rem', color: '#5F5E5A', marginTop: '2px' }}>
                    Crop: <strong>{diagnosis.cropName}</strong>
                  </p>
                </div>
              </div>

              {/* Identified Symptoms */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid #F0EAD8'
              }}>
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1B4332',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <Info size={16} color="#E0A72E" />
                  <span>Visible Pathology & Symptoms</span>
                </h4>
                <ul style={{
                  paddingLeft: '18px',
                  margin: 0,
                  fontSize: '0.78rem',
                  color: '#1F2420',
                  lineHeight: 1.5
                }}>
                  {diagnosis.symptoms.map((sym, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>{sym}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Treatments & Remedies */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid #F0EAD8'
              }}>
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1B4332',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <ShieldCheck size={16} color="#4F8B5B" />
                  <span>Immediate Organic & Bio-Remedies</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {diagnosis.organicTreatment.map((cure, i) => (
                    <div 
                      key={i}
                      style={{
                        padding: '8px 10px',
                        background: '#E8F3EA',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        color: '#0F2419',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={14} color="#4F8B5B" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{cure}</span>
                    </div>
                  ))}
                </div>

                {diagnosis.chemicalTreatment && diagnosis.chemicalTreatment.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B5533C' }}>
                      Recommended Fungicide (If severe field spread):
                    </span>
                    <ul style={{ paddingLeft: '18px', margin: '4px 0 0 0', fontSize: '0.75rem', color: '#5F5E5A' }}>
                      {diagnosis.chemicalTreatment.map((chem, i) => (
                        <li key={i}>{chem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Cultural Prevention & Field Guidance */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid #F0EAD8'
              }}>
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1B4332',
                  marginBottom: '6px'
                }}>
                  Preventive Cultural Practices
                </h4>
                <ul style={{
                  paddingLeft: '18px',
                  margin: 0,
                  fontSize: '0.78rem',
                  color: '#5F5E5A',
                  lineHeight: 1.5
                }}>
                  {diagnosis.preventiveMeasures.map((prev, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>{prev}</li>
                  ))}
                </ul>
              </div>

              {/* Agronomist Advisory Fallback */}
              <div style={{
                background: '#FFF9EB',
                borderRadius: '14px',
                padding: '12px 14px',
                border: '1px solid rgba(224, 167, 46, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#412402', margin: 0 }}>
                    Unsure or need field verification?
                  </h5>
                  <p style={{ fontSize: '0.72rem', color: '#5F5E5A', margin: 0 }}>
                    Connect with an authorized agronomist or discuss with FarmAI.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      if (onNavigateToFarmAI) {
                        onClose();
                        onNavigateToFarmAI(`My crop was diagnosed with ${diagnosis.diseaseName}. What is the best organic spray schedule for Indian farming conditions?`);
                      }
                    }}
                    style={{
                      padding: '6px 10px',
                      background: '#1B4332',
                      color: '#FAF6EC',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Bot size={13} />
                    <span>Ask FarmAI</span>
                  </button>

                  <button
                    onClick={() => setExpertModalOpen(true)}
                    style={{
                      padding: '6px 10px',
                      background: '#E0A72E',
                      color: '#412402',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <PhoneCall size={13} />
                    <span>Call Expert</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #1B4332',
                    background: '#FAF6EC',
                    color: '#1B4332',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={16} />
                  <span>Scan Another Leaf</span>
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#1B4332',
                    color: '#FAF6EC',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Expert Consultation Dialog */}
      {expertModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FAF6EC',
            borderRadius: '20px',
            maxWidth: '380px',
            width: '100%',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#E8F3EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <PhoneCall size={24} color="#1B4332" />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#1B4332', marginBottom: '6px' }}>
              Agricultural Extension Helpline
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#5F5E5A', marginBottom: '16px' }}>
              Connect directly with FarmSetu’s certified crop pathologists (Available 8 AM - 7 PM).
            </p>
            <div style={{
              background: '#FFFFFF',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #F0EAD8',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700,
              color: '#1B4332',
              fontSize: '1.05rem'
            }}>
              📞 1800-FARMCROP (Toll-Free)
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setExpertModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: '#F0EAD8',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <a
                href="tel:18001801551"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: '#1B4332',
                  color: '#FAF6EC',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Component CSS animations */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0.9; }
          50% { top: 96%; opacity: 1; }
          100% { top: 0%; opacity: 0.9; }
        }
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
