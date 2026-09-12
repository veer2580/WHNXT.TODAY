import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpaceScene } from './scene/SpaceScene.js';
import { BookingCalendar } from './booking/BookingCalendar.js';
import { IntakeModal } from './intake/IntakeModal.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Space Scene Canvas
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    new SpaceScene(canvas);
  }

  // 2. Initialize Booking Calendar if present on page
  if (document.getElementById('cal-days-grid')) {
    new BookingCalendar();
  }

  // 3. Initialize Intake Questionnaire & Calendly Dispatch
  new IntakeModal();

  // 4. Domain Pills Selection (on contact.html)
  const pills = document.querySelectorAll('.domain-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // 5. Inquiry Transmission Form (on contact.html)
  const inquiryForm = document.getElementById('inquiry-form');
  const successState = document.getElementById('form-success-state');
  const resetBtn = document.getElementById('btn-reset-form');

  if (inquiryForm && successState) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      inquiryForm.style.display = 'none';
      successState.style.display = 'flex';
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        inquiryForm.reset();
        successState.style.display = 'none';
        inquiryForm.style.display = 'flex';
      });
    }
  }

  // 6. GSAP Entrance Animations for About Page
  const aboutHero = document.querySelector('.about-hero-grid');
  if (aboutHero) {
    gsap.fromTo(aboutHero, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }
    );
  }

  const approachCard = document.querySelector('.approach-flow-card');
  if (approachCard) {
    gsap.fromTo(approachCard,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: approachCard,
          start: 'top 85%'
        }
      }
    );
  }

  const dualLayout = document.querySelector('.about-dual-layout');
  if (dualLayout) {
    gsap.fromTo(dualLayout.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: dualLayout,
          start: 'top 80%'
        }
      }
    );
  }

  const builtNext = document.querySelector('.built-next-section');
  if (builtNext) {
    gsap.fromTo(builtNext,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: builtNext,
          start: 'top 85%'
        }
      }
    );
  }

  console.log("Subpage 3D environment with GSAP animations initialized successfully.");
});

