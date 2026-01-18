"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  defaultTrek?: string;
  trekName?: string;
  agentOfferId?: string;
  agentId?: string;
  agentName?: string;
  onSuccess?: () => void;
};

export default function BookingForm({ defaultTrek, trekName, agentOfferId, agentId, agentName, onSuccess }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (defaultTrek) formData.set("trek", defaultTrek);
    if (trekName) formData.set("trekName", trekName);
    if (agentOfferId) formData.set("agentOfferId", agentOfferId);
    if (agentId) formData.set("agentId", agentId);
    if (agentName) formData.set("agentName", agentName);

    const payload: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "groupSize") {
        payload[key] = parseInt(String(value), 10);
      } else if (key === "startDate" || key === "endDate") {
        // Handle dates separately
        if (!payload.dates) payload.dates = { start: "", end: "" };
        if (key === "startDate") payload.dates.start = String(value);
        if (key === "endDate") payload.dates.end = String(value);
      } else {
        payload[key] = String(value);
      }
    });

    // Rename fields to match API expectations
    payload.customerName = payload.name;
    payload.customerEmail = payload.email;
    payload.customerPhone = payload.phone;
    payload.specialRequests = payload.message;
    delete payload.name;
    delete payload.email;
    delete payload.phone;
    delete payload.message;

    try {
      setStatus("loading");
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
      setMessage("Booking request submitted! The agency will contact you soon.");
      form.reset();
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Submission failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="trek" defaultValue={defaultTrek ?? ""} />
      <input type="hidden" name="trekName" defaultValue={trekName ?? ""} />

      <div>
        <label htmlFor="booking-name" className="block text-sm font-medium">
          Full name <span className="text-red-500" aria-label="required">*</span>
        </label>
        <Input
          id="booking-name"
          name="name"
          required
          aria-required="true"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="booking-email" className="block text-sm font-medium">
          Email <span className="text-red-500" aria-label="required">*</span>
        </label>
        <Input
          id="booking-email"
          name="email"
          type="email"
          required
          aria-required="true"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="booking-phone" className="block text-sm font-medium">
          Phone <span className="text-red-500" aria-label="required">*</span>
        </label>
        <Input
          id="booking-phone"
          name="phone"
          type="tel"
          required
          aria-required="true"
          placeholder="Your phone number"
        />
      </div>

      <div>
        <label htmlFor="booking-group-size" className="block text-sm font-medium">
          Group Size <span className="text-red-500" aria-label="required">*</span>
        </label>
        <select
          id="booking-group-size"
          name="groupSize"
          required
          aria-required="true"
          className="mt-1 block w-full rounded-md border border-input bg-input px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        >
          <option value="">Select group size</option>
          <option value="1">1 person</option>
          <option value="2">2 people</option>
          <option value="3">3 people</option>
          <option value="4">4 people</option>
          <option value="5">5 people</option>
          <option value="6">6+ people</option>
        </select>
      </div>

      <div>
        <label htmlFor="booking-start-date" className="block text-sm font-medium">
          Start Date <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          id="booking-start-date"
          name="startDate"
          type="date"
          required
          aria-required="true"
          className="mt-1 block w-full rounded-md border border-input bg-input px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </div>

      <div>
        <label htmlFor="booking-end-date" className="block text-sm font-medium">
          End Date <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          id="booking-end-date"
          name="endDate"
          type="date"
          required
          aria-required="true"
          className="mt-1 block w-full rounded-md border border-input bg-input px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </div>

      <div>
        <label htmlFor="booking-message" className="block text-sm font-medium">
          Special Requests <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <Textarea
          id="booking-message"
          name="message"
          placeholder="Any special requests or dietary requirements..."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          className="inline-flex items-center rounded bg-primary px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={status === "loading"}
          aria-label={status === "loading" ? "Submitting booking..." : "Request booking"}
        >
          {status === "loading" ? "Submitting..." : "Request Booking"}
        </button>
        {(status === "success" || status === "error") && (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "text-sm p-3 rounded-md",
              status === "success"
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-red-50 text-red-800 border border-red-200"
            )}
          >
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
