import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question, feedback, or want to share an opportunity? Contact the Kampus Filter team.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-[#14213d]/90 dark:text-[#e5e5e5]/90 transition-colors">
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-extrabold tracking-tight text-[#14213d] dark:text-[#ffffff]">
          Contact Us
        </h1>
      </div>

      <p className="text-lg leading-relaxed">
        Have a question, found an error, or want to share an opportunity that could benefit students? We'd love to hear from you.
      </p>

      <p className="text-lg leading-relaxed">
        At <strong>Kampus Filter</strong>, we're committed to delivering accurate, actionable, and trustworthy education and career intelligence. Your feedback helps us improve and keep our content relevant.
      </p>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">Get in Touch</h2>
        <p className="text-lg leading-relaxed">
          You can contact us for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Questions about our articles</li>
          <li>Reporting incorrect or outdated information</li>
          <li>Sharing scholarships, internships, or student opportunities</li>
          <li>Partnership and collaboration inquiries</li>
          <li>Feedback, suggestions, or feature requests</li>
          <li>General support</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:help@kampusfilter.com"
            className="text-[#fca311] hover:text-[#e6930f] hover:underline font-bold transition-colors"
          >
            help@kampusfilter.com
          </a>
        </p>
        <p className="text-lg leading-relaxed">
          We aim to respond to all genuine inquiries within <strong>1–3 business days</strong>.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">Before You Contact Us</h2>
        <p className="text-lg leading-relaxed italic">
          Please note:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>We do <strong>not</strong> process university admissions or scholarship applications.</li>
          <li>We cannot guarantee admission, scholarships, internships, or job placements.</li>
          <li>For official deadlines, eligibility, and application status, always refer to the official website of the respective university, organization, or government authority.</li>
        </ul>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">Our Mission</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter exists to help students cut through the noise and focus on what truly matters.
        </p>
        <div className="space-y-2 pt-2">
          <p className="font-semibold text-[#14213d] dark:text-[#ffffff]">
            Every article is designed to answer three simple questions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li><strong>What happened?</strong></li>
            <li><strong>Why does it matter?</strong></li>
            <li><strong>What should you do next?</strong></li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed pt-4">
          If you have valuable feedback or an opportunity that could help students make better decisions, we'd be happy to hear from you.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <p className="text-lg leading-relaxed italic text-[#14213d]/60 dark:text-[#e5e5e5]/60">
        Thank you for being part of the Kampus Filter community.
      </p>
    </main>
  );
}
