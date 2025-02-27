// src/middleware/security.ts
import type { MiddlewareHandler } from 'astro';
import { securityHeaders } from '../utils/security';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  // Ajouter les headers de sécurité
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};
