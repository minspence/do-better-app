"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  CATEGORIES,
  OBSTACLE_OPTIONS,
  SUPPORT_OPTIONS,
} from "@/types/app.types";
import type { HabitCategory } from "@/types/database.types";

type Step = 1 | 2 | 3 | 4;

const TOTAL_STEPS = 4;

export default function OnboardingClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const supabase = createClient();

  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [goalCategories, setGoalCategories] = useState<HabitCategory[]>([]);
  const [obstacles, setObstacles] = useState<string[]>([]);
  const [supportPrefs, setSupportPrefs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user already completed onboarding, skip to dashboard
  useEffect(() => {
    if (!profileLoading && profile?.onboarding_completed) {
      router.replace("/dashboard");
    }
  }, [profile, profileLoading, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const toggleCategory = (cat: HabitCategory) => {
    setGoalCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleObstacle = (opt: string) => {
    setObstacles((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const toggleSupport = (opt: string) => {
    setSupportPrefs((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const handleComplete = async (skip: boolean) => {
    setSaving(true);
    setError(null);

    let avatarUrl: string | undefined;

    if (!skip && avatarFile && user) {
      const ext = avatarFile.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (uploadError) {
        // Non-fatal: proceed without avatar
        console.warn("Avatar upload failed:", uploadError.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = publicUrl;
      }
    }

    const { error: saveError } = await updateProfile({
      onboarding_completed: true,
      ...(skip
        ? {}
        : {
            phone: phone.trim() || null,
            goal_categories: goalCategories,
            habit_obstacles: obstacles,
            support_preferences: supportPrefs,
            ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
          }),
    });

    if (saveError) {
      setError(
        typeof saveError === "string" ? saveError : saveError.message,
      );
      setSaving(false);
      return;
    }

    router.replace("/dashboard");
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pt-safe pb-8">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-12 pb-8">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i + 1 === step
                ? "w-6 bg-indigo-500"
                : i + 1 < step
                  ? "w-2 bg-indigo-500/50"
                  : "w-2 bg-zinc-700",
            )}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1">
        {step === 1 && (
          <Step1
            phone={phone}
            onPhoneChange={setPhone}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
            displayName={profile?.display_name ?? ""}
          />
        )}
        {step === 2 && (
          <Step2
            selected={goalCategories}
            onToggle={toggleCategory}
          />
        )}
        {step === 3 && (
          <Step3
            selected={obstacles}
            onToggle={toggleObstacle}
          />
        )}
        {step === 4 && (
          <Step4
            selected={supportPrefs}
            onToggle={toggleSupport}
          />
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="space-y-3">
        {step < TOTAL_STEPS ? (
          <Button fullWidth size="lg" onClick={() => setStep((s) => (s + 1) as Step)}>
            Continue
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            loading={saving}
            onClick={() => handleComplete(false)}
          >
            Get Started
          </Button>
        )}

        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => handleComplete(true)}
            disabled={saving}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({
  phone,
  onPhoneChange,
  avatarPreview,
  onAvatarChange,
  displayName,
}: {
  phone: string;
  onPhoneChange: (v: string) => void;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayName: string;
}) {
  const initials = displayName
    ? displayName.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Let's personalize your experience
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          A few quick details to make the app feel like yours.
        </p>
      </div>

      {/* Avatar picker */}
      <div className="flex flex-col items-center gap-3">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <div className="relative h-20 w-20">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-20 w-20 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 text-2xl font-bold text-zinc-400">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
              +
            </div>
          </div>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onAvatarChange}
        />
        <p className="text-xs text-zinc-600">Tap to add a photo</p>
      </div>

      {/* Phone */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Phone number
          <span className="ml-2 text-xs text-zinc-600">optional</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}

function Step2({
  selected,
  onToggle,
}: {
  selected: HabitCategory[];
  onToggle: (cat: HabitCategory) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">What are you working on?</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Select all that apply — we'll tailor your experience.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggle(cat.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500",
              )}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium leading-tight">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">What gets in your way?</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Be honest — we've got you. Select all that apply.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {OBSTACLE_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">What helps you succeed?</h1>
        <p className="mt-2 text-sm text-zinc-400">
          We'll tailor the experience around what works for you.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {SUPPORT_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
