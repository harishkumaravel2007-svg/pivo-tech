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

export const api = {
  // Company Info
  getCompany: async (): Promise<CompanyInfo> => {
    const res = await fetch(`${API_BASE}/company`);
    if (!res.ok) throw new Error('Failed to fetch company information');
    return res.json();
  },
  updateCompany: async (data: Partial<CompanyInfo>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/company`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update company information');
    }
    return res.json();
  },

  // Founder Info
  getFounder: async (): Promise<FounderInfo> => {
    const res = await fetch(`${API_BASE}/founder`);
    if (!res.ok) throw new Error('Failed to fetch founder profile');
    return res.json();
  },
  updateFounder: async (data: Partial<FounderInfo>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/founder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update founder profile');
    }
    return res.json();
  },

  // Services
  getServices: async (): Promise<{ services: Service[] }> => {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },
  getAllServicesAdmin: async (): Promise<{ services: Service[] }> => {
    const res = await fetch(`${API_BASE}/services/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch all services');
    return res.json();
  },
  createService: async (service: Partial<Service>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create service');
    }
    return res.json();
  },
  updateService: async (id: number, service: Partial<Service>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update service');
    }
    return res.json();
  },
  deleteService: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // Skills
  getSkills: async (): Promise<{ skills: Skill[] }> => {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },
  getAllSkillsAdmin: async (): Promise<{ skills: Skill[] }> => {
    const res = await fetch(`${API_BASE}/skills/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },
  createSkill: async (skill: Partial<Skill>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create skill');
    }
    return res.json();
  },
  updateSkill: async (id: number, skill: Partial<Skill>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
  },
  deleteSkill: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete skill');
    return res.json();
  },

  // Projects
  getProjects: async (category?: string): Promise<{ projects: Project[] }> => {
    const url = category && category !== 'All'
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },
  getProject: async (idOrSlug: string | number): Promise<{ project: Project }> => {
    const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
    if (!res.ok) throw new Error('Failed to fetch project details');
    return res.json();
  },
  createProject: async (project: Partial<Project>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create project');
    }
    return res.json();
  },
  updateProject: async (id: number, project: Partial<Project>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update project');
    }
    return res.json();
  },
  deleteProject: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Achievements
  getAchievements: async (): Promise<{ achievements: Achievement[] }> => {
    const res = await fetch(`${API_BASE}/achievements`);
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  },
  createAchievement: async (achievement: Partial<Achievement>): Promise<{ message: string; id: number }> => {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(achievement)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create achievement');
    }
    return res.json();
  },
  updateAchievement: async (id: number, achievement: Partial<Achievement>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(achievement)
    });
    if (!res.ok) throw new Error('Failed to update achievement');
    return res.json();
  },
  deleteAchievement: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete achievement');
    return res.json();
  },

  // Reviews & Client Showcase
  getReviews: async (): Promise<{ reviews: Review[]; stats: ReviewStats }> => {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
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
  }): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/reviews/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit review');
    }
    return data;
  },
  getAdminReviews: async (): Promise<{
    reviews: Review[];
    summary: { total: number; pending: number; approved: number; rejected: number; average: number };
  }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reviews for admin');
    return res.json();
  },
  adminAddClientReview: async (reviewData: Partial<Review>): Promise<{ message: string; review: Review }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add client review');
    return data;
  },
  adminUpdateClientReview: async (id: number, reviewData: Partial<Review>): Promise<{ message: string; review: Review }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update client review');
    return data;
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
    if (!res.ok) throw new Error('Failed to update review status');
    return res.json();
  },
  adminSetFounderResponse: async (id: number, founder_response: string | null): Promise<{ message: string; founder_response: string | null; founder_responded_at: string | null }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}/founder-response`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ founder_response })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update founder response');
    return data;
  },
  deleteReview: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/reviews/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },

  // Enquiries
  submitEnquiry: async (enquiryData: {
    full_name: string;
    email: string;
    phone: string;
    business_name?: string;
    service_required: string;
    project_budget?: string;
    message: string;
    honeypot?: string;
    captcha_answer?: number;
    captcha_expected?: number;
  }): Promise<{ message: string; enquiryId: number }> => {
    const res = await fetch(`${API_BASE}/enquiries/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit enquiry');
    }
    return data;
  },
  getAdminEnquiries: async (): Promise<{
    enquiries: Enquiry[];
    summary: { total: number; new: number; in_discussion: number; closed: number };
  }> => {
    const res = await fetch(`${API_BASE}/enquiries/admin/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },
  updateEnquiryStatus: async (
    id: number,
    data: { status?: 'new' | 'in_discussion' | 'closed'; notes?: string }
  ): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/enquiries/admin/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return res.json();
  },
  deleteEnquiry: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/enquiries/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
    return res.json();
  },

  // Settings
  getSettings: async (): Promise<{ settings: Record<string, string> }> => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch website settings');
    return res.json();
  },
  updateSettings: async (settings: Record<string, string>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update website settings');
    return res.json();
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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload file');
    }
    return data;
  },

  // Auth & Security
  getSetupStatus: async (): Promise<{ isSetup: boolean }> => {
    const res = await fetch(`${API_BASE}/auth/setup-status`);
    if (!res.ok) throw new Error('Failed to check setup status');
    return res.json();
  },
  setupAdmin: async (adminData: { username: string; password: string; email: string }): Promise<{ token: string; user: AdminUser; message: string }> => {
    const res = await fetch(`${API_BASE}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to complete setup');
    }
    return data;
  },
  login: async (username: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },
  getCurrentUser: async (): Promise<{ user: AdminUser }> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to change password');
    }
    return data;
  }
};
