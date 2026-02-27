import React from "react";
import { DreamTellerForm } from "./dream-teller-form";

const DreamTellerPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            꿈 해몽 신청하기
          </h1>
          <p className="mt-4 text-slate-600">
            당신의 꿈을 분석할 전문가를 선택하고, 내용을 들려주세요.
          </p>
        </div>

        <DreamTellerForm />
      </div>
    </div>
  );
};

export default DreamTellerPage;
