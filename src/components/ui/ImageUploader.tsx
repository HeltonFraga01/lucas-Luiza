"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  preset?: "hero" | "story" | "general";
  hint?: string;
  aspectRatio?: string; // e.g. "16/9", "4/3"
}

export default function ImageUploader({
  label,
  value,
  onChange,
  preset = "general",
  hint,
  aspectRatio = "16/9",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [uploadInfo, setUploadInfo] = useState<{
    width?: number;
    height?: number;
    size?: number;
    originalSize?: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");
      setUploadInfo(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("preset", preset);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erro ao enviar imagem");
        }

        onChange(data.url);
        setUploadInfo({
          width: data.width,
          height: data.height,
          size: data.size,
          originalSize: data.originalSize,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro ao enviar";
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [onChange, preset]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasImage = value && value.length > 0 && value !== "/hero-bg.jpg" && value !== "/story.jpg";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
        {label}
      </label>

      {/* Drop Zone / Preview */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200 group
          ${dragOver
            ? "border-cornflower bg-ice-blue/50 scale-[1.01]"
            : hasImage
              ? "border-dust hover:border-cornflower"
              : "border-dust/60 hover:border-cornflower/60 bg-parchment/50"
          }
          ${uploading ? "opacity-60 pointer-events-none" : ""}
        `}
        style={{ aspectRatio }}
      >
        {hasImage ? (
          <>
            {/* Image preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                <p className="text-pearl font-sans text-sm font-medium">
                  📷 Trocar imagem
                </p>
                <p className="text-pearl/60 font-sans text-[10px] mt-1">
                  Clique ou arraste
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="text-3xl opacity-30">🖼️</div>
            <p className="text-stone/60 font-sans text-xs text-center">
              {uploading ? (
                <span className="animate-pulse">Processando imagem...</span>
              ) : (
                <>
                  <span className="font-medium text-cornflower">Clique para selecionar</span>
                  {" "}ou arraste a imagem aqui
                </>
              )}
            </p>
            <p className="text-stone/40 font-sans text-[10px]">
              JPG, PNG, WebP · Máximo 10MB
            </p>
          </div>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-pearl/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-cornflower border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-sans text-stone">Otimizando imagem...</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="text-xs font-sans text-red-500 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}

      {/* Upload info */}
      {uploadInfo && (
        <div className="flex items-center gap-3 text-[10px] font-sans text-stone/60">
          <span>
            {uploadInfo.width}×{uploadInfo.height}px
          </span>
          <span>•</span>
          <span>{formatBytes(uploadInfo.size || 0)}</span>
          {uploadInfo.originalSize && uploadInfo.size && uploadInfo.originalSize > uploadInfo.size && (
            <>
              <span>•</span>
              <span className="text-emerald-600">
                -{Math.round((1 - uploadInfo.size / uploadInfo.originalSize) * 100)}% otimizado
              </span>
            </>
          )}
        </div>
      )}

      {/* URL manual fallback */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou cole uma URL: /uploads/imagem.webp"
          className="flex-1 px-3 py-2 text-xs font-sans rounded-lg border border-dust
                     bg-pearl text-charcoal placeholder:text-stone/40
                     focus:ring-2 focus:ring-cornflower/30 focus:border-cornflower/50 outline-none
                     transition-all"
        />
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setUploadInfo(null);
            }}
            className="px-2 py-2 text-xs text-stone/60 hover:text-red-500 transition-colors cursor-pointer"
            title="Limpar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Hint */}
      {hint && (
        <p className="text-[10px] text-stone/50 font-sans">{hint}</p>
      )}
    </div>
  );
}
