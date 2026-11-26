import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Github,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  FolderGit2,
  Star,
  UserCheck,
  Building2,
  Sparkles,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { api, getAssetUrl } from '../services/api';
import { Project } from '../types';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { RatingStars } from '../components/RatingStars';
import { normalizeExternalUrl } from '../utils/url';

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Business Websites',
    'E-commerce Websites',
    'Web Applications',
    'AI Solutions',
    'Business Automation'
  ];

  useEffect(() => {
    api.getProjects()
      .then(res => setProjects(res.projects))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openProjectModal = (proj: Project) => {
    setSelectedProject(proj);
    setActiveImage(proj.image_url);
  };

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-[#101B33] text-white py-20 border-b border-[#1A2846]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
              Engineered Work &amp; Blueprints
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 text-white">
              Portfolio &amp; Project Showcases
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
              Explore our architectural demonstrations, web applications, and intelligent systems. Each project represents our commitment to clean code and high performance.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transparency Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex items-start gap-4">
          <div className="p-2 rounded-xl bg-slate-100 text-[#101B33] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-sm">
            <h3 className="font-bold text-[#101B33] mb-1">Portfolio Transparency Notice</h3>
            <p className="text-slate-600 leading-relaxed">
              PIVO TECH is actively onboarding client engagements. Demonstrated projects tagged as <strong>Interactive Concept</strong> illustrate our architectural design patterns and technical capabilities. Client website URLs are added upon formal client release.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#101B33] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-[#101B33] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-subtle hover:shadow-premium transition-all flex flex-col group"
              >
                {/* Project Image Banner */}
                <div className="relative aspect-video bg-[#101B33] overflow-hidden">
                  <img
                    src={getAssetUrl(project.image_url)}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.is_demo_concept ? (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#101B33]/90 text-[#E5C378] border border-[#C6A15B]/40 backdrop-blur-sm">
                      Demo Concept
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Client Project
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-bold uppercase tracking-wider text-[#C6A15B]">
                        {project.category}
                      </span>
                      {project.completion_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{project.completion_date}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#101B33] mb-2 group-hover:text-[#1C457D] transition-colors">
                      {project.name}
                    </h3>

                    {project.is_demo_concept ? (
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                        <span><strong>Portfolio Demo:</strong> Architecture &amp; design concept. Not a real client project.</span>
                      </div>
                    ) : (
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span><strong>Live Client Deployment:</strong> Delivered for Sri Balaji Stationery, Sowcarpet, Chennai.</span>
                      </div>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openProjectModal(project)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#101B33] bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {(() => {
                          const validLiveUrl = normalizeExternalUrl(project.live_url);
                          if (!validLiveUrl) return null;
                          return (
                            <a
                              href={validLiveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1A2846] transition-colors shadow-sm"
                              title={`Visit live website: ${validLiveUrl}`}
                            >
                              <Globe className="w-3.5 h-3.5 text-[#C6A15B]" />
                              <span>Visit Website</span>
                              <ExternalLink className="w-3 h-3 opacity-80" />
                            </a>
                          );
                        })()}

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="View Source on GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/919944245043?text=${encodeURIComponent(
                        `Hi Harish, I saw your ${project.name} (${project.category}) project on PIVO TECH and would like to build a similar solution for my business.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-[#101B33] text-white hover:bg-[#C6A15B] hover:text-[#101B33] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Request Similar Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FolderGit2}
            title="No Projects In This Category Yet"
            description="We are regularly updating our portfolio as new client deployments and architectural concepts go live."
            actionText="View All Categories"
            onAction={() => setActiveCategory('All')}
          />
        )}
      </section>

      {/* Case Study Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.name}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Active Image Display */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#101B33] border border-slate-200 shadow-sm relative group">
              <img
                src={getAssetUrl(activeImage || selectedProject.image_url)}
                alt={selectedProject.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Screenshots Gallery Strip (if screenshots available) */}
            {((selectedProject.screenshots && selectedProject.screenshots.length > 0) || selectedProject.image_url) && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Interactive Visual Gallery</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {/* Main thumbnail option */}
                  <button
                    type="button"
                    onClick={() => setActiveImage(selectedProject.image_url)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      (activeImage === selectedProject.image_url || !activeImage)
                        ? 'border-[#C6A15B] shadow-md scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getAssetUrl(selectedProject.image_url)}
                      alt="Main Cover"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Screenshots */}
                  {selectedProject.screenshots?.map((shot, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setActiveImage(shot)}
                      className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === shot
                          ? 'border-[#C6A15B] shadow-md scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getAssetUrl(shot)}
                        alt={`Screenshot ${sIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Badges row: Category, Client, Concept vs Real */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold uppercase tracking-wider text-[#C6A15B]">
                  {selectedProject.category}
                </span>
                {selectedProject.client_name && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-600" />
                    <span>Client: {selectedProject.client_name}</span>
                  </span>
                )}
              </div>

              {selectedProject.is_demo_concept ? (
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  Concept Demonstration (Not A Client Project)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Client Project</span>
                </span>
              )}
            </div>

            {selectedProject.is_demo_concept ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Demonstration Concept:</strong> This project is an architectural and UX demonstration engineered by PIVO TECH to demonstrate technical capabilities, performance standards, and interface design. It is not an active commercial client engagement.
                </div>
              </div>
            ) : null}

            {/* Project Overview */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
                Project Overview
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Key Features Implemented (MODULE 1 & 2) */}
            {selectedProject.features && selectedProject.features.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Key Features Implemented
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case Study / Full Architecture */}
            {selectedProject.case_study && (
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
                  Architecture &amp; Case Study
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedProject.case_study}
                </div>
              </div>
            )}

            {/* Technologies Used */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#101B33] text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* MODULE 4: Linked Approved Client Review Showcase */}
            {selectedProject.related_reviews && selectedProject.related_reviews.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#C6A15B] fill-[#C6A15B]" />
                  <h4 className="text-xs uppercase font-bold tracking-wider text-amber-950">
                    Verified Client Testimonial For This Project
                  </h4>
                </div>

                {selectedProject.related_reviews.map((r, rIdx) => (
                  <div key={rIdx} className="bg-white rounded-xl p-4 border border-amber-100 shadow-subtle space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#101B33]">
                            {r.business_name || r.reviewer_name}
                          </span>
                          {r.is_verified === 1 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <UserCheck className="w-2.5 h-2.5 text-emerald-600" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Reviewed by {r.reviewer_name} {r.location && `• ${r.location}`}
                        </div>
                      </div>

                      <RatingStars rating={r.rating} size="sm" />
                    </div>

                    <blockquote className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-[#C6A15B] pl-3 py-0.5 leading-relaxed">
                      "{r.review_text}"
                    </blockquote>
                  </div>
                ))}
              </div>
            )}

            {/* Footer actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {(() => {
                  const validLiveUrl = normalizeExternalUrl(selectedProject.live_url);
                  if (!validLiveUrl) return null;
                  return (
                    <a
                      href={validLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-colors shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  );
                })()}
                <a
                  href={`https://wa.me/919944245043?text=${encodeURIComponent(
                    `Hi Harish, I would like to discuss a project similar to ${selectedProject.name} (${selectedProject.category}) for my company.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <span>Chat on WhatsApp</span>
                </a>
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>

              <Link
                to={`/contact?service=${encodeURIComponent(selectedProject.category)}`}
                className="text-xs font-semibold text-[#101B33] hover:text-[#C6A15B] transition-colors"
              >
                Request official proposal &rarr;
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
