/**
 * main.js
 * Logic for WHNXT.TODAY Home Page (/)
 */

import { SpaceScene } from './scene/SpaceScene.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Procedural WebGL Space Scene
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    new SpaceScene(canvas);
  }

  // 2. Interactive 3D Parallax Tilt on Hero Logo Typography
  const heroTitle = document.getElementById('whnxt-hero-title');
  if (heroTitle) {
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetTiltX = (e.clientX - cx) / cx;
      targetTiltY = (e.clientY - cy) / cy;
    });

    const updateTilt = () => {
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;
      heroTitle.style.transform = `perspective(1000px) rotateY(${currentTiltX * 6}deg) rotateX(${-currentTiltY * 5}deg)`;
      requestAnimationFrame(updateTilt);
    };
    updateTilt();
  }

  // 3. Return to top when clicking brand badge on home page
  const brandBadges = document.querySelectorAll('.brand-badge');
  brandBadges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
});
