"use client";

import { useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type MediaKind = "image" | "video";

type UploadError = { error?: string };

async function readError(response: Response): Promise<UploadError> {
  try {
    return await response.json() as UploadError;
  } catch {
    return {};
  }
}

export function MediaUploadButton({ kind, multiple = false, target = "properties", onUploaded }: { kind: MediaKind; multiple?: boolean; target?: "properties" | "agents"; onUploaded: (urls: string[]) => void }) {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const accept = kind === "image" ? "image/avif,image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime,video/webm";
  const limit = kind === "image" ? 20 * 1024 * 1024 : 4 * 1024 * 1024 * 1024;

  async function upload(file: File): Promise<string> {
    if (!supabase) throw new Error("Supabase is not configured.");
    if (file.size > limit) throw new Error(`${file.name} is larger than the ${kind === "image" ? "20 MB" : "4 GB"} limit.`);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sign in as an administrator first.");
    const signed = await fetch("/api/media/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ name: file.name, contentType: file.type, kind, target }),
    });
    const result = await readError(signed) as UploadError & { uploadUrl?: string; publicUrl?: string };
    if (!signed.ok || !result.uploadUrl || !result.publicUrl) throw new Error(result.error || "Could not prepare the upload.");

    try {
      const uploaded = await fetch(result.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!uploaded.ok) throw new Error(`R2 returned ${uploaded.status}.`);
    } catch (error) {
      if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
        throw new Error("R2 blocked the browser upload. Add this website's exact origin to the bucket CORS policy and allow PUT with the Content-Type header.");
      }
      throw error;
    }
    return result.publicUrl;
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;
    setUploading(true);
    setMessage("");
    const uploadedUrls: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setMessage(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        uploadedUrls.push(await upload(file));
      }
      onUploaded(uploadedUrls);
      setMessage(`${uploadedUrls.length} ${kind}${uploadedUrls.length === 1 ? "" : "s"} uploaded to R2.`);
    } catch (error) {
      if (uploadedUrls.length > 0) onUploaded(uploadedUrls);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  const label = multiple ? `Upload ${kind}s to R2` : `Upload ${kind} to R2`;
  return <div className="mt-2"><input ref={input} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(event) => void uploadFiles(Array.from(event.target.files ?? []))}/><button type="button" disabled={uploading} onClick={() => input.current?.click()} className="rounded-lg border border-primary px-3 py-2 text-sm font-bold text-primary disabled:opacity-50">{uploading ? "Uploading…" : label}</button>{message && <p className="mt-1 text-xs text-on-surface-variant" role="status">{message}</p>}</div>;
}
