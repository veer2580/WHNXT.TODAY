/**
 * src/worker.js
 * Cloudflare Worker for WHNXT.TODAY
 * Edge routing with static assets binding, clean path normalization,
 * and security headers.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Clean Path Normalization: /about -> /about.html, /contact -> /contact.html
    if (url.pathname === '/about' || url.pathname === '/about/') {
      url.pathname = '/about.html';
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }

    if (url.pathname === '/contact' || url.pathname === '/contact/') {
      url.pathname = '/contact.html';
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }

    // 2. Fetch asset from Cloudflare Assets binding
    let response = await env.ASSETS.fetch(request);

    // 3. Fallback to index.html for extension-less SPA routing if asset missing
    if (response.status === 404 && !url.pathname.includes('.')) {
      url.pathname = '/index.html';
      response = await env.ASSETS.fetch(new Request(url.toString(), request));
    }

    // 4. Inject high-performance edge caching and security headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Immutable caching for hashed assets
    if (url.pathname.startsWith('/assets/')) {
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
