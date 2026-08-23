import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Product Image',
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 10;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');

    // 1. File Type Validation
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMsg('Unsupported format. Please upload JPG, JPEG, PNG, or WEBP.');
      return;
    }

    // 2. File Size Validation (Max 10 MB)
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${MAX_SIZE_MB}MB limit. Please select a smaller image.`);
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      let finalUrl = '';

      // Try uploading to Supabase storage if available
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split('.').pop();
        const filePath = `listings/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('farmsetu-uploads').upload(filePath, file);

        if (!uploadErr) {
          const { data } = supabase.storage.from('farmsetu-uploads').getPublicUrl(filePath);
          if (data?.publicUrl) {
            finalUrl = data.publicUrl;
          }
        }
      }

      // Fallback to high-performance Data URL for seamless offline/local operation
      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });
      }

      onChange(finalUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMsg('Failed to process image file. Please try another image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group">
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{label} {required && <span style={{ color: 'var(--color-terracotta)' }}>*</span>}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>JPG, PNG, WEBP (Max 10MB)</span>
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Error Message Alert */}
      {errorMsg && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'var(--danger-bg)',
          color: 'var(--danger)',
          fontSize: '0.8rem',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploader Box / Preview Area */}
      {uploading ? (
        <div style={{
          padding: '24px',
          borderRadius: '10px',
          border: '2px dashed var(--color-sand)',
          background: 'var(--color-rice-paper)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Loader2 size={24} className="animate-spin" color="var(--color-canopy)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-canopy)' }}>
            Processing & uploading image...
          </span>
        </div>
      ) : value ? (
        /* Image Preview State */
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '12px',
          borderRadius: '10px',
          background: 'var(--color-sand)',
          border: '1px solid #D8CEB7',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'white',
            border: '1px solid #D8CEB7'
          }}>
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback broken image replacement
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-canopy)' }}>
              <CheckCircle2 size={15} color="var(--color-sprout)" />
              <span>Image Loaded</span>
            </div>
            {fileName && (
              <div style={{ fontSize: '0.725rem', color: 'var(--color-ink-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {fileName}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '6px', padding: '5px 10px', fontSize: '0.75rem' }}
              >
                <RefreshCw size={13} />
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="btn btn-danger btn-sm"
                style={{ borderRadius: '6px', padding: '5px 10px', fontSize: '0.75rem' }}
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Trigger State */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: '10px',
            border: '2px dashed #C8BFAB',
            background: 'var(--color-rice-paper)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          className="card-interactive"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--color-sand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-canopy)'
          }}>
            <Camera size={20} />
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-canopy)' }}>
            📷 Upload Image
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--color-ink-muted)' }}>
            Click to select photo from device
          </div>
        </button>
      )}
    </div>
  );
};
