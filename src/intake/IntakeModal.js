/**
 * IntakeModal.js
 * Interactive Questionnaire & Calendly Dispatch System.
 * Connects user inquiries with https://calendly.com/space-antellay/30min
 */

export class IntakeModal {
  constructor() {
    this.calendlyBaseUrl = "https://calendly.com/space-antellay/30min";
    this.currentStep = 1;
    this.formData = {
      purpose: "Frontier AI & Neural Architectures",
      focus: "Autonomous Cognitive Systems",
      name: "",
      org: "",
      email: "",
      notes: ""
    };

    this.initDOM();
    this.attachEvents();
  }

  initDOM() {
    // Inject modal HTML into DOM if not already present
    if (!document.getElementById('intake-modal-overlay')) {
      const modalHTML = `
        <div class="intake-modal-overlay" id="intake-modal-overlay">
          <div class="intake-modal-card glass-panel-card">
            <!-- Modal Top Bar -->
            <div class="intake-card-top">
              <div class="intake-badge">
                <span class="intake-badge-dot"></span>
                <span class="intake-badge-text" id="intake-step-indicator">STEP 01 OF 03 • PURPOSE</span>
              </div>
              <button class="intake-close-btn" id="intake-close-btn" aria-label="Close">✕</button>
            </div>

            <!-- Progress Bar -->
            <div class="intake-progress-bar">
              <div class="intake-progress-fill" id="intake-progress-fill"></div>
            </div>

            <!-- STEP 1: PURPOSE / INQUIRY FOCUS -->
            <div class="intake-step" id="intake-step-1">
              <h3 class="intake-heading">What is the objective of your consultation?</h3>
              <p class="intake-subheading">Select the primary domain you wish to explore with A N T E L L A Y Tech.</p>
              
              <div class="intake-options-grid">
                <button type="button" class="intake-opt-btn active" data-val="Frontier AI & Neural Architectures">
                  <span class="opt-bullet">01</span>
                  <span class="opt-title">Frontier AI & Neural Architectures</span>
                  <span class="opt-desc">Autonomous cognitive models, topological logic & non-linear compute.</span>
                </button>

                <button type="button" class="intake-opt-btn" data-val="Quantum Telemetry & Signal Infrastructure">
                  <span class="opt-bullet">02</span>
                  <span class="opt-title">Quantum Telemetry & Signals</span>
                  <span class="opt-desc">Deep-space signal decoders, sensor arrays & low-noise telemetry.</span>
                </button>

                <button type="button" class="intake-opt-btn" data-val="Strategic Consortium & Private Partnerships">
                  <span class="opt-bullet">03</span>
                  <span class="opt-title">Strategic Consortium & Partnership</span>
                  <span class="opt-desc">Antellay Labs research alignment, institutional syndicates & co-investments.</span>
                </button>

                <button type="button" class="intake-opt-btn" data-val="Enterprise Integration & Autonomous Scaling">
                  <span class="opt-bullet">04</span>
                  <span class="opt-title">Enterprise System Integration</span>
                  <span class="opt-desc">Deploying sovereign synthetic intelligence nodes into critical infrastructure.</span>
                </button>
              </div>

              <div class="intake-actions-row right">
                <button type="button" class="btn-intake-next" id="btn-step1-next">
                  <span>CONTINUE</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <!-- STEP 2: CREDENTIALS / CONTACT INFO -->
            <div class="intake-step" id="intake-step-2" style="display: none;">
              <h3 class="intake-heading">Identify your credentials.</h3>
              <p class="intake-subheading">We will use this to personalize your 30-minute private consultation session.</p>

              <div class="intake-inputs-group">
                <div class="form-group">
                  <label for="intake-name" class="form-label">FULL NAME / IDENTIFIER *</label>
                  <input type="text" id="intake-name" class="form-input" placeholder="e.g. Dr. Arthur Vance" required>
                </div>

                <div class="form-group">
                  <label for="intake-org" class="form-label">ORGANIZATION / INSTITUTION *</label>
                  <input type="text" id="intake-org" class="form-input" placeholder="e.g. Quantum Dynamics Lab" required>
                </div>

                <div class="form-group">
                  <label for="intake-email" class="form-label">DIRECT RETURN EMAIL *</label>
                  <input type="email" id="intake-email" class="form-input" placeholder="vance@laboratory.org" required>
                </div>
              </div>

              <div class="intake-actions-row space-between">
                <button type="button" class="btn-intake-back" id="btn-step2-back">❮ BACK</button>
                <button type="button" class="btn-intake-next" id="btn-step2-next">
                  <span>REVIEW & SCHEDULE</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <!-- STEP 3: DISPATCH TO CALENDLY -->
            <div class="intake-step" id="intake-step-3" style="display: none;">
              <div class="calendly-ready-badge">
                <span class="check-icon">✓</span>
                <span>PROFILE READY FOR SCHEDULING</span>
              </div>

              <h3 class="intake-heading">Schedule 30-Min Private Consultation</h3>
              <p class="intake-subheading">Select your preferred slot on the official Calendly reservation terminal.</p>

              <div class="intake-summary-box">
                <div class="summary-line">
                  <span class="summary-label">CONSULTATION:</span>
                  <span class="summary-val" id="sum-purpose">Frontier AI</span>
                </div>
                <div class="summary-line">
                  <span class="summary-label">DELEGATE:</span>
                  <span class="summary-val" id="sum-name">Dr. Arthur Vance</span>
                </div>
                <div class="summary-line">
                  <span class="summary-label">ORGANIZATION:</span>
                  <span class="summary-val" id="sum-org">Quantum Dynamics</span>
                </div>
                <div class="summary-line">
                  <span class="summary-label">HOST:</span>
                  <span class="summary-val cyan">A N T E L L A Y Tech (30 Min Session)</span>
                </div>
              </div>

              <div class="calendly-actions-wrap">
                <a href="https://calendly.com/space-antellay/30min" target="_blank" rel="noopener noreferrer" class="btn-launch-calendly" id="btn-launch-calendly">
                  <span>OPEN CALENDLY SCHEDULER</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>

              <div class="intake-actions-row space-between" style="margin-top: 1.5rem;">
                <button type="button" class="btn-intake-back" id="btn-step3-back">❮ EDIT DETAILS</button>
                <button type="button" class="btn-intake-done" id="btn-step3-done">DISMISS</button>
              </div>
            </div>

          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    this.overlay = document.getElementById('intake-modal-overlay');
    this.closeBtn = document.getElementById('intake-close-btn');
    this.indicator = document.getElementById('intake-step-indicator');
    this.progressFill = document.getElementById('intake-progress-fill');

    this.step1 = document.getElementById('intake-step-1');
    this.step2 = document.getElementById('intake-step-2');
    this.step3 = document.getElementById('intake-step-3');

    this.step1Next = document.getElementById('btn-step1-next');
    this.step2Back = document.getElementById('btn-step2-back');
    this.step2Next = document.getElementById('btn-step2-next');
    this.step3Back = document.getElementById('btn-step3-back');
    this.step3Done = document.getElementById('btn-step3-done');
    this.launchCalendlyBtn = document.getElementById('btn-launch-calendly');

    this.inputName = document.getElementById('intake-name');
    this.inputOrg = document.getElementById('intake-org');
    this.inputEmail = document.getElementById('intake-email');

    this.sumPurpose = document.getElementById('sum-purpose');
    this.sumName = document.getElementById('sum-name');
    this.sumOrg = document.getElementById('sum-org');
  }

  open() {
    if (!this.overlay) return;
    this.goToStep(1);
    this.overlay.classList.add('active');
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
  }

  goToStep(step) {
    this.currentStep = step;

    if (step === 1) {
      this.step1.style.display = 'block';
      this.step2.style.display = 'none';
      this.step3.style.display = 'none';
      this.indicator.textContent = 'STEP 01 OF 03 • PURPOSE';
      this.progressFill.style.width = '33%';
    } else if (step === 2) {
      this.step1.style.display = 'none';
      this.step2.style.display = 'block';
      this.step3.style.display = 'none';
      this.indicator.textContent = 'STEP 02 OF 03 • IDENTITY';
      this.progressFill.style.width = '66%';
    } else if (step === 3) {
      this.step1.style.display = 'none';
      this.step2.style.display = 'none';
      this.step3.style.display = 'block';
      this.indicator.textContent = 'STEP 03 OF 03 • CALENDLY RESERVATION';
      this.progressFill.style.width = '100%';

      // Update summary
      if (this.sumPurpose) this.sumPurpose.textContent = this.formData.purpose;
      if (this.sumName) this.sumName.textContent = this.formData.name || 'Anonymous Guest';
      if (this.sumOrg) this.sumOrg.textContent = this.formData.org || 'Independent';

      // Build personalized Calendly URL with prefilled parameters
      let targetUrl = this.calendlyBaseUrl;
      const params = new URLSearchParams();
      if (this.formData.name) params.append('name', this.formData.name);
      if (this.formData.email) params.append('email', this.formData.email);
      if (this.formData.purpose) params.append('a1', this.formData.purpose);

      if (params.toString()) {
        targetUrl += '?' + params.toString();
      }

      if (this.launchCalendlyBtn) {
        this.launchCalendlyBtn.href = targetUrl;
      }
    }
  }

  attachEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    // Step 1 Options selection
    const optButtons = document.querySelectorAll('.intake-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        optButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.formData.purpose = btn.getAttribute('data-val');
      });
    });

    // Step 1 Next
    if (this.step1Next) {
      this.step1Next.addEventListener('click', () => {
        this.goToStep(2);
      });
    }

    // Step 2 Back & Next
    if (this.step2Back) {
      this.step2Back.addEventListener('click', () => {
        this.goToStep(1);
      });
    }

    if (this.step2Next) {
      this.step2Next.addEventListener('click', () => {
        if (this.inputName) this.formData.name = this.inputName.value.trim();
        if (this.inputOrg) this.formData.org = this.inputOrg.value.trim();
        if (this.inputEmail) this.formData.email = this.inputEmail.value.trim();

        if (!this.formData.name) {
          this.inputName.focus();
          return;
        }
        if (!this.formData.email) {
          this.inputEmail.focus();
          return;
        }

        this.goToStep(3);
      });
    }

    // Step 3 Back & Done
    if (this.step3Back) {
      this.step3Back.addEventListener('click', () => {
        this.goToStep(2);
      });
    }

    if (this.step3Done) {
      this.step3Done.addEventListener('click', () => {
        this.close();
      });
    }

    // Global trigger buttons for opening intake modal
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-intake]');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });
  }
}
