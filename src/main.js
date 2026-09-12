import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpaceScene } from './scene/SpaceScene.js';
import { BookingCalendar } from './booking/BookingCalendar.js';
import { IntakeModal } from './intake/IntakeModal.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Procedural WebGL Space Scene
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    new SpaceScene(canvas);
  }

  // 2. Initialize Interactive Booking Calendar
  new BookingCalendar();

  // 3. Initialize Interactive Intake Questionnaire & Calendly Dispatch
  new IntakeModal();

  // 4. Navigation between sections & pages:
  const brandBadges = document.querySelectorAll('.brand-badge');
  brandBadges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  const navHome = document.querySelector('.universal-nav-link[data-nav="home"]');
  const navJourney = document.querySelector('.universal-nav-link[data-nav="journey"]');
  const navContact = document.querySelector('.universal-nav-link[data-nav="contact"]');

  if (navHome) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (navJourney) {
    navJourney.addEventListener('click', (e) => {
      e.preventDefault();
      const page2 = document.getElementById('page-2');
      if (page2) {
        page2.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (navContact) {
    navContact.addEventListener('click', (e) => {
      const page3 = document.getElementById('page-3');
      if (page3) {
        e.preventDefault();
        page3.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Scroll spy for index.html to update active header nav item across Home, Journey, Contact
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const page2 = document.getElementById('page-2');
    const page3 = document.getElementById('page-3');
    const page2Top = page2 ? page2.offsetTop - 180 : 600;
    const page3Top = page3 ? page3.offsetTop - 180 : 2500;

    if (scrollY >= page3Top) {
      if (navContact) navContact.classList.add('active');
      if (navJourney) navJourney.classList.remove('active');
      if (navHome) navHome.classList.remove('active');
    } else if (scrollY >= page2Top) {
      if (navJourney) navJourney.classList.add('active');
      if (navHome) navHome.classList.remove('active');
      if (navContact) navContact.classList.remove('active');
    } else {
      if (navHome) navHome.classList.add('active');
      if (navJourney) navJourney.classList.remove('active');
      if (navContact) navContact.classList.remove('active');
    }
  });

  // Page 1: "ENTER WHNXT.TODAY →" Button -> Smooth scroll to Page 2
  const btnEnter = document.getElementById('btn-enter-whnxt');
  if (btnEnter) {
    btnEnter.addEventListener('click', () => {
      const page2 = document.getElementById('page-2');
      if (page2) {
        page2.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Page 2: "SEE WHAT COMES NEXT." -> Smooth scroll to Page 3
  const triggerGotoP3 = document.getElementById('trigger-goto-p3');
  if (triggerGotoP3) {
    triggerGotoP3.addEventListener('click', () => {
      const page3 = document.getElementById('page-3');
      if (page3) {
        page3.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 5. Interactive 3D Parallax Tilt on Hero Logo Typography
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

  // 6. GSAP + ScrollTrigger: Cinematic Word & Section Reveals (SIGNALS, PATTERNS, INTELLIGENCE, etc.)
  const journeyPanels = document.querySelectorAll('.journey-panel');
  journeyPanels.forEach((panel) => {
    const heading = panel.querySelector('.panel-heading, .whnxt-logo-title, .see-next-heading, .scroll-prompt-wrap');
    if (heading) {
      gsap.fromTo(heading, 
        {
          opacity: 0,
          y: 35,
          filter: 'blur(10px)',
          letterSpacing: '0.62em'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          letterSpacing: '0.45em',
          duration: 1.2,
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

  // Page 3: Contact Section & Booking Card Cinematic Reveal
  const p3Intro = document.querySelector('.p3-intro-block');
  if (p3Intro) {
    gsap.fromTo(p3Intro,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#page-3',
          start: 'top 75%'
        }
      }
    );
  }

  const bookingCard = document.getElementById('booking-modal-card');
  if (bookingCard) {
    gsap.fromTo(bookingCard,
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bookingCard,
          start: 'top 85%'
        }
      }
    );
  }

  console.log("WHNXT.TODAY 3D Environment with GSAP ScrollTriggers & Calendly initialized.");
});

