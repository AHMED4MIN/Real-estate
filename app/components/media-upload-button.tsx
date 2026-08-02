"use client";

import { useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type MediaKind = "image" | "video";

export function MediaUploadButton({ kind, onUploaded }: { kind: MediaKind; onUploaded: (url: string) => void }) {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const accept = kind === "image" ? "image/avif,image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime,video/webm";
  const limit = kind === "image" ? 20 * 1024 * 1024 : 4 * 1024 * 1024 * 1024;

  async function upload(file: File) {
    if (!supabase) return;
    if (file.size > limit) { setMessage(`${kind === "image" ? "Images" : "Videos"} must be smaller than ${kind === "image" ? "20 MB" : "4 GB"}.`); return; }
    setUploading(true); setMessage("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sign in as an administrator first.");
      const signed = await fetch("/api/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ name: file.name, contentType: file.type, kind }),
      });
      const result = await signed.json() as { uploadUrl?: string; publicUrl?: string; error?: string };
      if (!signed.ok || !result.uploadUrl || !result.publicUrl) throw new Error(result.error || "Could not prepare the upload.");
      const uploaded = await fetch(result.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!uploaded.ok) throw new Error("Upload to R2 failed. Check the R2 CORS settings and try again.");
      onUploaded(result.publicUrl); setMessage("Uploaded to R2.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  }

  return <div className="mt-2"><input ref={input} type="file" accept={accept} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }}/><button type="button" disabled={uploading} onClick={() => input.current?.click()} className="rounded-lg border border-primary px-3 py-2 text-sm font-bold text-primary disabled:opacity-50">{uploading ? "Uploading…" : `Upload ${kind} to R2`}</button>{message && <p className="mt-1 text-xs text-on-surface-variant">{message}</p>}</div>;
}
