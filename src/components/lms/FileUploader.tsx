import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, Image, File, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadedFile {
  url: string;
  fileName: string;
  size: number;
}

interface FileUploaderProps {
  endpoint: '/api/upload/avatar' | '/api/upload/submission';
  accept?: string;
  maxSizeMb?: number;
  value?: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  label?: string;
  hint?: string;
  className?: string;
  /** Show image preview instead of file icon (for avatars) */
  imagePreview?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return Image;
  if (ext === 'pdf') return FileText;
  return File;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FileUploader({
  endpoint,
  accept,
  maxSizeMb = 20,
  value,
  onChange,
  label = 'Upload file',
  hint,
  className,
  imagePreview = false,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMb} MB`);
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}${endpoint}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error ?? 'Upload failed');
      }

      const data: UploadedFile = await res.json();
      onChange(data);
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [endpoint, maxSizeMb, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setError(null);
  };

  // ── Uploaded state ──────────────────────────────────────────────────────────
  if (value) {
    const Icon = fileIcon(value.fileName);
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(value.fileName);

    return (
      <div className={cn('relative', className)}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50">
          {imagePreview && isImage ? (
            <img
              src={value.url}
              alt="Preview"
              className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-emerald-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-card border border-emerald-200 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-emerald-700" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800 truncate">{value.fileName}</p>
            <p className="text-xs text-emerald-600">{formatBytes(value.size)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <button
              type="button"
              onClick={handleClear}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Remove file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Drop zone ───────────────────────────────────────────────────────────────
  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInput}
        className="sr-only"
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'w-full flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed text-center transition-all',
          dragOver
            ? 'border-primary-blue bg-primary-blue/5 scale-[1.01]'
            : uploading
            ? 'border-muted bg-muted/30 cursor-wait'
            : 'border-border hover:border-primary-blue/40 hover:bg-muted/30 cursor-pointer'
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-primary-blue animate-spin" />
            <span className="text-xs font-medium text-muted-foreground">Uploading…</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-sm text-muted-foreground"> or drag & drop</span>
            </div>
            {hint && (
              <p className="text-xs text-muted-foreground">{hint}</p>
            )}
          </>
        )}
      </button>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
