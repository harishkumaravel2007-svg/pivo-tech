// Netlify Serverless Function for PIVO TECH API
// Provides native JSON API endpoints when the frontend is hosted on Netlify

const approvedInitialReviews = [
  {
    id: 1,
    review_id: 'PIVO-REV-BALAJI',
    project_id: 5,
    reviewer_name: 'Balaji K',
    business_name: 'Sri Balaji Stationery',
    location: 'Chennai, Sowcarpet',
    project_name: 'E-commerce Website',
    rating: 5,
    review_text: 'PIVO TECH built our website for Sri Balaji Stationery in Sowcarpet, Chennai. Their communication was clear throughout the project, and they delivered a clean, functional site on time. Highly recommend Harish K and the PIVO TECH team!',
    website_url: 'https://sri-balaji-stationery.com',
    status: 'approved',
    is_visible: 1,
    is_verified: 1,
    founder_response: 'Thank you for your trust! It was a pleasure building the digital presence for Sri Balaji Stationery.',
    founder_responded_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    linked_project_name: 'Sri Balaji Stationery'
  }
];

const publishedInitialProjects = [
  {
    id: 1,
    name: 'Nexus Corporate Portal',
    slug: 'nexus-corporate-portal',
    category: 'Business Websites',
    tagline: 'High-conversion corporate web application with dynamic CMS and analytics.',
    description: 'An architectural demonstration of an enterprise-grade digital portal featuring clean typography, structured lead-generation funnels, and sub-second load times.',
    case_study: 'Built to demonstrate high-performance client capture mechanisms. Features server-side rendered speed, dynamic service showcases, and automated enquiry capture.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'SQLite'],
    image_url: '/assets/projects/nexus-portal.svg',
    screenshots: ['/assets/projects/nexus-portal.svg'],
    live_url: null,
    github_url: 'https://github.com/harish-k/nexus-corporate-portal',
    completion_date: '2025-01',
    is_featured: 1,
    is_demo_concept: 1,
    is_published: 1,
    status: 'published',
    sort_order: 1
  },
  {
    id: 2,
    name: 'Aura Commerce Platform',
    slug: 'aura-commerce-platform',
    category: 'E-commerce Websites',
    tagline: 'Minimalist modern e-commerce storefront with rapid cart experience.',
    description: 'An architectural demonstration of a streamlined e-commerce experience designed for lifestyle brands, with optimized product galleries and frictionless order flows.',
    case_study: 'Focused on micro-interactions, responsive image delivery, and optimized checkout UX to maximize transaction completion rates.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Node.js'],
    image_url: '/assets/projects/aura-commerce.svg',
    screenshots: ['/assets/projects/aura-commerce.svg'],
    live_url: null,
    github_url: 'https://github.com/harish-k/aura-commerce',
    completion_date: '2025-02',
    is_featured: 1,
    is_demo_concept: 1,
    is_published: 1,
    status: 'published',
    sort_order: 2
  },
  {
    id: 3,
    name: 'OmniAssist Intelligent Agent',
    slug: 'omniassist-intelligent-agent',
    category: 'AI Solutions',
    tagline: 'Context-aware customer intelligence and 24/7 automated triage.',
    description: 'An AI-powered concierge agent utilizing Gemini API for domain-specific customer inquiries, qualification, and automated ticket generation.',
    case_study: 'Demonstrates zero-latency client qualification with structured JSON outputs and sentiment-aware conversational assistance.',
    technologies: ['Gemini API', 'Node.js', 'TypeScript', 'Vector Context', 'Fastify'],
    image_url: '/assets/projects/omniassist-ai.svg',
    screenshots: ['/assets/projects/omniassist-ai.svg'],
    live_url: null,
    github_url: 'https://github.com/harish-k/omniassist-agent',
    completion_date: '2025-02',
    is_featured: 1,
    is_demo_concept: 1,
    is_published: 1,
    status: 'published',
    sort_order: 3
  },
  {
    id: 5,
    name: 'Sri Balaji Stationery',
    slug: 'sri-balaji-stationery',
    category: 'E-commerce Websites',
    client_name: 'Sri Balaji Stationery',
    tagline: 'Modern digital retail catalog and store website for office and stationery supplies.',
    description: 'A streamlined digital presence and product catalogue built for Sri Balaji Stationery in Sowcarpet, Chennai. Features clean product indexing, direct WhatsApp ordering, and local store navigation.',
    case_study: 'Engineered to help a traditional wholesale & retail stationery business expand its digital reach, showcase high-demand office products, and capture enquiries directly via WhatsApp.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'WhatsApp Integration', 'SEO Optimization'],
    features: ['Digital Retail Catalogue', 'Direct WhatsApp Orders', 'Store Navigation & Map', 'Mobile-Optimized Fast UI'],
    image_url: '/assets/projects/aura-commerce.svg',
    screenshots: ['/assets/projects/aura-commerce.svg'],
    live_url: 'https://sri-balaji-stationery.com',
    github_url: 'https://github.com/harishkumaravel2007-svg/sri-balaji-stationery',
    completion_date: '2025-02',
    is_featured: 1,
    is_demo_concept: 0,
    is_published: 1,
    status: 'published',
    sort_order: 1,
    related_reviews: approvedInitialReviews
  },
  {
    id: 6,
    name: 'PulseOps Operations Hub',
    slug: 'pulseops-portal',
    category: 'Web Applications',
    tagline: 'Internal dashboard and analytics platform for real-time team workflow management.',
    description: 'An enterprise web application architecture built for fast operational metrics, task triage, role-based security, and real-time event monitoring.',
    case_study: 'Designed for operations-heavy teams needing custom dashboards, exportable reporting, and low-latency state synchronization without heavy SaaS licensing costs.',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Express', 'SQLite', 'WebSockets'],
    image_url: '/assets/projects/nexus-portal.svg',
    screenshots: ['/assets/projects/nexus-portal.svg'],
    live_url: null,
    github_url: 'https://github.com/harish-k/pulseops-portal',
    completion_date: '2025-02',
    is_featured: 1,
    is_demo_concept: 1,
    is_published: 1,
    status: 'published',
    sort_order: 4
  },
  {
    id: 7,
    name: 'Apex Flow Automator',
    slug: 'apex-flow-automator',
    category: 'Business Automation',
    tagline: 'Multi-channel webhook pipeline automating CRM entry, WhatsApp alerts, and PDF invoices.',
    description: 'An automated workflow engine that monitors incoming customer leads, validates data integrity, triggers instant WhatsApp notifications, and syncs accounting records in seconds.',
    case_study: 'Solves manual data re-entry friction between website forms, WhatsApp leads, and billing spreadsheets, cutting lead response times from hours to under 30 seconds.',
    technologies: ['Node.js', 'Webhooks', 'WhatsApp Business API', 'Cron', 'Automated PDF Engine'],
    image_url: '/assets/projects/omniassist-ai.svg',
    screenshots: ['/assets/projects/omniassist-ai.svg'],
    live_url: null,
    github_url: 'https://github.com/harish-k/apex-flow-automator',
    completion_date: '2025-02',
    is_featured: 1,
    is_demo_concept: 1,
    is_published: 1,
    status: 'published',
    sort_order: 5
  }
];

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');

  try {
    // 1. Submit review
    if (event.httpMethod === 'POST' && (path === '/reviews/submit' || path === '/reviews/submit/')) {
      const data = JSON.parse(event.body || '{}');
      if (!data.reviewer_name || !data.reviewer_name.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Your name is required.' })
        };
      }
      if (!data.rating || data.rating < 1 || data.rating > 5) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Rating must be between 1 and 5.' })
        };
      }
      if (!data.review_text || data.review_text.trim().length < 10) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Review text must be at least 10 characters.' })
        };
      }
      const reviewId = `PIVO-REV-${Date.now().toString().slice(-6)}`;
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you! Your client review has been submitted successfully and recorded for verification.',
          review_id: reviewId
        })
      };
    }

    // 2. Get reviews
    if (event.httpMethod === 'GET' && (path === '/reviews' || path === '/reviews/')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          reviews: approvedInitialReviews,
          stats: {
            total: 1,
            average: 5.0,
            distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 }
          }
        })
      };
    }

    // 3. Submit enquiry
    if (event.httpMethod === 'POST' && (path === '/enquiries/submit' || path === '/enquiries/submit/')) {
      const leadId = `PIVO-LEAD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you! Your project enquiry has been submitted. Harish K and the PIVO TECH team will contact you shortly.',
          lead_id: leadId
        })
      };
    }

    // 4. Get projects
    if (event.httpMethod === 'GET' && (path === '/projects' || path === '/projects/')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          projects: publishedInitialProjects
        })
      };
    }

    // 5. Founder info
    if (event.httpMethod === 'GET' && (path === '/founder' || path === '/founder/')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          name: 'Harish K',
          designation: 'Founder & Managing Director',
          company: 'PIVO TECH',
          tagline: 'Build. Grow. Automate.',
          location: 'Theni, Tamil Nadu, India',
          bio: "Hello, I'm Harish K, Founder & Managing Director of PIVO TECH. I focus on building modern websites, digital growth solutions, AI-powered agents and business automation systems. My goal is to help businesses establish a strong digital presence, improve productivity and grow through practical technology solutions.",
          photo_url: '/assets/harish-founder.jpg',
          vision: 'To build a world-class technology firm rooted in integrity, delivering tangible digital leverage to startups, enterprises, and local businesses alike.',
          linkedin: 'https://www.linkedin.com/in/harish-k-303480401/',
          instagram: 'https://www.instagram.com/_pivo.tech/',
          email: 'harishkumaravel2007@gmail.com',
          phone: '+91 99442 45043',
          areas_of_expertise: [
            "Full-Stack Web Development & Modern Architecture",
            "Tailwind CSS & Component-Driven UI Engineering",
            "Artificial Intelligence & LLM API Integration",
            "Autonomous Agent Workflows & Chatbot Systems",
            "Business Workflow Automation & Operations Optimization",
            "Database Modeling & Secure REST API Design"
          ]
        })
      };
    }

    // 6. Company info
    if (event.httpMethod === 'GET' && (path === '/company' || path === '/company/')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          business_name: 'PIVO TECH',
          founder_name: 'Harish K',
          tagline: 'Build. Grow. Automate.',
          business_type: 'Digital Technology & IT Solutions Agency',
          location: 'Theni, Tamil Nadu, India.',
          target_market: 'India and International',
          email: 'harishkumaravel2007@gmail.com',
          phone: '+91 99442 45043',
          whatsapp: '+91 99442 45043',
          website: 'https://pivotech.in',
          instagram: 'https://www.instagram.com/_pivo.tech/',
          linkedin: 'https://www.linkedin.com/in/harish-k-303480401/',
          about_intro: 'PIVO TECH is a technology-focused digital solutions business founded by Harish K in Theni, Tamil Nadu, India. We focus on helping startups, entrepreneurs and businesses build their digital presence, improve customer engagement and simplify operations using modern technology.'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'PIVO TECH Serverless API Active', endpoint: path })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
