import React from "react";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      {/* Feed Preview Section */}
      <section className="py-20 text-center bg-white">
        <div className="container px-4">
          <h3 className="text-2xl font-bold mb-4">
            다른 사람들은 어떤 꿈을 꾸었을까요?
          </h3>
          <p className="text-gray-600 mb-8">
            익명으로 공유된 다양한 꿈 이야기를 확인해보세요.
          </p>
          <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50">
            <span className="text-slate-400">
              Feed Preview Area (Coming Soon)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
