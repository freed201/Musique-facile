// src/utils/security.ts

export const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' 
        https://www.googletagmanager.com 
        https://www.google-analytics.com 
        https://player.vimeo.com 
        https://f.vimeocdn.com 
        https://freed201.activehosted.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: 
        https://i.ytimg.com 
        https://img.youtube.com 
        https://www.google-analytics.com;
      font-src 'self' https://fonts.gstatic.com;
      frame-src 'self' 
        https://www.youtube.com 
        https://youtube.com 
        https://player.vimeo.com 
        https://www.google.com 
        https://freed201.activehosted.com;
      connect-src 'self' 
        https://www.google-analytics.com 
        https://stats.g.doubleclick.net;
      media-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim(),
  
    // Autres headers de sécurité
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
  
  // Fonction pour ajouter SRI aux ressources externes
  export function addSRI(url: string, hash: string) {
    return {
      url,
      integrity: `sha384-${hash}`,
      crossorigin: 'anonymous'
    };
  }
  
  // Liste des ressources externes avec SRI
  export const externalResources = {
    styles: [
      addSRI(
        'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
        'hash_value_here'
      ),
    ],
    scripts: [
      addSRI(
        'https://player.vimeo.com/api/player.js',
        'hash_value_here'
      ),
    ]
  };
  