"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <main className="min-h-screen bg-cream-50/30 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-outfit font-bold text-brand-900 mb-6">
            Get in Touch with Us
          </h1>
          <p className="text-lg text-sage-600 font-light leading-relaxed">
            Welcome to Sadhana Yogshala. We are dedicated to providing a premium environment for holistic wellness, expert-led training, and personal growth.
          </p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: About & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-600 mb-4">Our Mission</h2>
              <p className="text-sage-600 font-light leading-relaxed mb-6">
                Our mission is to make authentic, professional yoga instruction accessible to everyone, everywhere. Through our custom-crafted online curriculum, direct live sessions, and dynamic guidance systems, we empower students to discover their natural state of inner-balance and health.
              </p>
              
              {/* Values List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">Expert, Certified Yogacharyas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">Tailored Asana & Pranayama Modules</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">Global Student Support & Community</span>
                </div>
              </div>
            </div>

            {/* Contact Coordinates */}
            <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-brand-900 mb-4">Contact Details</h3>
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-sage-500 font-bold mb-1">Email Us</h4>
                  <p className="text-sm text-gray-800 font-medium">support@sadhanayogshala.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-sage-500 font-bold mb-1">Call Us</h4>
                  <p className="text-sm text-gray-800 font-medium">+1 (415) 555-0199</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-sage-500 font-bold mb-1">Our Studio</h4>
                  <p className="text-sm text-gray-800 font-medium">742 Evergreen Terrace, Suite 100, Wellness Valley, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 border border-cream-200 shadow-sm">
            <h2 className="text-3xl font-outfit font-bold text-brand-900 mb-2">Send us a Message</h2>
            <p className="text-sage-500 text-sm font-light mb-8">Have questions? We typically reply to all messages within 24 hours.</p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900">Message Received!</h3>
                <p className="text-sage-600 font-light max-w-md mx-auto">
                  Thank you for reaching out. A yogic wellness advisor will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-brand-100 text-brand-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-200 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="input-label">Your Name</label>
                    <Input
                      id="contact-name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="input-label">Email Address</label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="input-label">Subject</label>
                  <Input
                    id="contact-subject"
                    placeholder="Enrollment Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="input-label">Your Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help you on your yoga journey..."
                    className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-sage-300 text-gray-900"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 text-white font-semibold py-4 rounded-xl text-sm uppercase tracking-wider hover:bg-brand-700 hover:shadow transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
