"use client";

import { Crown, Check, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useProfile } from "@/lib/hooks/useProfile";

// This page handles the premium upgrade flow.
// Wire up the CTA buttons to Stripe Checkout when monetization is built (Phase 4).
export default function PremiumPage() {
  const { profile } = useProfile();

  const trialActive = !!profile?.trial_started_at && !profile?.is_premium;

  return (
    <div className="px-4">
      <Header title="Go Premium" subtitle="Unlock your full potential" />

      {/* Hero */}
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
          <Crown className="h-8 w-8 text-yellow-400" />
        </div>
        {trialActive && (
          <span className="rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-400">
            ✓ Your 14-day free trial is active
          </span>
        )}
      </div>

      {/* Feature list */}
      <Card className="mb-6">
        <p className="mb-4 text-sm font-semibold text-zinc-300">
          Everything in Premium:
        </p>
        <div className="space-y-3">
          {PREMIUM_FEATURES.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <p className="text-sm text-zinc-300">{feature}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Pricing */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card className="text-center py-5 border border-zinc-700">
          <p className="text-xs text-zinc-500 mb-1">Monthly</p>
          <p className="text-2xl font-bold text-white">$4.99</p>
          <p className="text-xs text-zinc-600 mt-1">per month</p>
          <Button variant="secondary" size="sm" className="mt-4 w-full">
            Choose
          </Button>
        </Card>
        <Card glow className="text-center py-5">
          <p className="text-xs text-indigo-400 mb-1 font-medium">Best value</p>
          <p className="text-2xl font-bold text-white">$39.99</p>
          <p className="text-xs text-zinc-500 mt-1">per year · save 33%</p>
          <Button size="sm" className="mt-4 w-full">
            <Zap className="h-3.5 w-3.5" />
            Choose
          </Button>
        </Card>
      </div>

      {!trialActive && (
        <Button variant="ghost" fullWidth size="sm" className="mb-2">
          Start 14-day free trial
        </Button>
      )}

      <p className="text-center text-xs text-zinc-600">
        Cancel anytime. No commitment.
      </p>
    </div>
  );
}

const PREMIUM_FEATURES = [
  "Curated workout plans for every fitness level",
  "Weekly meal plans and diet templates",
  "Advanced memorization decks and study guides",
  "Streak Freeze tokens to protect your progress",
  "Detailed analytics and progress charts",
  "Unlimited habit creation (free tier: 5 habits)",
  "Early access to new features",
];
