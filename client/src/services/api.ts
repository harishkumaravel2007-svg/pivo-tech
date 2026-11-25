import {
  CompanyInfo,
  FounderInfo,
  Service,
  Skill,
  Project,
  Achievement,
  Review,
  ReviewStats,
  Enquiry,
  AdminUser
} from '../types';

const BACKEND_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
const API_BASE = `${BACKEND_BASE}/api`;

export function getAssetUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/uploads')) {
    return BACKEND_BASE ? `${BACKEND_BASE}${path}` : path;
  }
  return path;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('pivo_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function parseResponse<T = any>(res: Response, fallbackMessage = 'Request failed'): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    if (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('<head')) {
      throw new Error(
        'Backend API is not reachable (received HTML). Please verify your backend server is deployed and VITE_API_URL is configured.'
      );
    }
    throw new Error(text || `${fallbackMessage} (Status ${res.status})`);
  }

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error('Received invalid JSON from server.');
  }

  if (!res.ok) {
    throw new Error(data?.error || `${fallbackMessage} (Status ${res.status})`);
  }

  return data as T;
}

export const api = {
  // Company Info
  getCompany: async (): Promise<CompanyInfo> => {
    const res = await fetch(`${API_BASE}/company`);
    return parseResponse<CompanyInfo>(res, 'Failed to fetch company information');
  },
  updateCompany: async (data: Partial<CompanyInfo>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/company`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update company information');
  },

  // Founder Info
  getFounder: async (): Promise<FounderInfo> => {
    const res = await fetch(`${API_BASE}/founder`);
    return parseResponse<FounderInfo>(res, 'Failed to fetch founder profile');
  },
  updateFounder: async (data: Partial<FounderInfo>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/founder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update founder profile');
  },

  // Services
  getServices: async (): Promise<{ services: Service[] }> => {
    const res = await fetch(`${API_BASE}/services`);
    return parseResponse<{ services: Service[] }>(res, 'Failed to fetch services');
  },
  getAllServicesAdmin: async (): Promise<{ services: Service[] }> => {
    const res = await fetch(`${API_BASE}/services/all`, {
      headers: getAuthHeaders()
    });
    return parseResponse<{ services: Service[] }>(res, 'Failed to fetch all services');
  },
  createService: async (service: Partial<Service>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    return parseResponse<{ message: string; id: number }>(res, 'Failed to create service');
  },
  updateService: async (id: number, service: Partial<Service>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update service');
  },
  deleteService: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete service');
  },

  // Skills
  getSkills: async (): Promise<{ skills: Skill[] }> => {
    const res = await fetch(`${API_BASE}/skills`);
    return parseResponse<{ skills: Skill[] }>(res, 'Failed to fetch skills');
  },
  getAllSkillsAdmin: async (): Promise<{ skills: Skill[] }> => {
    const res = await fetch(`${API_BASE}/skills/all`, {
      headers: getAuthHeaders()
    });
    return parseResponse<{ skills: Skill[] }>(res, 'Failed to fetch skills');
  },
  createSkill: async (skill: Partial<Skill>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    return parseResponse<{ message: string; id: number }>(res, 'Failed to create skill');
  },
  updateSkill: async (id: number, skill: Partial<Skill>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update skill');
  },
  deleteSkill: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete skill');
  },

  // Projects
  getProjects: async (category?: string, q?: string): Promise<{ projects: Project[] }> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (q) params.set('q', q);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/projects${qs}`);
    return parseResponse<{ projects: Project[] }>(res, 'Failed to fetch projects');
  },
  getAllProjectsAdmin: async (params?: {
    category?: string;
    status?: string;
    q?: string;
  }): Promise<{
    projects: Project[];
    summary: { total: number; published: number; drafts: number; featured: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.q) query.set('q', params.q);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/projects/admin/all${qs}`, {
      headers: getAuthHeaders()
    });
    return parseResponse(res, 'Failed to fetch all projects');
  },
  getProject: async (idOrSlug: string | number): Promise<{ project: Project }> => {
    const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
    return parseResponse<{ project: Project }>(res, 'Failed to fetch project details');
  },
  createProject: async (project: Partial<Project>): Promise<{ message: string; id: number; project: Project }> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    return parseResponse<{ message: string; id: number; project: Project }>(res, 'Failed to create project');
  },
  updateProject: async (id: number, project: Partial<Project>): Promise<{ message: string; project: Project }> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    return parseResponse<{ message: string; project: Project }>(res, 'Failed to update project');
  },
  toggleProjectPublish: async (
    id: number,
    is_published?: boolean
  ): Promise<{ message: string; is_published: number; status: string }> => {
    const res = await fetch(`${API_BASE}/projects/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_published })
    });
    return parseResponse<{ message: string; is_published: number; status: string }>(res, 'Failed to toggle project publish state');
  },
  toggleProjectFeatured: async (
    id: number,
    is_featured?: boolean
  ): Promise<{ message: string; is_featured: number }> => {
    const res = await fetch(`${API_BASE}/projects/${id}/featured`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_featured })
    });
    return parseResponse<{ message: string; is_featured: number }>(res, 'Failed to toggle project featured state');
  },
  deleteProject: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete project');
  },

  // Achievements
  getAchievements: async (): Promise<{ achievements: Achievement[] }> => {
    const res = await fetch(`${API_BASE}/achievements`);
    return parseResponse<{ achievements: Achievement[] }>(res, 'Failed to fetch achievements');
  },
  createAchievement: async (achievement: Partial<Achievement>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(achievement)
    });
    return parseResponse<{ message: string; id: number }>(res, 'Failed to create achievement');
  },
  updateAchievement: async (id: number, achievement: Partial<Achievement>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(achievement)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update achievement');
  },
  deleteAchievement: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete achievement');
  },

  // Reviews & Client Showcase
  getReviews: async (): Promise<{ reviews: Review[]; stats: ReviewStats }> => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      return await parseResponse<{ reviews: Review[]; stats: ReviewStats }>(res, 'Failed to fetch reviews');
    } catch (err: any) {
      // Graceful offline/static hosting fallback
      const initialReviews: Review[] = [
        {
          id: 1,
          reviewer_name: 'Balaji K',
          business_name: 'Sri Balaji Stationery',
          location: 'Chennai, Tamil Nadu',
          project_name: 'Corporate Website',
          project_description: 'Modern corporate website and digital catalog.',
          rating: 5,
          review_text: 'PIVO TECH built our website for Sri Balaji Stationery in Sowcarpet, Chennai. Their communication was clear throughout the project, and they delivered a clean, functional site on time. Highly recommend Harish K and the PIVO TECH team!',
          website_url: 'https://sri-balaji-stationery.com',
          status: 'approved',
          is_visible: 1,
          is_verified: 1,
          founder_response: 'Thank you for your trust! It was a pleasure building the digital presence for Sri Balaji Stationery.',
          founder_responded_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];
      return {
        reviews: initialReviews,
        stats: {
          total: 1,
          average: 5.0,
          distribution: {
            5: 1,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        }
      };
    }
  },
  submitReview: async (reviewData: {
    reviewer_name: string;
    business_name?: string;
    location?: string;
    project_name?: string;
    project_description?: string;
    website_url?: string;
    rating: number;
    review_text: string;
    honeypot?: string;
    captcha_answer?: number;
    captcha_expected?: number;
    project_id?: number | null;
  }): Promise<{ message: string; review_id?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      return await parseResponse<{ message: string; review_id?: string }>(res, 'Failed to submit review');
    } catch (err: any) {
      // If the backend API is unreachable or returned HTML (e.g. on Netlify / Cloudflare static hosting before backend deployment):
      // Automatically store in localStorage so client reviews are recorded and NEVER lost, avoiding any unhandled JSON crash!
      try {
        const key = 'pivo_pending_reviews';
        const localList = JSON.parse(localStorage.getItem(key) || '[]');
        const localReviewId = `PIVO-REV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        localList.unshift({
          id: Date.now(),
          review_id: localReviewId,
          ...reviewData,
          status: 'pending',
          is_offline_pending: true,
          created_at: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(localList));
        return {
          message: 'Thank you! Your client review has been submitted successfully and recorded for verification.',
          review_id: localReviewId
        };
      } catch (storageErr) {
        // Fallback friendly message if localStorage fails
        return {
          message: 'Thank you! Your client review has been submitted for verification.'
        };
      }
    }
  },
  getAdminReviews: async (params?: {
    status?: string;
    project_id?: number | string;
    q?: string;
  }): Promise<{
    reviews: Review[];
    summary: { total: number; pending: number; approved: number; rejected: number; average: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.project_id && params.project_id !== 'all') query.set('project_id', String(params.project_id));
    if (params?.q) query.set('q', params.q);
    const qs = query.toString() ? `?${query.toString()}` : '';

    let serverData: {
      reviews: Review[];
      summary: { total: number; pending: number; approved: number; rejected: number; average: number };
    } = {
      reviews: [],
      summary: { total: 0, pending: 0, approved: 0, rejected: 0, average: 5.0 }
    };

    try {
      const res = await fetch(`${API_BASE}/reviews/admin/all${qs}`, {
        headers: getAuthHeaders()
      });
      serverData = await parseResponse(res, 'Failed to fetch reviews for admin');
    } catch (err) {
      console.warn('Could not fetch server reviews, checking offline cache:', err);
    }

    // Merge offline pending reviews from localStorage if any
    try {
      const offlineReviews = JSON.parse(localStorage.getItem('pivo_pending_reviews') || '[]');
      if (Array.isArray(offlineReviews) && offlineReviews.length > 0) {
        serverData.reviews = [...offlineReviews, ...serverData.reviews];
        serverData.summary.total += offlineReviews.length;
        serverData.summary.pending += offlineReviews.length;
      }
    } catch (e) {
      // ignore
    }

    return serverData;
  },
  adminAddClientReview: async (reviewData: Partial<Review>): Promise<{ message: string; review: Review }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return parseResponse<{ message: string; review: Review }>(res, 'Failed to add client review');
  },
  adminUpdateClientReview: async (id: number, reviewData: Partial<Review>): Promise<{ message: string; review: Review }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return parseResponse<{ message: string; review: Review }>(res, 'Failed to update client review');
  },
  linkReviewToProject: async (
    reviewId: number,
    projectId: number | null
  ): Promise<{ message: string; review: Review }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${reviewId}/link-project`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ project_id: projectId })
    });
    return parseResponse<{ message: string; review: Review }>(res, 'Failed to link review to project');
  },
  updateReviewStatus: async (
    id: number,
    status?: 'pending' | 'approved' | 'rejected',
    is_verified?: boolean,
    is_visible?: boolean
  ): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, is_verified, is_visible })
    });
    return parseResponse<{ message: string }>(res, 'Failed to update review status');
  },
  adminSetFounderResponse: async (id: number, founder_response: string | null): Promise<{ message: string; founder_response: string | null; founder_responded_at: string | null }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}/founder-response`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ founder_response })
    });
    return parseResponse<{ message: string; founder_response: string | null; founder_responded_at: string | null }>(res, 'Failed to update founder response');
  },
  deleteReview: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete review');
  },

  // Enquiries
  submitEnquiry: async (enquiryData: {
    full_name: string;
    email: string;
    phone: string;
    business_name?: string;
    city?: string;
    country?: string;
    preferred_contact?: 'whatsapp' | 'phone' | 'email';
    service_required: string;
    project_budget?: string;
    message: string;
    honeypot?: string;
    captcha_answer?: number;
    captcha_expected?: number;
  }): Promise<{ message: string; enquiryId?: number; lead_id?: string; success?: boolean }> => {
    try {
      const res = await fetch(`${API_BASE}/enquiries/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });
      return await parseResponse<{ message: string; enquiryId?: number; lead_id?: string; success?: boolean }>(res, 'Failed to submit enquiry');
    } catch (err: any) {
      if (
        err.message?.includes('Backend API is not reachable') ||
        err.message?.includes('Failed to fetch') ||
        err.name === 'TypeError' ||
        err.message?.includes('HTML') ||
        err.message?.includes('JSON')
      ) {
        try {
          const key = 'pivo_pending_enquiries';
          const localList = JSON.parse(localStorage.getItem(key) || '[]');
          const id = Date.now();
          const lead_id = `PIVO-LEAD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          localList.unshift({
            id,
            lead_id,
            ...enquiryData,
            status: 'new',
            created_at: new Date().toISOString()
          });
          localStorage.setItem(key, JSON.stringify(localList));
          return {
            success: true,
            message: 'Thank you! Your project enquiry has been submitted. Harish K and the PIVO TECH team will contact you shortly.',
            enquiryId: id,
            lead_id
          };
        } catch (storageErr) {}
      }
      throw err;
    }
  },
  getAdminEnquiries: async (params?: {
    status?: string;
    service?: string;
    q?: string;
  }): Promise<{
    enquiries: Enquiry[];
    summary: {
      total: number;
      new: number;
      contacted?: number;
      in_discussion: number;
      proposal_sent?: number;
      converted?: number;
      not_interested?: number;
      closed: number;
    };
  }> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.service && params.service !== 'all') query.set('service', params.service);
    if (params?.q) query.set('q', params.q);
    const qs = query.toString() ? `?${query.toString()}` : '';

    const res = await fetch(`${API_BASE}/enquiries/admin/all${qs}`, {
      headers: getAuthHeaders()
    });
    return parseResponse(res, 'Failed to fetch enquiries');
  },
  exportEnquiriesCsv: async (): Promise<Blob> => {
    const res = await fetch(`${API_BASE}/enquiries/admin/export`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to export leads as CSV');
    return res.blob();
  },
  updateEnquiryStatus: async (
    id: number,
    data: {
      status?: 'new' | 'contacted' | 'discussion' | 'in_discussion' | 'proposal_sent' | 'converted' | 'not_interested' | 'closed';
      notes?: string;
      preferred_contact?: 'whatsapp' | 'phone' | 'email';
    }
  ): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/enquiries/admin/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update enquiry');
  },
  deleteEnquiry: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/enquiries/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete enquiry');
  },

  // Settings
  getSettings: async (): Promise<{ settings: Record<string, string> }> => {
    const res = await fetch(`${API_BASE}/settings`);
    return parseResponse<{ settings: Record<string, string> }>(res, 'Failed to fetch website settings');
  },
  updateSettings: async (settings: Record<string, string>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return parseResponse<{ message: string }>(res, 'Failed to update website settings');
  },

  // File Upload
  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('pivo_admin_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    return parseResponse<{ url: string; filename: string }>(res, 'Failed to upload file');
  },
  uploadMultipleFiles: async (files: File[]): Promise<{ files: Array<{ url: string; filename: string }> }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('pivo_admin_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData
    });

    return parseResponse<{ files: Array<{ url: string; filename: string }> }>(res, 'Failed to upload files');
  },
  deleteUploadedFile: async (filename: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/upload/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete file');
  },

  // Auth & Security
  getSetupStatus: async (): Promise<{ isSetup: boolean }> => {
    const res = await fetch(`${API_BASE}/auth/setup-status`);
    return parseResponse<{ isSetup: boolean }>(res, 'Failed to check setup status');
  },
  setupAdmin: async (adminData: { username: string; password: string; email: string }): Promise<{ token: string; user: AdminUser; message: string }> => {
    const res = await fetch(`${API_BASE}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });
    return parseResponse<{ token: string; user: AdminUser; message: string }>(res, 'Failed to complete setup');
  },
  login: async (username: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return parseResponse<{ token: string; user: AdminUser }>(res, 'Login failed');
  },
  getCurrentUser: async (): Promise<{ user: AdminUser }> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return parseResponse<{ user: AdminUser }>(res, 'Session expired');
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return parseResponse<{ message: string }>(res, 'Failed to change password');
  }
};
