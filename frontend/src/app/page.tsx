"use client";
import Dropzone from "../components/Dropzone";
import PreviewStep from "../components/PreviewStep";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <main className="w-full max-w-md mx-auto flex flex-col gap-8 items-center">
        <h1 className="text-2xl font-bold text-center mb-2">Magic-Window Ad Builder</h1>
        <p className="text-center text-gray-600 mb-4">ADA-safe Poster in 3 Clicks</p>
        <div className="w-full">
          {!file ? (
            <Dropzone onFileAccepted={setFile} />
          ) : (
            <PreviewStep file={file} />
          )}
        </div>
      </main>
    </div>
  );
}
