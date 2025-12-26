"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type AvatarUploadProps = {
  currentAvatarUrl?: string | null;
  userId: string;
};

export function AvatarUpload({ currentAvatarUrl, userId }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadMessage({
        type: "error",
        text: "Please select a JPEG, PNG, or WebP image.",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage({
        type: "error",
        text: "Image must be smaller than 5MB.",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.ok) {
        setUploadMessage({
          type: "success",
          text: "Avatar uploaded successfully!",
        });
      } else {
        setUploadMessage({
          type: "error",
          text: result.error || "Failed to upload avatar.",
        });
        setPreviewUrl(currentAvatarUrl || null);
      }
    } catch {
      setUploadMessage({
        type: "error",
        text: "An error occurred while uploading.",
      });
      setPreviewUrl(currentAvatarUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    setUploadMessage(null);

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result.ok) {
        setPreviewUrl(null);
        setUploadMessage({
          type: "success",
          text: "Avatar removed successfully!",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadMessage({
          type: "error",
          text: result.error || "Failed to remove avatar.",
        });
      }
    } catch {
      setUploadMessage({
        type: "error",
        text: "An error occurred while removing avatar.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
        Profile Photo
      </label>

      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-black/[.08] bg-zinc-100 dark:border-white/[.12] dark:bg-zinc-900">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-zinc-400">
              ?
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="avatar-upload"
          />

          <div className="flex flex-wrap gap-2">
            <label
              htmlFor="avatar-upload"
              className={[
                "inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]",
                isUploading && "pointer-events-none opacity-60",
              ].join(" ")}
            >
              {isUploading ? "Uploading..." : "Choose Image"}
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-900 shadow-sm hover:bg-red-100 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100 dark:hover:bg-red-950/60"
              >
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            JPEG, PNG, or WebP. Max 5MB.
          </p>

          {uploadMessage && (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-xs",
                uploadMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {uploadMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
