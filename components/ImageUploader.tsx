
import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ImageUploaderProps {
  folder?: string;
  currentImage?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  folder = 'staff', 
  currentImage, 
  onUpload,
  onRemove
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('لطفا یک تصویر انتخاب کنید.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      
      if (data) {
        onUpload(data.publicUrl);
      }

    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
      if(onRemove) onRemove();
  };

  return (
    <div className="w-full">
      {currentImage ? (
        <div className="relative group w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={handleRemove}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              title="حذف تصویر"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className={`
            flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors
            ${error ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}
          `}>
            {uploading ? (
              <Loader2 size={24} className="text-primary-500 animate-spin" />
            ) : (
              <>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 dark:text-slate-500">
                   <Upload size={24} className="mb-2" />
                   <p className="text-xs font-bold">آپلود تصویر</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </>
            )}
          </label>
          {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
