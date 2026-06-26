import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/navigation/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of Kampus Filter. Learn how we handle your data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-8 text-[#14213d]/90 dark:text-[#e5e5e5]/90 transition-colors">
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="space-y-4">
        <h1 className="text-4xl font-sans font-extrabold tracking-tight text-[#14213d] dark:text-[#ffffff]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#14213d]/50 dark:text-[#e5e5e5]/50">
          <strong>Effective Date:</strong> June 25, 2026
        </p>
      </div>

      <p className="text-lg leading-relaxed">
        At <strong>Kampus Filter</strong>, your privacy matters. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data when you use our website and services.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#14213d] dark:text-[#ffffff]">Who We Are</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter is a student intelligence platform that helps students discover opportunities, understand career trends, and make informed education decisions.
        </p>
        <p className="text-lg leading-relaxed">
          Our mission is to filter the information that matters most—scholarships, internships, admissions, careers, and emerging opportunities—so students can focus on what truly impacts their future.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Information We Collect</h2>
        <p className="text-lg leading-relaxed">
          When you subscribe or interact with Kampus Filter, we may collect the following information:
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff]">Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Mobile Number (optional)</li>
            <li>Course or Career Interests</li>
          </ul>
          <p className="text-lg leading-relaxed pt-2">
            You provide this information voluntarily when joining Kampus Filter.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff]">Browser Notification Information</h3>
          <p className="text-lg leading-relaxed">
            If you choose to enable browser notifications, we store:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Browser notification token</li>
            <li>Notification preferences</li>
          </ul>
          <p className="text-lg leading-relaxed pt-2">
            This allows us to send updates when new articles or opportunities are published.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#14213d] dark:text-[#ffffff]">Automatically Collected Information</h3>
          <p className="text-lg leading-relaxed">
            We may automatically collect limited technical information such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Browser type</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Pages visited</li>
            <li>Referral source</li>
            <li>Date and time of your visit</li>
          </ul>
          <p className="text-lg leading-relaxed pt-2">
            This information helps us improve website performance and user experience.
          </p>
        </div>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">How We Use Your Information</h2>
        <p className="text-lg leading-relaxed">
          We use your information to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Deliver student opportunities and educational updates</li>
          <li>Send browser push notifications (only if you opt in)</li>
          <li>Improve our content and website experience</li>
          <li>Understand which topics interest our readers</li>
          <li>Respond to inquiries or feedback</li>
          <li>Maintain the security and reliability of our platform</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          We do <strong>not</strong> sell your personal information.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Browser Notifications</h2>
        <p className="text-lg leading-relaxed">
          If you enable browser notifications, Kampus Filter may send notifications about:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>New articles</li>
          <li>Scholarships</li>
          <li>Internships</li>
          <li>Career updates</li>
          <li>Education news</li>
          <li>Important student opportunities</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          You can disable notifications at any time through your browser settings.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Cookies</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter may use cookies and similar technologies to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Improve website functionality</li>
          <li>Remember user preferences</li>
          <li>Measure website traffic</li>
          <li>Analyze user engagement</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          Most browsers allow you to control or disable cookies through their settings.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Third-Party Services</h2>
        <p className="text-lg leading-relaxed">
          We use trusted third-party services to operate Kampus Filter, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Firebase (subscriber management and browser notifications)</li>
          <li>Sanity CMS (content management)</li>
          <li>Vercel (website hosting)</li>
          <li>Analytics tools (if enabled)</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          These providers process information only as necessary to provide their services.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Data Security</h2>
        <p className="text-lg leading-relaxed">
          We take reasonable technical and organizational measures to protect your information against unauthorized access, misuse, loss, or disclosure.
        </p>
        <p className="text-lg leading-relaxed">
          While we strive to safeguard your data, no internet-based service can guarantee absolute security.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Data Retention</h2>
        <p className="text-lg leading-relaxed">
          We retain your information only for as long as necessary to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Provide our services</li>
          <li>Send updates you have requested</li>
          <li>Meet legal obligations</li>
          <li>Improve our platform</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          You may request deletion of your information at any time.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Your Rights</h2>
        <p className="text-lg leading-relaxed">
          Depending on your location and applicable laws, you may have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent for notifications</li>
          <li>Object to certain uses of your information</li>
        </ul>
        <p className="text-lg leading-relaxed pt-2">
          To exercise these rights, please contact us using the information below.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Children's Privacy</h2>
        <p className="text-lg leading-relaxed">
          Kampus Filter is intended for students and general audiences. We do not knowingly collect personal information from children where prohibited by applicable law. If you believe a child has submitted personal information, please contact us so we can remove it.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">External Links</h2>
        <p className="text-lg leading-relaxed">
          Our articles may contain links to third-party websites, universities, scholarship portals, or government organizations.
        </p>
        <p className="text-lg leading-relaxed">
          We are not responsible for the privacy practices or content of those external websites.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Changes to This Privacy Policy</h2>
        <p className="text-lg leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or operational practices.
        </p>
        <p className="text-lg leading-relaxed">
          The updated version will always be published on this page with the revised effective date.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <section className="space-y-4">
        <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-[#ffffff]">Contact Us</h2>
        <p className="text-lg leading-relaxed">
          If you have any questions about this Privacy Policy or how your information is handled, please contact us through the contact page available on Kampus Filter.
        </p>
      </section>

      <hr className="border-[#e5e5e5] dark:border-[#14213d] my-8" />

      <p className="text-lg leading-relaxed italic text-[#14213d]/60 dark:text-[#e5e5e5]/60">
        Thank you for trusting Kampus Filter. We are committed to protecting your privacy while helping you discover the opportunities that shape your future.
      </p>
    </main>
  );
}
