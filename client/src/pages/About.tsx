import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Target,
  Compass,
  Sparkles,
  CheckCircle,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { api } from '../services/api';
import { CompanyInfo } from '../types';

export const About: React.FC = () => {
  const [company, setCompany] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    api.getCompany().then(setCompany).catch(err => console.error(err));
  }, []);

  const valuesIcons: Record<string, React.ReactNode> = {
    'Innovation': <Lightbulb className="w-5 h-5 text-[#C6A15B]" />,
    'Quality': <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />,
    'Transparency': <CheckCircle className="w-5 h-5 text-[#C6A15B]" />,
    'Creativity': <Sparkles className="w-5 h-5 text-[#C6A15B]" />,
    'Reliability': <Target className="w-5 h-5 text-[#C6A15B]" />,
    'Customer Satisfaction': <HeartHandshake className="w-5 h-5 text-[#C6A15B]" />
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-[#101B33] text-white py-20 border-b border-[#1A2846]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
              About PIVO TECH
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 text-white">
              Engineering Practical Digital Leverage for Modern Businesses.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
              Founded by Harish K in Theni, Tamil Nadu, PIVO TECH is built on the belief that cutting-edge technology should be accessible, robust, and directly tied to business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Main Introduction Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
              Our Foundation
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B33] tracking-tight">
              A Technology Partner You Can Rely On
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                {company?.about_intro || "PIVO TECH is a technology-focused digital solutions business founded by Harish K in Theni, Tamil Nadu, India. We focus on helping startups, entrepreneurs and businesses build their digital presence, improve customer engagement and simplify operations using modern technology."}
              </p>
              <p>
                We do not believe in complicated jargon or superficial templates. Every solution we deliver — whether a corporate web application, high-converting marketing framework, or intelligent AI workflow — is designed from first principles to solve real operational bottlenecks and maximize client revenue.
              </p>
              <p>
                Operating from Theni, Tamil Nadu, we serve both forward-thinking Indian businesses and international clients seeking reliable, high-grade development talent.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/founder"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors"
              >
                <span>Meet Founder Harish K</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200"
              >
                <span>View Our Capabilities</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-premium space-y-6">
              <h3 className="text-xl font-bold text-[#101B33] border-b border-slate-100 pb-3">
                Key Company Facts
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-semibold">Business Name</span>
                  <span className="font-bold text-[#101B33] text-base">PIVO TECH</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-semibold">Tagline</span>
                  <span className="font-medium text-[#C6A15B]">Build. Grow. Automate.</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-semibold">Founder &amp; CEO</span>
                  <span className="font-semibold text-slate-800">Harish K</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-semibold">Location</span>
                  <span className="font-semibold text-slate-800">Theni, Tamil Nadu, India</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-semibold">Target Markets</span>
                  <span className="font-semibold text-slate-800">India &amp; International</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-semibold">Contact Channels</span>
                  <span className="font-semibold text-slate-800">harishkumaravel2007@gmail.com &bull; +91 99442 45043</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#F7F8FA] rounded-2xl p-8 sm:p-10 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101B33] flex items-center justify-center mb-6 text-[#C6A15B]">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Our Purpose
                </span>
                <h3 className="text-2xl font-bold text-[#101B33] mt-1 mb-4">
                  Our Mission
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  {company?.mission || "Our mission is to deliver practical, reliable and scalable digital solutions."}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CheckCircle className="w-4 h-4 text-[#C6A15B]" />
                <span>Zero superficial fluff &bull; Grounded in real utility</span>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-[#101B33] text-white rounded-2xl p-8 sm:p-10 border border-[#1A2A4C] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1C2C4E] border border-[#C6A15B]/30 flex items-center justify-center mb-6 text-[#C6A15B]">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Forward Direction
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                  Our Vision
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  {company?.vision || "To become a trusted digital technology partner for businesses across India and international markets."}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#1C2C4E] flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span>Long-term strategic partnership model</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Guiding Philosophy
          </span>
          <h2 className="text-3xl font-extrabold text-[#101B33] tracking-tight mt-2 sm:text-4xl">
            Our Core Values
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            These six non-negotiable principles govern every line of code we write and every client relationship we foster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(company?.values || [
            { title: "Innovation", desc: "Embracing modern technology, AI workflows, and contemporary design principles." },
            { title: "Quality", desc: "Delivering performant, maintainable, and pixel-perfect digital solutions." },
            { title: "Transparency", desc: "Honest timelines, clear communication, and no hidden agendas or fake metrics." },
            { title: "Creativity", desc: "Original, functional solutions custom-tailored to each brand's specific market." },
            { title: "Reliability", desc: "Robust engineering with rock-solid uptime, security, and continuous support." },
            { title: "Customer Satisfaction", desc: "Prioritizing actual business outcomes, client growth, and long-term value." }
          ]).map((val, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
                {valuesIcons[val.title] || <Sparkles className="w-5 h-5 text-[#C6A15B]" />}
              </div>
              <h4 className="text-lg font-bold text-[#101B33] mb-2">{val.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-16 bg-[#101B33] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Want to discuss how PIVO TECH can partner with you?
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Connect directly with founder Harish K to evaluate your digital roadmap.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
