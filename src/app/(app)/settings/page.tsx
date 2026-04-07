"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setUsername(profile.username ?? "");
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    let avatarUrl: string | undefined;

    if (avatarFile && user) {
      const ext = avatarFile.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (uploadError) {
        setError("Avatar upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = publicUrl;
    }

    const { error: saveError } = await updateProfile({
      display_name: displayName.trim(),
      username: username.trim() || null,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    setSaving(false);

    if (saveError) {
      setError(typeof saveError === "string" ? saveError : saveError.message);
    } else {
      setAvatarFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const currentAvatar = avatarPreview ?? profile?.avatar_url ?? null;
  const initials = (profile?.display_name?.[0] ?? "?").toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Header title="Settings" className="px-0" />

      <form onSubmit={handleSave} className="space-y-5 mt-2">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-indigo-600">
              {currentAvatar ? (
                <Image
                  src={currentAvatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized={avatarPreview !== null}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white">Change</span>
              </div>
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-zinc-600">Tap to change photo</p>
        </div>

        {/* Display name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            maxLength={50}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Username */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Username
            <span className="ml-2 text-xs text-zinc-500">optional — used for social features</span>
          </label>
          <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <span className="text-zinc-600 mr-1">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              placeholder="username"
              maxLength={30}
              className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-600">Letters, numbers, and underscores only.</p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Settings saved.
          </p>
        )}

        <Button type="submit" fullWidth size="lg" loading={saving}>
          Save Changes
        </Button>
      </form>

      {/* App info */}
      <Card className="mt-8 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
          About
        </h2>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">App Version</span>
          <span className="text-zinc-400">0.1.0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Data</span>
          <span className="text-zinc-400">Synced to Supabase</span>
        </div>
      </Card>
    </div>
  );
}
