"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  defaultTrek?: string;
  trekName?: string;
};

export default function MessageForm({ defaultTrek, trekName }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (defaultTrek) formData.set("trek", defaultTrek);
    if (trekName) formData.set("trekName", trekName);

    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    try {
      setStatus("loading");
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setStatus("success");
      setMessage("Message sent! The agency will respond soon.");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Failed to send message");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="trek" defaultValue={defaultTrek ?? ""} />
      <input type="hidden" name="trekName" defaultValue={trekName ?? ""} />

      <div>
        <label htmlFor="msg-name" className="block text-sm font-medium">
          Your Name <span className="text-red-500" aria-label="required">*</span>
        </label>
        <Input
          id="msg-name"
          name="name"
          required
          aria-required="true"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="msg-email" className="block text-sm font-medium">
          Email <span className="text-red-500" aria-label="required">*</span>
        </label>
        <Input
          id="msg-email"
          name="email"
          type="email"
          required
          aria-required="true"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="msg-message" className="block text-sm font-medium">
          Message <span className="text-red-500" aria-label="required">*</span>
        </label>
        <Textarea
          id="msg-message"
          name="message"
          required
          aria-required="true"
          placeholder="Your message..."
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          className="inline-flex items-center rounded bg-primary px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={status === "loading"}
          aria-label={status === "loading" ? "Sending..." : "Send message"}
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
        {(status === "success" || status === "error") && (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "text-sm p-3 rounded-md",
              status === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
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
