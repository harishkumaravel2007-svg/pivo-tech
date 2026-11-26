import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe,
  Cpu,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Send,
  Eye,
  Maximize2,
  X,
  ChevronUp,
  ChevronDown,
  Layers,
  Clock,
  BarChart3,
  Check,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Service, ServiceImage } from '../types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Active section tracking for floating right-side navigation
  const [activeSection, setActiveSection] = useState<string>('website-development');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Selected thumbnail image index for each service (keyed by service slug)
  const [activeImageIndex, setActiveImageIndex] = useState<{ [slug: string]: number }>({
    'website-development': 0,
    'ai-agent-development': 0,
    'business-automation': 0,
    'digital-marketing': 0
  });

  // Fullscreen Lightbox Modal state
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    caption: string;
    serviceTitle: string;
  } | null>(null);

  // "View Details" Modal state
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);

  // "Get This Service" Modal Enquiry state
  const [enquiryModalService, setEnquiryModalService] = useState<Service | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    email: '',
    city: '',
    country: 'India',
    preferred_contact: 'whatsapp' as 'whatsapp' | 'phone' | 'email',
    service_required: '',
    project_budget: '₹50,000 – ₹1,00,000',
    message: ''
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(4);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccessMsg, setEnquirySuccessMsg] = useState<string | null>(null);
  const [enquiryErrorMsg, setEnquiryErrorMsg] = useState<string | null>(null);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setCaptchaNum1(a);
    setCaptchaNum2(b);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
    api.getServices()
      .then(res => {
        setServices(res.services);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Handle URL hash anchor scrolling (e.g. /services#ai-agent-development)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.hash, services]);

  // Scroll spy to highlight active section in floating navigation
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const serviceSlugs = [
        'website-development',
        'ai-agent-development',
        'business-automation',
        'digital-marketing'
      ];

      for (const slug of serviceSlugs) {
        const el = document.getElementById(slug);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240 && rect.bottom >= 180) {
            setActiveSection(slug);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEnquiryModal = (service: Service) => {
    setEnquiryModalService(service);
    setEnquiryForm({
      full_name: '',
      business_name: '',
      phone: '',
      email: '',
      city: '',
      country: 'India',
      preferred_contact: 'whatsapp',
      service_required: service.title,
      project_budget: '₹50,000 – ₹1,00,000',
      message: `Hello PIVO TECH, I would like to get "${service.title}" for my business.`
    });
    setEnquirySuccessMsg(null);
    setEnquiryErrorMsg(null);
    generateCaptcha();
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryErrorMsg(null);
    setEnquirySuccessMsg(null);

    if (!enquiryForm.full_name.trim() || !enquiryForm.phone.trim() || !enquiryForm.email.trim()) {
      setEnquiryErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    if (Number(captchaAnswer) !== captchaNum1 + captchaNum2) {
      setEnquiryErrorMsg(`Verification challenge failed: What is ${captchaNum1} + ${captchaNum2}?`);
      return;
    }

    setSubmittingEnquiry(true);
    try {
      const res = await api.submitEnquiry({
        ...enquiryForm,
        captcha_answer: Number(captchaAnswer),
        captcha_expected: captchaNum1 + captchaNum2
      });

      setEnquirySuccessMsg(`Thank you! Your project enquiry #${res.enquiryId} has been registered successfully. Founder Harish K will review your requirements and reach out within 4 business hours.`);
    } catch (err: any) {
      setEnquiryErrorMsg(err.message || 'Failed to submit enquiry. Please try again or message via WhatsApp.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-6 h-6 text-[#C6A15B]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#C6A15B]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#C6A15B]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#C6A15B]" />;
      default: return <Layers className="w-6 h-6 text-[#C6A15B]" />;
    }
  };

  // Fallback images in case DB record does not include images
  const defaultImagesMap: { [slug: string]: ServiceImage[] } = {
    'website-development': [
      { id: 'w1', title: 'Premium Business Website Mockup', caption: 'Corporate portal with clean typography, executive layout, and brand storytelling.', url: '/assets/services/web-01-business.jpg', badge: 'MacBook Pro Mockup' },
      { id: 'w2', title: 'Modern E-Commerce Storefront', caption: 'Frictionless checkout experience, dynamic product catalog, and secure payment gateway.', url: '/assets/services/web-02-ecommerce.jpg', badge: 'Storefront UI' },
      { id: 'w3', title: 'Professional Portfolio Website', caption: 'Minimalist designer and executive portfolio architecture with interactive case studies.', url: '/assets/services/web-03-portfolio.jpg', badge: 'Portfolio Showcase' },
      { id: 'w4', title: 'Responsive Multi-Device Layout', caption: 'Fluid cross-platform synchronization across laptop, tablet, and smartphone screens.', url: '/assets/services/web-04-responsive.jpg', badge: 'Responsive Sync' }
    ],
    'ai-agent-development': [
      { id: 'a1', title: 'Conversational AI Chatbot Interface', caption: 'Intelligent conversational assistant with natural language understanding and instant responses.', url: '/assets/services/ai-01-chatbot.jpg', badge: 'Conversational AI' },
      { id: 'a2', title: 'AI Customer Support Hub', caption: 'Autonomous support desk with intelligent ticket categorization and automated triage.', url: '/assets/services/ai-02-support-dashboard.jpg', badge: 'Support Dashboard' },
      { id: 'a3', title: 'AI Voice Assistant Interface', caption: 'Real-time speech-to-text, neural voice synthesis, and interactive voice agent pipeline.', url: '/assets/services/ai-03-voice-assistant.jpg', badge: 'Voice Synthesis' },
      { id: 'a4', title: 'AI Automation Agent Workflow', caption: 'Autonomous multi-step decision engine connecting customer prompts to backend tools.', url: '/assets/services/ai-04-automation-workflow.jpg', badge: 'Agentic Workflow' }
    ],
    'business-automation': [
      { id: 'b1', title: 'Modern Business Automation Console', caption: 'Central executive control dashboard tracking automated processes, time saved, and uptime.', url: '/assets/services/auto-01-dashboard.jpg', badge: 'Executive Console' },
      { id: 'b2', title: 'CRM Lead Management Pipeline', caption: 'Automated lead capture, deal stage progression, and WhatsApp enquiry routing.', url: '/assets/services/auto-02-crm-lead.jpg', badge: 'CRM Pipeline' },
      { id: 'b3', title: 'Automated Workflow Visual Interface', caption: 'Interconnected cloud automation network routing webhooks, APIs, and business data.', url: '/assets/services/auto-03-workflow-visual.jpg', badge: 'Cloud Automation' },
      { id: 'b4', title: 'Business Analytics & KPI Suite', caption: 'Automated real-time business performance scorecards and scheduled executive digests.', url: '/assets/services/auto-04-analytics-reporting.jpg', badge: 'Analytics Suite' }
    ],
    'digital-marketing': [
      { id: 'm1', title: 'Multi-Channel Marketing Dashboard', caption: 'Comprehensive growth tracking, blended campaign reach, ROAS metrics, and conversion rates.', url: '/assets/services/mkt-01-marketing-dashboard.jpg', badge: 'Growth Hub' },
      { id: 'm2', title: 'Instagram & Social Media Marketing', caption: 'High-converting viral creative content, aesthetic brand layouts, and WhatsApp bio funnels.', url: '/assets/services/mkt-02-instagram-campaign.jpg', badge: 'Meta & Instagram' },
      { id: 'm3', title: 'Google Ads PPC Performance Suite', caption: 'High-intent search advertising, conversion rate optimization, and bidding analytics.', url: '/assets/services/mkt-03-google-ads.jpg', badge: 'Google Ads' },
      { id: 'm4', title: 'SEO Traffic & Search Engine Ranking Engine', caption: 'Keyword research, organic visibility growth, technical SEO audits, and ranking analytics.', url: '/assets/services/mkt-04-seo-traffic.jpg', badge: 'Organic SEO' }
    ]
  };

  const navItems = [
    { num: '01', slug: 'website-development', name: 'Website Development' },
    { num: '02', slug: 'ai-agent-development', name: 'AI Agent Development' },
    { num: '03', slug: 'business-automation', name: 'Business Automation' },
    { num: '04', slug: 'digital-marketing', name: 'Digital Marketing' }
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 pb-20 relative">
      {/* Floating Right-Side Sticky Scroll Navigation (Desktop Only) */}
      <aside className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5 p-3 rounded-2xl bg-[#101B33]/90 backdrop-blur-md border border-[#1A2846] shadow-2xl">
        <span className="text-[9px] uppercase font-bold tracking-widest text-[#C6A15B] px-2 pt-1">
          Services Nav
        </span>
        {navItems.map((item) => {
          const isActive = activeSection === item.slug;
          return (
            <button
              key={item.slug}
              onClick={() => scrollToSection(item.slug)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all duration-200 group ${
                isActive
                  ? 'bg-white/10 text-white font-bold border-l-2 border-[#C6A15B]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-[11px] font-mono ${isActive ? 'text-[#C6A15B]' : 'text-slate-500'}`}>
                {item.num}
              </span>
              <span className="truncate max-w-[140px]">{item.name}</span>
            </button>
          );
        })}
      </aside>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-30 p-3 rounded-full bg-[#101B33] text-[#C6A15B] hover:bg-[#1A2846] border border-[#C6A15B]/40 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Premium Hero Section */}
      <section className="bg-[#101B33] text-white py-20 lg:py-24 border-b border-[#1A2846] relative overflow-hidden">
        {/* Subtle geometric grid background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#C6A15B]/30 text-xs font-semibold text-[#E5C378] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Full-Stack Digital Agency Solutions &bull; PIVO TECH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Build. Grow. <span className="text-[#C6A15B]">Automate.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl mt-5 leading-relaxed font-normal">
              We engineer bespoke digital experiences, autonomous AI agents, and intelligent workflow automation systems designed to give ambitious businesses measurable operational leverage.
            </p>

            {/* Quick Filter Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-8">
              {navItems.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => scrollToSection(item.slug)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all hover:border-[#C6A15B]"
                >
                  <span className="text-[#C6A15B] font-mono mr-1.5">{item.num}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal Animated Scroll Indicator at Hero Bottom */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => scrollToSection('website-development')}
            className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-[#C6A15B] text-xs transition-colors group"
          >
            <span className="tracking-widest uppercase text-[10px] font-bold">Explore Services</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#C6A15B]" />
          </button>
        </div>
      </section>

      {/* Main Services Container */}
      <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
        {services.map((service, index) => {
          const serviceImages = service.images && service.images.length > 0
            ? service.images
            : (defaultImagesMap[service.slug] || []);

          const currentImgIdx = activeImageIndex[service.slug] || 0;
          const activeImage = serviceImages[currentImgIdx] || serviceImages[0];

          // Alternating editorial layout:
          // Section 1: Text Left, Image Right
          // Section 2: Image Left, Text Right
          // Section 3: Text Left, Image Right
          // Section 4: Image Left, Text Right
          const isReversed = index % 2 === 1;

          return (
            <section
              key={service.id || service.slug}
              id={service.slug}
              className="scroll-mt-28 transition-all duration-300"
            >
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all duration-300 p-8 sm:p-12 lg:p-14">
                {/* Service Category Header Bar */}
                <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-slate-100 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#101B33] flex items-center justify-center shadow-sm shrink-0">
                      {getServiceIcon(service.icon_name)}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C6A15B]">
                        SERVICE 0{index + 1}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B33] tracking-tight">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#101B33]/5 text-[#101B33] border border-slate-200">
                    {service.category}
                  </span>
                </div>

                {/* Alternating Two-Column Grid */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}>
                  {/* TEXT COLUMN */}
                  <div className={`lg:col-span-6 space-y-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div>
                      <h3 className="text-lg font-bold text-[#101B33] mb-2">
                        Strategic Overview
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        "{service.description}"
                      </p>
                    </div>

                    {/* Key Features Block */}
                    <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/70">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#101B33] mb-3.5 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                        <span>Included Scope &amp; Deliverables</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Benefits Block */}
                    <div className="bg-[#101B33]/[0.02] rounded-2xl p-6 border border-slate-200/70">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#101B33] mb-3.5 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                        <span>Measurable Business Benefits</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openEnquiryModal(service)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-all shadow-sm active:scale-95"
                      >
                        <Send className="w-4 h-4 text-[#C6A15B]" />
                        <span>Get This Service</span>
                      </button>

                      <button
                        onClick={() => setDetailsModalService(service)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-700 hover:text-[#101B33] hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span>View Details</span>
                      </button>

                      <a
                        href={`https://wa.me/919944245043?text=${encodeURIComponent(`Hello Harish K, I am interested in PIVO TECH's "${service.title}". Please share consultation details.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all ml-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* INTERACTIVE IMAGE PREVIEW COLUMN */}
                  <div className={`lg:col-span-6 space-y-4 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    {/* Main Large Preview Card */}
                    <div className="bg-[#0C1426] rounded-2xl overflow-hidden border-2 border-slate-200/90 shadow-premium relative group">
                      {/* Image viewport with aspect ratio */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                        <img
                          src={activeImage?.url}
                          alt={activeImage?.title || service.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102"
                          loading="lazy"
                        />

                        {/* Top Overlay Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-md text-[11px] font-bold bg-[#101B33]/90 text-[#E5C378] border border-[#C6A15B]/40 backdrop-blur-sm shadow-sm">
                          {activeImage?.badge || `Preview ${currentImgIdx + 1} of ${serviceImages.length}`}
                        </div>

                        {/* Fullscreen Expand Action */}
                        <button
                          onClick={() => setLightboxImage({
                            url: activeImage?.url,
                            title: activeImage?.title,
                            caption: activeImage?.caption,
                            serviceTitle: service.title
                          })}
                          className="absolute top-3 right-3 p-2 rounded-lg bg-[#101B33]/85 text-white hover:text-[#C6A15B] border border-white/10 backdrop-blur-sm opacity-90 hover:opacity-100 transition-all shadow-sm"
                          title="View Fullscreen Preview"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Caption Footer */}
                      <div className="p-4 bg-[#101B33] text-white border-t border-[#1C2C4E]">
                        <h5 className="text-sm font-bold text-white flex items-center justify-between">
                          <span>{activeImage?.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Click thumbnails to inspect
                          </span>
                        </h5>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {activeImage?.caption}
                        </p>
                      </div>
                    </div>

                    {/* 3-4 Clickable Preview Thumbnails */}
                    <div className="grid grid-cols-4 gap-2.5">
                      {serviceImages.map((img, thumbIdx) => {
                        const isCurrent = currentImgIdx === thumbIdx;
                        return (
                          <button
                            key={img.id || thumbIdx}
                            type="button"
                            title={`${img.title} — ${img.badge || ''}`}
                            onClick={() => {
                              setActiveImageIndex(prev => ({
                                ...prev,
                                [service.slug]: thumbIdx
                              }));
                            }}
                            className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-200 group text-left ${
                              isCurrent
                                ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30 scale-[1.03] shadow-md z-10'
                                : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#101B33]/90 text-white shadow-sm">
                              0{thumbIdx + 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Engineered Workflow Pipeline Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Engineered Delivery Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101B33] mt-2">
            The PIVO TECH Automation &amp; Development Workflow
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every business solution, web system, and AI agent we build follows an end-to-end, resilient 7-stage architectural pipeline designed for zero data loss, low latency, and deterministic outcomes.
          </p>
        </div>

        {/* 7-Stage Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {[
            { step: '01', title: 'Trigger Event', desc: 'Customer form, webhook, API call, or scheduled cron timer.' },
            { step: '02', title: 'Data Ingest', desc: 'Raw payload parsed, sanitized, and normalized into strict types.' },
            { step: '03', title: 'Validation', desc: 'Anti-bot honeypots, rate limiting, and mathematical verification.' },
            { step: '04', title: 'Processing', desc: 'LLM agents, core business logic, and transactional execution.' },
            { step: '05', title: 'Notification', desc: 'Instant WhatsApp message, email alerts, and team webhook sync.' },
            { step: '06', title: 'Database Sync', desc: 'ACID-compliant storage, lead status tracking, and audit logging.' },
            { step: '07', title: 'Reports & BI', desc: 'Admin dashboards, CSV lead export, and executive analytics.' }
          ].map((node, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle hover:border-[#C6A15B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#C6A15B] bg-[#101B33] px-2 py-0.5 rounded-md">
                    {node.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Phase</span>
                </div>
                <h4 className="text-sm font-bold text-[#101B33] mb-1">{node.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{node.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#101B33] to-[#1C2C4E] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base sm:text-lg font-bold">Need a custom automated pipeline for your company?</h4>
            <p className="text-xs sm:text-sm text-slate-300">We audit your current bottlenecks and build end-to-end automations that save hours daily.</p>
          </div>
          <a
            href="https://wa.me/919944245043?text=Hi%20Harish%2C%20I%20want%20to%20discuss%20an%20automated%20workflow%20pipeline%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] font-bold text-xs shrink-0 transition-all shadow-md"
          >
            Consult on WhatsApp &rarr;
          </a>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B33] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Everything you need to know about partnering with PIVO TECH.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How do we get started with a project?',
              a: 'You can submit your project requirements using any of our service enquiry forms or reach out directly via WhatsApp (+91 99442 45043). Founder Harish K conducts an initial technical scoping review within 4 business hours and provides a clear timeline and milestone proposal.'
            },
            {
              q: 'Do you work with international clients outside India?',
              a: 'Yes. PIVO TECH operates globally. We partner with clients across India (Chennai, Bangalore, Mumbai, etc.) as well as international businesses across North America, Europe, UAE, and Southeast Asia. We communicate effectively through WhatsApp, Google Meet, and email.'
            },
            {
              q: 'What are the typical project delivery timelines?',
              a: 'High-converting business websites and landing page systems are delivered within 1 to 3 weeks. Comprehensive e-commerce portals, custom web applications, and multi-channel AI workflow automations typically require 2 to 4 weeks, with live staging previews provided at key milestones.'
            },
            {
              q: 'Can PIVO TECH integrate with our existing software and tools?',
              a: 'Yes. We specialize in custom integrations connecting your web platforms to WhatsApp Business API, CRM systems (HubSpot, Zoho, Salesforce), Google Workspace, payment gateways (Razorpay, Stripe), SQLite/Postgres databases, and ERP spreadsheets.'
            },
            {
              q: 'What kind of support and warranty is provided after launch?',
              a: 'Every completed solution includes a comprehensive post-deployment warranty covering bug fixes, performance tuning, and security updates, with direct architectural oversight from Founder & Managing Director Harish K.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#101B33] hover:text-[#C6A15B] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                  {openFaqIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#101B33] rounded-3xl overflow-hidden border border-[#203158] shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#203158]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A15B]">
                  {lightboxImage.serviceTitle}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {lightboxImage.title}
                </h4>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Visual */}
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black/40 p-2 sm:p-4">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Caption */}
            <div className="p-4 sm:p-5 border-t border-[#203158] bg-[#0C1426] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-300">
                {lightboxImage.caption}
              </p>
              <button
                onClick={() => {
                  const s = services.find(srv => srv.title === lightboxImage.serviceTitle);
                  if (s) {
                    setLightboxImage(null);
                    openEnquiryModal(s);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all shrink-0"
              >
                <span>Get This Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "View Details" Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#101B33] flex items-center justify-center">
                  {getServiceIcon(detailsModalService.icon_name)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A15B]">
                    Detailed Technical Scope
                  </span>
                  <h3 className="text-xl font-bold text-[#101B33]">
                    {detailsModalService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDetailsModalService(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 my-6 text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-[#101B33] text-sm uppercase tracking-wider mb-2">
                  Executive Description
                </h4>
                <p className="leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {detailsModalService.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#101B33] text-sm uppercase tracking-wider mb-2">
                  Deliverables &amp; Inclusions
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detailsModalService.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#101B33] text-sm uppercase tracking-wider mb-2">
                  Expected Business Outcomes
                </h4>
                <ul className="space-y-2">
                  {detailsModalService.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technology Stack & Tooling */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Cpu className="w-4 h-4 text-[#C6A15B]" />
                  <h4 className="font-bold text-[#101B33] text-sm uppercase tracking-wider">
                    Engineered Technology Stack
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailsModalService.slug === 'website-development' && [
                    'React 19', 'TypeScript', 'Tailwind CSS', 'Next.js / Vite', 'Node.js', 'PostgreSQL / SQLite', 'Vercel / Cloudflare'
                  ].map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      {tech}
                    </span>
                  ))}
                  {detailsModalService.slug === 'ai-agent-development' && [
                    'OpenAI GPT-4o', 'Claude 3.5', 'WhatsApp Cloud API', 'Python', 'LangChain', 'FastAPI', 'Vector Databases'
                  ].map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      {tech}
                    </span>
                  ))}
                  {detailsModalService.slug === 'business-automation' && [
                    'n8n Workflows', 'Make / Zapier', 'PostgreSQL', 'RESTful APIs', 'Google Workspace API', 'Webhook Queues', 'Custom Microservices'
                  ].map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      {tech}
                    </span>
                  ))}
                  {detailsModalService.slug === 'digital-marketing' && [
                    'Meta Ads Manager', 'Google Ads PPC', 'Google Analytics 4', 'Semrush / Ahrefs', 'Search Console', 'Conversion Tracking'
                  ].map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Timeline & Milestones */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C6A15B]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#101B33]">
                      Estimated Delivery Timeline
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#101B33] text-white">
                    {detailsModalService.slug === 'website-development' ? '2 – 4 Weeks' :
                     detailsModalService.slug === 'ai-agent-development' ? '2 – 3 Weeks' :
                     detailsModalService.slug === 'business-automation' ? '1 – 3 Weeks' : 'Bi-Weekly Sprints'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Includes comprehensive requirements analysis, iterative architecture, staging milestone reviews with Founder Harish K, security audits, and guaranteed post-launch warranty.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101B33]/5 border border-[#101B33]/15 text-xs">
                <span className="font-bold text-[#101B33] block mb-1">
                  Guaranteed PIVO TECH Standards:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Every solution is engineered without basic third-party templates. All client projects receive direct architectural oversight from Founder &amp; CEO Harish K, post-launch warranties, and responsive support.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <a
                href={`https://wa.me/919944245043?text=${encodeURIComponent(`Hello Harish K, I am reviewing the "${detailsModalService.title}" details on PIVO TECH website and have questions.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ask Question via WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailsModalService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const s = detailsModalService;
                    setDetailsModalService(null);
                    openEnquiryModal(s);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold shadow-sm"
                >
                  Proceed to Enquiry →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Get This Service" Modal Enquiry Form */}
      {enquiryModalService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A15B]">
                  Direct Service Request
                </span>
                <h3 className="text-xl font-bold text-[#101B33]">
                  Get {enquiryModalService.title}
                </h3>
              </div>
              <button
                onClick={() => setEnquiryModalService(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            {enquirySuccessMsg ? (
              <div className="my-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold">Enquiry Successfully Dispatched</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-emerald-800">
                  {enquirySuccessMsg}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/919944245043?text=${encodeURIComponent(`Hi Harish, I just submitted an enquiry on your website for "${enquiryModalService.title}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101B33] text-white text-xs font-bold shadow-sm hover:bg-[#1C2C4E]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#C6A15B]" />
                    <span>Open WhatsApp Chat (+91 99442 45043)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setEnquiryModalService(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 mt-6">
                {enquiryErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{enquiryErrorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.full_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, full_name: e.target.value })}
                      placeholder="e.g. Karthikeyan S"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={enquiryForm.business_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, business_name: e.target.value })}
                      placeholder="e.g. Apex Enterprises"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 99442 XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="client@yourbusiness.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={enquiryForm.city}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                      placeholder="e.g. Chennai, Mumbai"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={enquiryForm.country}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, country: e.target.value })}
                      placeholder="e.g. India, USA, UAE"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Preferred Contact
                    </label>
                    <select
                      value={enquiryForm.preferred_contact}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, preferred_contact: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="whatsapp">WhatsApp Message</option>
                      <option value="phone">Phone Call</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Selected Service
                    </label>
                    <select
                      value={enquiryForm.service_required}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, service_required: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#C6A15B]"
                    >
                      {services.map(s => (
                        <option key={s.id || s.slug} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Estimated Budget
                    </label>
                    <select
                      value={enquiryForm.project_budget}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, project_budget: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Under ₹50,000">Under ₹50,000</option>
                      <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                      <option value="₹1,00,000 – ₹2,50,000">₹1,00,000 – ₹2,50,000</option>
                      <option value="₹2,50,000 – ₹5,00,000">₹2,50,000 – ₹5,00,000</option>
                      <option value="Above ₹5,00,000">Above ₹5,00,000</option>
                      <option value="International / Custom Scope">International / Custom Scope</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Requirements &amp; Objectives *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="Briefly describe your vision, timeline, and current business setup..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                {/* Math challenge */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Security Verification: What is {captchaNum1} + {captchaNum2}? *
                  </label>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Enter sum"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalService(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="px-6 py-2.5 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    {submittingEnquiry ? 'Transmitting Request...' : 'Submit Service Request →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Strategic Consultation Strip */}
      <section className="mt-20 py-20 bg-[#101B33] text-white border-t border-[#1C2C4E]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/20 border border-[#C6A15B]/40 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-[#C6A15B]" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to Build, Grow, or Automate?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Schedule an exploratory consultation with Founder Harish K. We evaluate your operational challenges and suggest a clear, practical roadmap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all shadow-md active:scale-95"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919944245043"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#1C2C4E] text-slate-200 hover:text-white transition-colors border border-slate-700/60"
            >
              <MessageSquare className="w-4 h-4 text-[#C6A15B]" />
              <span>Direct WhatsApp (+91 99442 45043)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
