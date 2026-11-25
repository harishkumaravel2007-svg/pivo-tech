export interface CompanyInfo {
  id?: number;
  business_name: string;
  founder_name: string;
  tagline: string;
  business_type: string;
  location: string;
  target_market: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  instagram: string;
  linkedin: string;
  about_intro: string;
  mission: string;
  vision: string;
  values: Array<{ title: string; desc: string }>;
  updated_at?: string;
}

export interface FounderInfo {
  id?: number;
  name: string;
  designation: string;
  company: string;
  tagline?: string;
  location: string;
  bio: string;
  photo_url?: string;
  vision: string;
  linkedin: string;
  instagram?: string;
  email: string;
  phone: string;
  areas_of_expertise: string[];
  updated_at?: string;
}

export interface ServiceImage {
  id: string;
  title: string;
  caption: string;
  url: string;
  badge?: string;
}

export interface Service {
  id: number;
  slug: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  benefits: string[];
  images?: ServiceImage[];
  icon_name: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
}

export interface Skill {
  id: number;
  category: string;
  name: string;
  level_description: string;
  icon_name: string;
  sort_order: number;
  is_active: number;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  case_study: string;
  technologies: string[];
  image_url: string;
  screenshots: string[];
  live_url?: string;
  github_url?: string;
  completion_date?: string;
  is_featured: number;
  is_demo_concept: number;
  sort_order: number;
  created_at?: string;
}

export interface Achievement {
  id: number;
  title: string;
  category: string;
  description: string;
  issuer_or_organization?: string;
  date_awarded?: string;
  document_url?: string;
  sort_order: number;
  created_at?: string;
}

export interface Review {
  id: number;
  reviewer_name: string;
  business_name?: string;
  business_logo_url?: string;
  location?: string;
  project_name?: string;
  project_description?: string;
  rating: number;
  review_text: string;
  website_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_visible?: number;
  is_verified: number;
  founder_response?: string;
  founder_responded_at?: string;
  approved_at?: string;
  created_by?: 'client' | 'founder';
  created_at: string;
  updated_at?: string;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Enquiry {
  id: number;
  lead_id?: string;
  full_name: string;
  email: string;
  phone: string;
  business_name?: string;
  city?: string;
  country?: string;
  service_required: string;
  project_budget?: string;
  preferred_contact?: 'whatsapp' | 'phone' | 'email';
  message: string;
  status: 'new' | 'contacted' | 'discussion' | 'in_discussion' | 'proposal_sent' | 'converted' | 'not_interested' | 'closed';
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
}
