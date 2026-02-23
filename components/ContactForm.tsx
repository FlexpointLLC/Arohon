'use client';

import { useState, FormEvent } from 'react';

const SUPPORT_EMAIL = 'support@arohon.co';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent('Contact from Arohon Website');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-lg font-semibold text-gray-900">Thank you for reaching out!</p>
        <p className="mt-2 text-gray-600">
          We appreciate you contacting us. We will get back to you shortly. Have a great day!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-900">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-[#016b42] focus:outline-none focus:ring-2 focus:ring-[#016b42]/20"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-900">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-[#016b42] focus:outline-none focus:ring-2 focus:ring-[#016b42]/20"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-gray-900">
          Mobile Number
        </label>
        <input
          id="mobile"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-[#016b42] focus:outline-none focus:ring-2 focus:ring-[#016b42]/20"
          placeholder="01XXXXXXXXX"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-900">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-[#016b42] focus:outline-none focus:ring-2 focus:ring-[#016b42]/20"
          placeholder="We want your input: questions, bug reports, complaints, praise, feature requests — every little bit helps. Let us know what we can do to improve Arohon."
        />
      </div>
      <button
        type="submit"
          className="w-full rounded-xl px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-95 sm:w-auto sm:min-w-[160px]"
        style={{ backgroundColor: '#016b42' }}
      >
        Send message
      </button>
    </form>
  );
}
