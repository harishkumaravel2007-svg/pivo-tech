/**
 * PIVO TECH - Safe External Link & URL Normalization Utility
 * Validates external domains, prevents self-referential / relative routing bugs,
 * and normalizes URLs to safe HTTPS.
 */

export function normalizeExternalUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === '#' || trimmed === '/') return null;

  // Reject dangerous pseudo-protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return null;
  }

  // Filter out internal / self-referential links that would loop to PIVO TECH domain or current origin
  if (
    lower.includes('pivotech.in/portfolio') ||
    lower.includes('pivotech07.netlify.app/portfolio') ||
    lower.startsWith('/portfolio') ||
    lower.startsWith('portfolio/')
  ) {
    return null;
  }

  // Prepend https:// if protocol is missing
  let target = trimmed;
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  try {
    const parsed = new URL(target);
    // Must be http or https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    const hostname = parsed.hostname.toLowerCase();
    // Hostname must contain at least one period and valid domain format
    if (!hostname || !hostname.includes('.') || hostname.endsWith('.')) {
      return null;
    }

    // Filter out malformed duplicated prefixes like 'sri-balaji-stationery.httpssri-balaji-stationeryworkers'
    if (hostname.includes('http:') || hostname.includes('https:') || hostname.includes('//')) {
      return null;
    }

    // Reject localhost / loopback in production external links
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return null;
    }

    // Verify valid top-level domain extension (at least 2 letters)
    const parts = hostname.split('.');
    const tld = parts[parts.length - 1];
    if (!tld || tld.length < 2 || !/^[a-z0-9-]+$/i.test(tld)) {
      return null;
    }

    return parsed.toString();
  } catch (err) {
    return null;
  }
}

export function isValidExternalUrl(rawUrl?: string | null): boolean {
  return normalizeExternalUrl(rawUrl) !== null;
}
