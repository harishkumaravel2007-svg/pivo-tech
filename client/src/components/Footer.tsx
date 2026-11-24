import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, ArrowUpRight, Lock } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101B33] text-white border-t border-[#1C2C4E]">
      {/* Top Banner CTA Strip */}
      <div className="border-b border-[#1A2A4C] py-12 bg-gradient-to-r from-[#0C1426] via-[#101B33] to-[#0C1426]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Take the Next Step
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-white">
                Ready to Build, Grow, or Automate your business?
              </h3>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Partner with PIVO TECH for high-performance websites, AI assistants, and intelligent operations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all shadow-md active:scale-95"
              >
                <span>Initiate Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919944245043?text=Hi%20Harish%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20PIVO%20TECH"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-[#1C2C4E] text-slate-200 hover:text-white hover:bg-[#253966] transition-colors border border-slate-700/60"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="md" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              PIVO TECH is a premier digital technology and IT solutions agency founded by Harish K in Theni, Tamil Nadu, India. Delivering practical, scalable digital solutions for startups and enterprises across India and international markets.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/harish-k-303480301/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#182644] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-[#C6A15B] hover:border-[#C6A15B]/50 transition-colors"
                aria-label="Harish K LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/_pivo.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#182644] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-[#C6A15B] hover:border-[#C6A15B]/50 transition-colors"
                aria-label="PIVO TECH Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/founder" className="hover:text-white transition-colors">Founder Profile</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio &amp; Projects</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">Clients &amp; Reviews</Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Website Development</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Digital Marketing</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">AI Agent Development</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Business Automation</Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] mb-4">
              Contact &amp; Location
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <span>Theni, Tamil Nadu, India.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <a
                  href="mailto:harishkumaravel2007@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  harishkumaravel2007@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <a
                  href="tel:+919944245043"
                  className="hover:text-white transition-colors"
                >
                  +91 99442 45043
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Admin Gateway */}
        <div className="mt-14 pt-8 border-t border-[#1A2A4C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} <strong className="text-slate-200">PIVO TECH</strong>. All rights reserved. Founded by Harish K.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-slate-400">
              Digital Solutions | Website Development | Digital Marketing | AI Agents | Business Automation
            </span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-[#C6A15B] transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
