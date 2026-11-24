import React, { useEffect, useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Globe,
  Building2,
  MapPin,
  Briefcase,
  UserCheck,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Review, ReviewStats } from '../types';
import { RatingStars } from '../components/RatingStars';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State for Client Submission
  const [reviewerName, setReviewerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Math Challenge
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // Status State
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setNum1(a);
    setNum2(b);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await api.getReviews();
      setReviews(res.reviews);
      setStats(res.stats);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!reviewerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setErrorMessage('Please write a genuine review with at least 10 characters.');
      return;
    }

    if (Number(captchaAnswer) !== num1 + num2) {
      setErrorMessage(`Security verification incorrect. What is ${num1} + ${num2}?`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReview({
        reviewer_name: reviewerName.trim(),
        business_name: businessName.trim() || undefined,
        location: location.trim() || undefined,
        project_name: projectName.trim() || undefined,
        project_description: projectDescription.trim() || undefined,
        website_url: websiteUrl.trim() || undefined,
        rating,
        review_text: reviewText.trim(),
        honeypot,
        captcha_answer: Number(captchaAnswer),
        captcha_expected: num1 + num2
      });

      setSuccessMessage(res.message);
      setReviewerName('');
      setBusinessName('');
      setLocation('');
      setProjectName('');
      setProjectDescription('');
      setWebsiteUrl('');
      setRating(5);
      setReviewText('');
      generateCaptcha();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit review. Please try again.');
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
              Verified Client Showcase &amp; Testimonials
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 text-white">
              Client Showcase &amp; Reviews
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
              Explore real feedback, client projects, and verified digital solutions delivered by PIVO TECH. Genuine testimonials with live website verification.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Authenticity Guarantee Callout */}
        <div className="mb-12 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-slate-100 text-[#101B33] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <div className="text-sm">
            <h3 className="font-bold text-[#101B33] mb-1">Authenticity &amp; Transparent Moderation Guarantee</h3>
            <p className="text-slate-600 leading-relaxed">
              PIVO TECH adheres to strict standards of transparency: no fabricated testimonials, no fake metrics, and no simulated ratings. All submitted client reviews undergo thorough moderation before appearing publicly. When provided, client websites are verified and linked directly for full authenticity.
            </p>
          </div>
        </div>

        {/* Aggregate Ratings Overview */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Score Box */}
            <div className="lg:col-span-4 text-center lg:border-r lg:border-slate-100 lg:pr-8">
              <span className="text-5xl sm:text-6xl font-extrabold text-[#101B33]">
                {stats && stats.total > 0 ? stats.average.toFixed(1) : '5.0'}
              </span>
              <div className="flex justify-center my-3">
                <RatingStars
                  rating={stats && stats.total > 0 ? stats.average : 5}
                  size="lg"
                />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {stats && stats.total > 0
                  ? `Based on ${stats.total} verified ${stats.total === 1 ? 'client engagement' : 'client engagements'}`
                  : 'Verified Review Moderation Active'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Standardized 1 to 5 Star Rating System
              </p>
            </div>

            {/* Right Distribution Breakdown */}
            <div className="lg:col-span-8 space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats?.distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                const percentage = stats && stats.total > 0
                  ? Math.round((count / stats.total) * 100)
                  : 0;

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-semibold text-slate-700 flex items-center gap-1">
                      <span>{stars}</span>
                      <Star className="w-3.5 h-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C6A15B] to-[#D4AF37] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-medium text-slate-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two Column Layout: Client Showcase Cards (Left) + Submission Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Client Showcase List */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#101B33]">
                  Verified Client Showcase
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {reviews.length} published client {reviews.length === 1 ? 'record' : 'records'}
                </p>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header: Client & Business Identity */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                        <div className="flex items-start gap-4">
                          {/* Business Logo or Initial Avatar */}
                          {rev.business_logo_url ? (
                            <img
                              src={rev.business_logo_url}
                              alt={rev.business_name || rev.reviewer_name}
                              className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1.5 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-[#101B33] text-white flex items-center justify-center font-bold text-lg border border-[#1A2846] shrink-0">
                              {(rev.business_name || rev.reviewer_name).substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-[#101B33]">
                                {rev.business_name || rev.reviewer_name}
                              </h3>
                              {rev.is_verified === 1 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <UserCheck className="w-3 h-3 text-emerald-600" />
                                  Verified Client
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-semibold text-slate-600 mt-0.5">
                              Client: {rev.reviewer_name}
                            </p>

                            {rev.location && (
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                                <span>{rev.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex flex-col items-start sm:items-end shrink-0">
                          <RatingStars rating={rev.rating} size="sm" />
                          <span className="text-[11px] font-medium text-slate-400 mt-1">
                            {rev.rating}.0 of 5.0 Stars
                          </span>
                        </div>
                      </div>

                      {/* Project Details Section */}
                      {(rev.project_name || rev.project_description) && (
                        <div className="my-5 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                          {rev.project_name && (
                            <div className="flex items-center gap-2 text-xs font-bold text-[#101B33] mb-1">
                              <Briefcase className="w-3.5 h-3.5 text-[#C6A15B]" />
                              <span>Project: {rev.project_name}</span>
                            </div>
                          )}
                          {rev.project_description && (
                            <p className="text-xs text-slate-600 leading-relaxed pl-5">
                              {rev.project_description}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Client Review Text */}
                      <div className="my-5">
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                          Client Review:
                        </span>
                        <blockquote className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line italic border-l-2 border-[#C6A15B] pl-4 py-1">
                          "{rev.review_text}"
                        </blockquote>
                      </div>

                      {/* Official Founder Response (Harish K) */}
                      {rev.founder_response && (
                        <div className="mt-5 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#101B33]/5 to-slate-50 border border-[#101B33]/15">
                          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#101B33] text-[#C6A15B] flex items-center justify-center font-bold text-[10px]">
                                HK
                              </div>
                              <span className="text-xs font-bold text-[#101B33]">
                                Official Response from Harish K, Founder &amp; CEO
                              </span>
                            </div>
                            {rev.founder_responded_at && (
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.founder_responded_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {rev.founder_response}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: External Website Button & Date */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {rev.website_url ? (
                          <a
                            href={rev.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#101B33] text-white hover:bg-[#1A2846] text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02]"
                          >
                            <Globe className="w-3.5 h-3.5 text-[#C6A15B]" />
                            <span>View Website</span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Private / Internal Enterprise Solution
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-400">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <MessageSquare className="w-12 h-12 text-[#101B33] mx-auto mb-3 opacity-80" />
                <h4 className="text-base font-bold text-[#101B33] mb-1">
                  Be the First to Review PIVO TECH
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Have you partnered with Harish K or engaged PIVO TECH for your website or digital transformation? Submit your verified review using the form.
                </p>
              </div>
            )}
          </div>

          {/* Client Submission Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-premium sticky top-28">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                Client Feedback Portal
              </span>
              <h3 className="text-xl font-bold text-[#101B33] mt-1 mb-2">
                Submit Your Client Review
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                All submissions enter pending status and are verified by the PIVO TECH administration before publication.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from humans) */}
                <input
                  type="text"
                  name="user_anti_spam"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Rating Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Rating (1 to 5 Stars) *
                  </label>
                  <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200 flex items-center justify-between">
                    <RatingStars
                      rating={rating}
                      size="lg"
                      interactive={true}
                      onRatingChange={(newVal) => setRating(newVal)}
                    />
                    <span className="text-xs font-bold text-[#101B33]">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Client Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Ramesh Krishnan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Skyline Logistics India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location (City, Country)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Corporate Website Redesign & SEO"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>

                {/* Client Website URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Website URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="e.g. https://skyline-logistics.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                  <span className="text-[10px] text-slate-400">
                    Safe external link displayed with verified "View Website" button.
                  </span>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Written Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your project, communication quality, and results delivered by PIVO TECH..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                  <span className="text-[10px] text-slate-400">
                    Minimum 10 characters required. Genuine feedback only.
                  </span>
                </div>

                {/* Math Security Challenge */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Security Verification: What is {num1} + {num2}? *
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] disabled:opacity-60 transition-colors shadow-sm active:scale-95"
                >
                  {submitting ? 'Submitting for Verification...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
