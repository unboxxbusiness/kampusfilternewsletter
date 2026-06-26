import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "About",
  description: "Kampus Filter is a student intelligence platform that helps students discover opportunities, understand career trends, and make better education decisions.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-[#14213d]/90 dark:text-[#e5e5e5]/90 transition-colors">
      <BreadcrumbSchema items={breadcrumbs} />
      <h1 className="text-4xl font-sans font-extrabold tracking-tight text-[#14213d] dark:text-[#ffffff]">
        About Kampus Filter
      </h1>
      
      <p className="text-lg leading-relaxed">
        Kampus Filter is a student intelligence platform that helps students discover opportunities, understand career trends, and make better education decisions.
      </p>
      
      <p className="text-lg leading-relaxed">
        Instead of overwhelming students with endless news, notifications, and announcements, Kampus Filter filters what matters most—from scholarships and internships to admissions, careers, and future opportunities.
      </p>

      <div className="space-y-4 pt-4 border-t border-[#e5e5e5] dark:border-[#14213d]">
        <h2 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff]">
          Every article is designed to answer three simple questions:
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>What happened?</li>
          <li>Why does it matter?</li>
          <li>What should you do next?</li>
        </ul>
      </div>

      <p className="text-lg leading-relaxed pt-4">
        Our goal is simple: help students stay ahead and make smarter decisions about their future.
      </p>
    </main>
  );
}
