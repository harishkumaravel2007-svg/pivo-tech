import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Code2,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { FounderInfo, Skill } from '../types';

export const Founder: React.FC = () => {
  const [founder, setFounder] = useState<FounderInfo | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    Promise.all([
      api.getFounder().catch(() => null),
      api.getSkills().catch(() => ({ skills: [] }))
    ]).then(([founderRes, skillsRes]) => {
      setFounder(founderRes);
      setSkills(skillsRes.skills);
    });
  }, []);

  const linkedinUrl = founder?.linkedin || 'https://www.linkedin.com/in/harish-k-303480301/';
  const instagramUrl = founder?.instagram || 'https://www.instagram.com/_pivo.tech/';
  const emailAddress = founder?.email || 'harishkumaravel2007@gmail.com';
  const phoneNumber = founder?.phone || '+91 99442 45043';
  const whatsappUrl = `https://wa.me/919944245043?text=${encodeURIComponent("Hello Harish, I would like to discuss a digital technology project with PIVO TECH.")}`;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-[#101B33] text-white py-16 sm:py-20 border-b border-[#1A2846]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-xs font-semibold text-[#E5C378] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Executive Leadership &bull; PIVO TECH</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {founder?.name || 'Harish K'}
            </h1>
            <p className="text-xl text-[#C6A15B] font-semibold mt-1">
              {founder?.designation || 'Founder & CEO'}, {founder?.company || 'PIVO TECH'}
            </p>
            <p className="text-slate-300 text-sm sm:text-base mt-2 flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide">
                {founder?.tagline || 'Build. Grow. Automate.'}
              </span>
              <span className="text-slate-400">&bull;</span>
              <MapPin className="w-4 h-4 text-[#C6A15B] inline" />
              <span>{founder?.location || 'Theni, Tamil Nadu, India'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Profile Grid */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Portrait, Identity & Direct Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-premium p-6 sm:p-8">
              {/* Founder Photo */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#101B33] mb-6 border-2 border-[#C6A15B]/50 shadow-md">
                <img
                  src={founder?.photo_url || '/assets/harish-founder.jpg'}
                  alt={`${founder?.name || 'Harish K'} - Founder & CEO of PIVO TECH`}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Title & Tagline */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-[#101B33]">
                  {founder?.name || 'Harish K'}
                </h2>
                <p className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider mt-1">
                  {founder?.designation || 'Founder & CEO'} &bull; {founder?.company || 'PIVO TECH'}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1 italic">
                  "{founder?.tagline || 'Build. Grow. Automate.'}"
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{founder?.location || 'Theni, Tamil Nadu, India'}</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & LinkedIn */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-all shadow-sm active:scale-95 group"
                >
                  <Send className="w-4 h-4 text-[#C6A15B] group-hover:scale-110 transition-transform" />
                  <span>Contact Founder (WhatsApp)</span>
                </a>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#101B33] border border-slate-200 hover:border-[#C6A15B] hover:bg-slate-50 transition-all shadow-sm group"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5] group-hover:scale-110 transition-transform" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </a>
              </div>

              {/* Social Media & Contact Links */}
              <div className="space-y-2 pt-5 mt-5 border-t border-slate-100 text-xs">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#E4405F]" />
                    <span className="font-medium text-slate-700">Instagram: @_pivo.tech</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                </a>

                <a
                  href={`mailto:${emailAddress}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#C6A15B]" />
                    <span className="font-medium truncate max-w-[200px] text-slate-700">
                      {emailAddress}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                </a>

                <a
                  href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#C6A15B]" />
                    <span className="font-medium text-slate-700">{phoneNumber}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Intro, Philosophy, Vision & Skills */}
          <div className="lg:col-span-7 space-y-8">
            {/* Professional Introduction Box */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-subtle space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Professional Introduction
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101B33] tracking-tight">
                About The Founder &amp; Visionary
              </h3>

              <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 pt-2">
                <p className="font-medium text-[#101B33] bg-[#F7F8FA] p-4 rounded-2xl border-l-4 border-[#C6A15B]">
                  "{founder?.bio || "Hello, I'm Harish K, Founder & CEO of PIVO TECH. I focus on building modern websites, digital growth solutions, AI-powered agents and business automation systems. My goal is to help businesses establish a strong digital presence, improve productivity and grow through practical technology solutions."}"
                </p>
                <p>
                  As an engineer and agency founder, I prioritize deep technical understanding over surface-level hype. When engineering digital systems for our clients, my core focus is always long-term stability, lightning-fast performance, and measurable operational leverage.
                </p>
                <p>
                  I am personally involved in evaluating client requirements, selecting modern architectures (such as React, TypeScript, Fastify/Node.js, and SQLite), and ensuring that our AI agents and automation workflows deliver tangible return on investment.
                </p>
              </div>
            </div>

            {/* Founder Vision Box */}
            <div className="bg-[#101B33] text-white rounded-3xl p-8 sm:p-10 border border-[#1A2A4C] shadow-premium space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Founder Vision
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white">
                "Building enduring technology relationships rooted in genuine craftsmanship."
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {founder?.vision || "To build a world-class technology firm rooted in integrity, delivering tangible digital leverage to startups, enterprises, and local businesses alike."}
              </p>
            </div>

            {/* Areas of Engineering Expertise */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-subtle">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B] block mb-1">
                Specialized Competencies
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#101B33] mb-6">
                Technical Domains &amp; Areas of Expertise
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(founder?.areas_of_expertise || [
                  "Full-Stack Web Development & Modern Architecture",
                  "Tailwind CSS & Component-Driven UI Engineering",
                  "Artificial Intelligence & LLM API Integration",
                  "Autonomous Agent Workflows & Chatbot Systems",
                  "Business Workflow Automation & Operations Optimization",
                  "Database Modeling & Secure REST API Design"
                ]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F8FA] border border-slate-200/70"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Proficiency Matrix */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-subtle">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B] block mb-1">
                Engineering Stack
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#101B33] mb-2">
                Hands-On Tooling &amp; Technologies
              </h4>
              <p className="text-slate-500 text-xs mb-5">
                Core technologies and engineering frameworks practiced across PIVO TECH client engagements.
              </p>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-[#101B33] border border-slate-200 hover:border-[#C6A15B] transition-colors"
                  >
                    <Code2 className="w-3 h-3 text-[#C6A15B]" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
