"use client";

import { useState } from "react";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { RatingDistributionChart } from "@/features/dashboard/components/rating-distribution-chart";
import { RatingTrendChart } from "@/features/dashboard/components/rating-trend-chart";
import { ReviewDetailPanel } from "@/features/dashboard/components/review-detail-panel";
import { ReviewsPanel } from "@/features/dashboard/components/reviews-panel";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { mockReviews } from "@/features/dashboard/data/mock-reviews";
import type { Review, ResponseTone } from "@/features/dashboard/types";

type DashboardProps = {
  organizationName: string;
  userFullName: string;
  userFirstName: string;
  role: "owner" | "admin" | "member";
};

export function Dashboard({ organizationName, userFullName, userFirstName, role }: DashboardProps) {
  const [selected, setSelected] = useState<Review>(mockReviews[1]);
  const [tone, setTone] = useState<ResponseTone>("Chaleureux");
  const [published, setPublished] = useState(false);

  function selectReview(review: Review) {
    setSelected(review);
    setPublished(false);
  }

  return (
    <main className="min-h-screen bg-background lg:flex">
      <DashboardSidebar organizationName={organizationName} userFullName={userFullName} role={role} />

      <section className="min-w-0 flex-1 p-4 pt-20 lg:p-8">
        <DashboardHeader userFirstName={userFirstName} />
        <StatsGrid />

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.8fr_1fr]">
          <RatingTrendChart />
          <RatingDistributionChart />
        </div>

        <div className="mt-5">
          <ReviewsPanel reviews={mockReviews} selectedId={selected.id} onSelect={selectReview} />
        </div>
      </section>

      <ReviewDetailPanel
        review={selected}
        tone={tone}
        onToneChange={setTone}
        published={published}
        onRegenerate={() => setPublished(false)}
        onPublish={() => setPublished(true)}
      />
    </main>
  );
}
