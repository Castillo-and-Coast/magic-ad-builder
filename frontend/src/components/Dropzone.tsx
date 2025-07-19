import React, { useRef, useState } from "react";

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function Dropzone({ onFileAccepted }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WEBP, or GIF images are allowed.");
      setPreview(null);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("File size must be under 10MB.");
      setPreview(null);
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
    onFileAccepted(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer min-h-[180px] bg-white/80 hover:border-blue-500 focus:border-blue-500 outline-none ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleChange}
        />
        <span className="text-gray-500 text-sm mb-2">Drag & drop an image here</span>
        <span className="text-gray-400 text-xs mb-2">or click to select (max 10MB)</span>
        <span className="text-gray-400 text-xs">JPG, PNG, WEBP, GIF</span>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 rounded shadow max-h-32 object-contain"
          />
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-2 text-center">{error}</div>}
    </div>
  );
} 