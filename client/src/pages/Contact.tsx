import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Instagram,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [serviceRequired, setServiceRequired] = useState(preselectedService || 'Website Development');
  const [projectBudget, setProjectBudget] = useState('₹25,000 - ₹50,000 ($300 - $600)');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Math Challenge
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNum1(a);
    setNum2(b);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
    if (preselectedService) {
      setServiceRequired(preselectedService);
    }
  }, [preselectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (Number(captchaAnswer) !== num1 + num2) {
      setErrorMessage(`Security challenge calculation incorrect. Please solve: ${num1} + ${num2}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitEnquiry({
        full_name: fullName,
        email,
        phone,
        business_name: businessName,
        city,
        country,
        preferred_contact: preferredContact,
        service_required: serviceRequired,
        project_budget: projectBudget,
        message,
        honeypot,
        captcha_answer: Number(captchaAnswer),
        captcha_expected: num1 + num2
      });

      setSuccessMessage(
        res.lead_id
          ? `${res.message} Your official Lead Reference ID is ${res.lead_id}. Founder Harish K will review your submission shortly.`
          : res.message
      );
      setFullName('');
      setEmail('');
      setPhone('');
      setBusinessName('');
      setCity('');
      setMessage('');
      generateCaptcha();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-[#101B33] text-white py-20 border-b border-[#1A2846]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
              Direct Engagement
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 text-white">
              Connect with PIVO TECH
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
              Have an upcoming project, website rebuild, or automation requirement? Speak directly with Founder Harish K for transparent scoping and rapid execution.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info, Channels & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-premium space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Official Contact Directory
              </span>
              <h2 className="text-2xl font-extrabold text-[#101B33]">
                PIVO TECH
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are headquartered in Theni, Tamil Nadu, collaborating with founders, business owners, and engineering leaders worldwide.
              </p>

              <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#101B33] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400">Location</span>
                    <span className="font-semibold text-slate-800">Theni, Tamil Nadu, India.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#101B33] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400">Business Email</span>
                    <a
                      href="mailto:harishkumaravel2007@gmail.com"
                      className="font-semibold text-slate-800 hover:text-[#C6A15B] transition-colors break-all"
                    >
                      harishkumaravel2007@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#101B33] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400">Phone &amp; WhatsApp</span>
                    <a
                      href="tel:+919944245043"
                      className="font-semibold text-slate-800 hover:text-[#C6A15B] transition-colors"
                    >
                      +91 99442 45043
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href="https://wa.me/919944245043?text=Hi%20Harish%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20PIVO%20TECH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start WhatsApp Consultation</span>
                </a>

                <a
                  href="mailto:harishkumaravel2007@gmail.com"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#C6A15B]" />
                  <span>Send Direct Email</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Follow Our Work</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/harish-k-303480301/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-700 hover:text-[#C6A15B] transition-colors font-medium"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://www.instagram.com/_pivo.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-700 hover:text-[#C6A15B] transition-colors font-medium"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps for Theni, Tamil Nadu */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-premium p-4">
              <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C6A15B]" />
                  <span>Theni, Tamil Nadu, India</span>
                </span>
                <span className="text-slate-400 font-normal">Headquarters</span>
              </div>
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title="PIVO TECH Theni Location Map"
                  src="https://maps.google.com/maps?q=Theni,%20Tamil%20Nadu,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-premium">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Project Scoping Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B33] mt-1 mb-2">
                Send Us a Project Enquiry
              </h2>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                Provide preliminary details regarding your objectives. All enquiries are recorded securely in our database and personally reviewed by Founder Harish K.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm leading-relaxed flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Submission Confirmed</h4>
                    <p className="mt-0.5">{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm leading-relaxed flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Submission Error</h4>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Anti-bot honeypot */}
                <input
                  type="text"
                  name="user_confirm_token"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>

                  {/* Business Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Business / Brand Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Zenith Tech"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai, Mumbai, Dubai"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India, USA, UAE"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Contact Channel
                    </label>
                    <select
                      value={preferredContact}
                      onChange={(e) => setPreferredContact(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    >
                      <option value="whatsapp">WhatsApp Message</option>
                      <option value="phone">Direct Phone Call</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Service Required */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Service Required *
                    </label>
                    <select
                      value={serviceRequired}
                      onChange={(e) => setServiceRequired(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="AI Agent Development">AI Agent Development</option>
                      <option value="Business Automation">Business Automation</option>
                      <option value="General Technology Consultation">General Technology Consultation</option>
                    </select>
                  </div>

                  {/* Project Budget */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Target Project Budget (Optional)
                    </label>
                    <select
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                    >
                      <option value="Under ₹25,000 / $300">Under ₹25,000 ($300)</option>
                      <option value="₹25,000 - ₹50,000 ($300 - $600)">₹25,000 - ₹50,000 ($300 - $600)</option>
                      <option value="₹50,000 - ₹1,00,000 ($600 - $1,200)">₹50,000 - ₹1,00,000 ($600 - $1,200)</option>
                      <option value="₹1,00,000+ ($1,200+)">₹1,00,000+ ($1,200+)</option>
                      <option value="Custom / Enterprise Scoping">Custom / Enterprise Scoping</option>
                    </select>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Project Scope &amp; Objective *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your requirements, current challenges, and desired delivery timeframe..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>

                {/* Anti-spam math challenge */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Security Verification: What is {num1} + {num2}? *
                  </label>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full sm:w-48 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] disabled:opacity-60 transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C6A15B]" />
                  <span>{submitting ? 'Recording Enquiry...' : 'Submit Project Enquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
