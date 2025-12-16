import React from "react";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import FeedPreviewSection from "@/components/home/feed-preview-section";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeedPreviewSection />
    </div>
  );
};

export default HomePage;
