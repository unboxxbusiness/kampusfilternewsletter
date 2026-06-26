import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service of Kampus Filter. Learn about your rights and responsibilities.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Terms of Service", item: "/terms" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-[#14213d]/90 dark:text-[#e5e5e5]/90 transition-colors">
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-extrabold tracking-tight text-[#14213d] dark:text-[#ffffff]">
          Terms of Use
        </h1>
        <p className="text-sm text-[#14213d]/50 dark:text-[#e5e5e5]/50">
          <strong>Effective Date:</strong> June 25, 2026
        </p>
      </div>

      <p className="text-lg leading-relaxed font-medium text-[#14213d] dark:text-[#e5e5e5]">
        Welcome to <strong>Kampus Filter</strong>. By accessing or using our website, you agree to these Terms of Use. Please read them carefully before using our services.
      </p>

      <p className="text-lg leading-relaxed">
        If you do not agree with these terms, please do not use Kampus Filter.
      </p>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">About Kampus Filter</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter is a student intelligence platform that helps students discover opportunities, understand career trends, and make informed education decisions.
        </p>
        <p className="text-lg leading-relaxed">
          Our content is designed to simplify complex education and career updates into practical, actionable insights.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">Acceptance of Terms</h2>
        <p className="text-lg leading-relaxed">
          By using Kampus Filter, you confirm that you have read, understood, and agree to these Terms of Use and our Privacy Policy.
        </p>
        <p className="text-lg leading-relaxed">
          These terms apply to all visitors, readers, and subscribers.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Educational Information Only</h2>
        <p className="text-lg leading-relaxed">
          All content published on Kampus Filter is provided for <strong>general informational and educational purposes only</strong>.
        </p>
        <p className="text-lg leading-relaxed">
          While we strive to ensure that information is accurate and up to date, we do not guarantee that every article, deadline, eligibility criterion, scholarship, admission process, or opportunity will remain current or apply to every individual.
        </p>
        <p className="text-lg leading-relaxed">
          Students should always verify important information through the official websites of universities, examination authorities, scholarship providers, employers, or government organizations before making decisions.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">No Professional Advice</h2>
        <p className="text-lg leading-relaxed">
          The information provided on Kampus Filter should not be considered:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Legal advice</li>
          <li>Financial advice</li>
          <li>Career counseling</li>
          <li>Academic counseling</li>
          <li>Immigration advice</li>
          <li>Professional consulting</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          Any decisions you make based on our content are your own responsibility.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">User Responsibilities</h2>
        <p className="text-lg leading-relaxed">
          When using Kampus Filter, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Provide accurate information when subscribing.</li>
          <li>Use the website lawfully.</li>
          <li>Respect the rights of other users.</li>
          <li>Not attempt to disrupt or damage the platform.</li>
          <li>Not misuse, copy, or exploit the website for unlawful purposes.</li>
        </ul>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Intellectual Property</h2>
        <p className="text-lg leading-relaxed">
          Unless otherwise stated, all original content on Kampus Filter—including articles, text, branding, logos, graphics, and design—is the property of Kampus Filter and is protected by applicable intellectual property laws.
        </p>
        <div className="space-y-2 pt-2">
          <p className="font-semibold text-[#14213d] dark:text-[#ffffff]">You may:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Read and share links to our articles.</li>
            <li>Quote short excerpts with proper attribution.</li>
          </ul>
        </div>
        <div className="space-y-2 pt-2">
          <p className="font-semibold text-[#14213d] dark:text-[#ffffff]">You may not:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Republish entire articles without permission.</li>
            <li>Copy content for commercial purposes.</li>
            <li>Remove copyright notices.</li>
            <li>Use our branding without authorization.</li>
          </ul>
        </div>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">External Links</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter may link to third-party websites, universities, scholarship portals, employers, or government resources.
        </p>
        <p className="text-lg leading-relaxed">
          These links are provided for convenience only.
        </p>
        <div className="pt-2">
          <p className="font-semibold text-[#14213d] dark:text-[#ffffff]">We are not responsible for:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Third-party content</li>
            <li>Website availability</li>
            <li>Privacy practices</li>
            <li>Services offered by external organizations</li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed pt-2">
          Your interactions with third-party websites are governed by their own policies.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Browser Notifications</h2>
        <p className="text-lg leading-relaxed">
          If you choose to enable browser notifications, you consent to receiving updates related to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Scholarships</li>
          <li>Internships</li>
          <li>Admissions</li>
          <li>Career opportunities</li>
          <li>Education news</li>
          <li>New articles</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          You can disable notifications at any time through your browser settings.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Subscriber Accounts</h2>
        <p className="text-lg leading-relaxed">
          When subscribing, you agree to provide accurate information.
        </p>
        <p className="text-lg leading-relaxed">
          You are responsible for keeping your information up to date.
        </p>
        <p className="text-lg leading-relaxed">
          We reserve the right to remove fraudulent, abusive, or duplicate subscriptions.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Availability of Services</h2>
        <p className="text-lg leading-relaxed">
          We aim to keep Kampus Filter available at all times.
        </p>
        <p className="text-lg leading-relaxed">
          However, we do not guarantee uninterrupted access.
        </p>
        <p className="text-lg leading-relaxed">
          The website may occasionally experience maintenance, updates, technical issues, or temporary downtime.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Disclaimer of Warranties</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis.
        </p>
        <div className="pt-2">
          <p className="font-semibold text-[#14213d] dark:text-[#ffffff]">We make no warranties regarding:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Accuracy of information</li>
            <li>Availability of services</li>
            <li>Completeness of content</li>
            <li>Fitness for a particular purpose</li>
            <li>Error-free operation</li>
          </ul>
        </div>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Limitation of Liability</h2>
        <p className="text-lg leading-relaxed">
          To the fullest extent permitted by applicable law, Kampus Filter shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Use of the website</li>
          <li>Reliance on published information</li>
          <li>Admission outcomes</li>
          <li>Scholarship decisions</li>
          <li>Career choices</li>
          <li>External websites or services</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          Users are responsible for independently verifying important information before making educational or career decisions.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Changes to the Platform</h2>
        <p className="text-lg leading-relaxed">
          We may update, modify, suspend, or discontinue features or content at any time without prior notice.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Changes to These Terms</h2>
        <p className="text-lg leading-relaxed">
          These Terms of Use may be updated periodically.
        </p>
        <p className="text-lg leading-relaxed">
          Any changes will be posted on this page with an updated effective date.
        </p>
        <p className="text-lg leading-relaxed">
          Continued use of Kampus Filter after changes become effective constitutes acceptance of the revised terms.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Governing Law</h2>
        <p className="text-lg leading-relaxed">
          These Terms of Use shall be governed by and interpreted in accordance with the laws applicable in the jurisdiction where Kampus Filter operates.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Contact</h2>
        <p className="text-lg leading-relaxed">
          If you have any questions regarding these Terms of Use, please contact us through the Contact page on Kampus Filter.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <p className="text-lg leading-relaxed italic text-[#14213d]/60 dark:text-[#e5e5e5]/60">
        Thank you for using Kampus Filter. Our mission is to help students discover meaningful opportunities, understand important education and career developments, and make informed decisions about their future.
      </p>
    </main>
  );
}
