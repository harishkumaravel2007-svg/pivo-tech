import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  TrendingUp,
  Cpu,
  Zap,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { api, getAssetUrl } from '../services/api';
import { Service, Project, Review, ReviewStats, FounderInfo } from '../types';
import { RatingStars } from '../components/RatingStars';
import { Logo } from '../components/Logo';

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [founder, setFounder] = useState<FounderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, projectsRes, reviewsRes, founderRes] = await Promise.all([
          api.getServices().catch(() => ({ services: [] })),
          api.getProjects().catch(() => ({ projects: [] })),
          api.getReviews().catch(() => ({
            reviews: [],
            stats: { total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
          })),
          api.getFounder().catch(() => null)
        ]);

        setServices(servicesRes.services);
        setProjects(projectsRes.projects.slice(0, 3));
        setReviews(reviewsRes.reviews.slice(0, 3));
        setStats(reviewsRes.stats);
        setFounder(founderRes);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-6 h-6 text-[#C6A15B]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#C6A15B]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#C6A15B]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#C6A15B]" />;
      default: return <Layers className="w-6 h-6 text-[#C6A15B]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#101B33] text-white overflow-hidden py-24 md:py-32 border-b border-[#1A2846]">
        {/* Subtle geometric precision grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '36px 36px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C6A15B]/40 text-xs font-semibold text-[#E5C378] mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse" />
              <span>Digital Technology &amp; IT Solutions Agency &bull; Theni, Tamil Nadu</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.08] mb-6 font-sans">
              BUILD. GROW. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C378] via-[#C6A15B] to-[#DFC076]">
                AUTOMATE.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl">
              We help businesses establish a powerful digital presence, reach more customers and transform their operations through modern websites, digital marketing and intelligent AI solutions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all shadow-md active:scale-95"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#1C2C4E] text-slate-200 hover:text-white hover:bg-[#253966] transition-colors border border-slate-700/60"
              >
                <span>View Our Portfolio</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Real Rating Badge - Strict: Only verified published reviews */}
            <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              {stats && stats.total > 0 ? (
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <RatingStars rating={stats.average} size="sm" />
                  <span className="text-slate-200 font-medium">
                    {stats.average} / 5.0 rating based on {stats.total} verified {stats.total === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                  <span>Verified Client Feedback System Active &bull; Transparent, genuine reviews only</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C6A15B]" />
                <span>Theni, Tamil Nadu &bull; Serving India &amp; International Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Agency Value Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Engineered For Impact
          </span>
          <h2 className="text-3xl font-extrabold text-[#101B33] tracking-tight mt-2 sm:text-4xl">
            Practical, Scalable Digital Solutions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Every business requires reliable digital infrastructure. We combine engineering excellence, targeted marketing, and autonomous AI agents to deliver measurable outcomes.
          </p>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-[#C6A15B]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B33] flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  {getServiceIcon(service.icon_name)}
                </div>
                <h3 className="text-xl font-bold text-[#101B33] mb-3 group-hover:text-[#1C457D] transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {service.summary}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/services#${service.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#101B33] group-hover:text-[#C6A15B] transition-colors pt-4 border-t border-slate-100"
              >
                <span>Explore Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Spotlight Preview */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-80 aspect-square rounded-3xl overflow-hidden border-2 border-[#C6A15B]/40 shadow-premium bg-[#101B33]">
                <img
                  src={getAssetUrl(founder?.photo_url) || '/assets/harish-founder.jpg'}
                  alt="Harish K - Founder & Managing Director of PIVO TECH"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Founder Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#101B33]/5 text-xs font-semibold text-[#101B33] border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Leadership &amp; Technical Vision</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101B33] tracking-tight">
                "Modern technology is not just for tech giants — it is the single greatest growth lever for every ambitious business."
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                "{founder?.bio || "Hello, I'm Harish K, Founder & Managing Director of PIVO TECH. I focus on building modern websites, digital growth solutions, AI-powered agents and business automation systems. My goal is to help businesses establish a strong digital presence, improve productivity and grow through practical technology solutions."}"
              </p>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-400 font-medium">Founder &amp; Managing Director</span>
                  <span className="text-base font-bold text-[#101B33]">Harish K</span>
                  <span className="block text-xs text-[#C6A15B] font-semibold">{founder?.tagline || 'Build. Grow. Automate.'}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-400 font-medium">Headquarters</span>
                  <span className="text-base font-bold text-[#101B33]">Theni, Tamil Nadu, India</span>
                  <span className="block text-xs text-slate-500">India &amp; International</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/founder"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors"
                >
                  <span>Meet the Founder</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://wa.me/919944245043?text=${encodeURIComponent("Hello Harish, I would like to discuss a digital technology project with PIVO TECH.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#101B33] bg-[#E5C378]/20 hover:bg-[#E5C378]/30 border border-[#C6A15B]/40 transition-colors"
                >
                  <span>Contact Founder (WhatsApp)</span>
                </a>
                <a
                  href={founder?.linkedin || "https://www.linkedin.com/in/harish-k-303480401/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
              Engineered Work
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B33] tracking-tight mt-1 sm:text-4xl">
              Featured Portfolio
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore interactive architectural concepts and production blueprints.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#101B33] hover:text-[#C6A15B] transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-subtle hover:shadow-premium transition-all duration-200 flex flex-col"
            >
              <div className="relative aspect-video bg-[#101B33] overflow-hidden group">
                <img
                  src={getAssetUrl(project.image_url)}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.is_demo_concept ? (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#101B33]/90 text-[#E5C378] border border-[#C6A15B]/40 backdrop-blur-sm">
                    Portfolio Demo
                  </span>
                ) : null}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B]">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#101B33] mt-1 mb-2">
                    {project.name}
                  </h3>

                  {project.is_demo_concept ? (
                    <div className="mb-3 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-medium">
                      Demonstration concept &bull; Not a real client project
                    </div>
                  ) : null}

                  <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {project.tagline || project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-between text-xs font-semibold text-[#101B33] hover:text-[#C6A15B] pt-4 border-t border-slate-100 transition-colors"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Reviews Section (Strictly Verified, No Fake Testimonials) */}
      <section className="py-20 bg-[#101B33] text-white border-t border-[#1C2C4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Client Trust &amp; Transparency
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1 sm:text-4xl">
                Verified Client Reviews
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                All published reviews are submitted by verified collaborators and reviewed for authenticity. We never publish fabricated testimonials.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all"
              >
                <span>Submit or View Reviews</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#152342] rounded-2xl p-7 border border-[#203158] flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4">
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                      "{review.review_text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#203158] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{review.reviewer_name}</h4>
                      {review.business_name && (
                        <span className="text-xs text-slate-400">{review.business_name}</span>
                      )}
                    </div>
                    {review.is_verified === 1 ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Verified Client
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#152342] rounded-2xl p-10 border border-[#203158] text-center max-w-xl mx-auto">
              <ShieldCheck className="w-10 h-10 text-[#C6A15B] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Verified Review Pipeline Open</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                We are actively executing client work. As verified project completions occur, authentic feedback will appear here. You can submit your experience anytime.
              </p>
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#C6A15B] text-[#101B33]"
              >
                Leave Client Feedback
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#101B33] flex items-center justify-center mx-auto mb-6 text-[#C6A15B] shadow-premium">
            <Logo variant="dark" symbolOnly size="md" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101B33] tracking-tight mb-4">
            Start Building with PIVO TECH
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Whether you need a custom corporate website, full-funnel digital marketing, or an autonomous AI assistant, we engineer solutions designed to succeed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-all shadow-md active:scale-95"
            >
              <span>Contact Harish K &bull; PIVO TECH</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919944245043"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span>Instant WhatsApp (+91 99442 45043)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
