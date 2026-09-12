/**
 * src/journey.js
 * Dedicated Logic & Animations for WHNXT.TODAY Journey Page (/journey)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpaceScene } from './scene/SpaceScene.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Procedural WebGL Space Scene
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    new SpaceScene(canvas);
  }

  // 2. GSAP + ScrollTrigger: Cinematic Reveals for Journey Panels
  const journeyPanels = document.querySelectorAll('.journey-panel');
  journeyPanels.forEach((panel) => {
    const heading = panel.querySelector('.panel-heading, .whnxt-logo-title, .see-next-heading, .scroll-prompt-wrap');
    if (heading) {
      gsap.fromTo(heading, 
        {
          opacity: 0,
          y: 35,
          filter: 'blur(8px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // 3. Next Actions Grid Reveal at the end of journey
  const actionsGrid = document.querySelector('.journey-next-actions');
  if (actionsGrid) {
    gsap.fromTo(actionsGrid,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: actionsGrid,
          start: 'top 85%'
        }
      }
    );
  }

  console.log("WHNXT.TODAY Journey 3D Environment initialized successfully.");
});
