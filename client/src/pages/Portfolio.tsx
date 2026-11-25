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
  FolderGit2
} from 'lucide-react';
import { api, getAssetUrl } from '../services/api';
import { Project } from '../types';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Business Websites',
    'E-commerce',
    'AI Solutions',
    'Web Applications',
    'Automation Systems'
  ];

  useEffect(() => {
    api.getProjects()
      .then(res => setProjects(res.projects))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
                  ) : null}
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
                    ) : null}

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

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#101B33] hover:text-[#C6A15B] transition-colors"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#C6A15B] hover:bg-slate-100 transition-colors"
                          title="Live Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
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
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#101B33]">
              <img
                src={getAssetUrl(selectedProject.image_url)}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#C6A15B]">
                {selectedProject.category}
              </span>
              {selectedProject.is_demo_concept ? (
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  Concept Demonstration (Not A Client Project)
                </span>
              ) : null}
            </div>

            {selectedProject.is_demo_concept ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Demonstration Concept:</strong> This project is an architectural and UX demonstration engineered by PIVO TECH to demonstrate technical capabilities, performance standards, and interface design. It is not an active commercial client engagement.
                </div>
              </div>
            ) : null}

            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
                Project Overview
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

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

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-colors"
                  >
                    <span>Visit Live Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
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
                Commission a similar project &rarr;
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
