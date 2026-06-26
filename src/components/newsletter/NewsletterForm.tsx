"use client";

import React, { useState } from "react";

const INTEREST_OPTIONS = [
  "Scholarships", "Careers", "Coding", "Internships", "Government Jobs", "Study Abroad", "MBA", "Placements"
];

interface NewsletterFormProps {
  onSubscribeSuccess: (email: string, enableNotifications: boolean) => void;
}

export default function NewsletterForm({ onSubscribeSuccess }: NewsletterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, courseInterests: selectedInterests }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      onSubscribeSuccess(email, enableNotifications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#ffffff] dark:bg-[#14213d] border border-[#e5e5e5] dark:border-[#14213d] text-[#000000] dark:text-[#ffffff] rounded-lg px-4 py-3 placeholder-[#14213d]/40 dark:placeholder-[#e5e5e5]/40 focus:border-[#fca311] focus:ring-1 focus:ring-[#fca311] outline-none transition duration-150"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#ffffff] dark:bg-[#14213d] border border-[#e5e5e5] dark:border-[#14213d] text-[#000000] dark:text-[#ffffff] rounded-lg px-4 py-3 placeholder-[#14213d]/40 dark:placeholder-[#e5e5e5]/40 focus:border-[#fca311] focus:ring-1 focus:ring-[#fca311] outline-none transition duration-150"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Mobile Number (Optional)"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="w-full bg-[#ffffff] dark:bg-[#14213d] border border-[#e5e5e5] dark:border-[#14213d] text-[#000000] dark:text-[#ffffff] rounded-lg px-4 py-3 placeholder-[#14213d]/40 dark:placeholder-[#e5e5e5]/40 focus:border-[#fca311] focus:ring-1 focus:ring-[#fca311] outline-none transition duration-150"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#14213d]/60 dark:text-[#e5e5e5]/60">Course Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(interest => {
            const active = selectedInterests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 text-xs border rounded-full transition duration-150 font-medium ${
                  active 
                    ? "bg-[#fca311] text-[#000000] border-[#fca311] shadow-sm" 
                    : "border-[#e5e5e5] dark:border-[#14213d] text-[#14213d] dark:text-[#e5e5e5] hover:border-[#fca311] hover:text-[#fca311] bg-[#ffffff] dark:bg-[#14213d]/30"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="notif-check"
          checked={enableNotifications}
          onChange={e => setEnableNotifications(e.target.checked)}
          className="h-4 w-4 rounded border-[#e5e5e5] dark:border-[#14213d] bg-[#ffffff] dark:bg-[#14213d] text-[#fca311] focus:ring-[#fca311] cursor-pointer accent-[#fca311]"
        />
        <label htmlFor="notif-check" className="text-xs text-[#14213d]/70 dark:text-[#e5e5e5]/70 cursor-pointer select-none leading-normal">
          Enable browser notifications to receive future opportunities instantly.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#fca311] text-[#000000] py-3.5 rounded-lg hover:bg-[#e6930f] active:scale-[0.98] transition-all duration-200 font-bold tracking-wide text-sm flex items-center justify-center gap-2 shadow-md shadow-[#fca311]/20"
      >
        {loading ? (
          <span>Joining...</span>
        ) : (
          <>
            <span>Join Free</span>
            <span>&rarr;</span>
          </>
        )}
      </button>
    </form>
  );
}
