/**
 * BookingCalendar.js
 * Interactive scheduling module replicating the Figma design of Page 3.
 * 100% pure client logic with interactive dates, times, and confirmation modal.
 */

import confetti from 'canvas-confetti';

export class BookingCalendar {
  constructor() {
    this.currentYear = 2025;
    this.currentMonth = 5; // June (0-indexed: 5 = June)
    this.selectedDate = { year: 2025, month: 5, day: 12 }; // Default Day 12 from PDF
    this.selectedTime = "03:00 PM"; // Default 03:00 PM from PDF

    this.monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    this.initDOM();
    this.render();
    this.attachEvents();
  }

  initDOM() {
    this.monthTitleEl = document.getElementById('cal-current-month');
    this.daysGridEl = document.getElementById('cal-days-grid');
    this.prevBtn = document.getElementById('cal-arrow-prev');
    this.nextBtn = document.getElementById('cal-arrow-next');
    this.slotsListEl = document.getElementById('slots-list');
    this.confirmBtn = document.getElementById('btn-confirm-action');
    this.toastBackdrop = document.getElementById('toast-backdrop');
    this.toastCloseBtn = document.getElementById('toast-close-btn');
    this.toastTimeEl = document.getElementById('toast-time-display');
    this.triggerScheduleBtn = document.getElementById('btn-schedule-meeting');
    this.bookingCard = document.getElementById('booking-modal-card');
    this.dismissBtn = document.getElementById('modal-dismiss-btn');
  }

  render() {
    // 1. Render Month Title
    if (this.monthTitleEl) {
      this.monthTitleEl.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    // 2. Render Calendar Grid
    if (this.daysGridEl) {
      this.daysGridEl.innerHTML = '';

      // First day of month (adjust so Mon = 0, Sun = 6)
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const startCol = (firstDay + 6) % 7;

      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

      // Render leading days from previous month (e.g. 26, 27, 28, 29, 30, 31 for June 2025)
      for (let i = startCol - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'day-cell other-month';
        cell.textContent = prevMonthDays - i;
        this.daysGridEl.appendChild(cell);
      }

      // Render current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.textContent = day;

        if (
          this.selectedDate &&
          this.selectedDate.year === this.currentYear &&
          this.selectedDate.month === this.currentMonth &&
          this.selectedDate.day === day
        ) {
          cell.classList.add('active');
        }

        cell.addEventListener('click', () => {
          this.selectedDate = {
            year: this.currentYear,
            month: this.currentMonth,
            day: day
          };
          this.render();
        });

        this.daysGridEl.appendChild(cell);
      }

      // Fill remaining row slots
      const totalCells = startCol + daysInMonth;
      const remaining = (7 - (totalCells % 7)) % 7;
      for (let j = 1; j <= remaining; j++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell other-month';
        cell.textContent = j;
        this.daysGridEl.appendChild(cell);
      }
    }
  }

  attachEvents() {
    // Month navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        this.render();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
        this.render();
      });
    }

    // Time slot selection
    if (this.slotsListEl) {
      this.slotsListEl.addEventListener('click', (e) => {
        const slotBtn = e.target.closest('.slot-btn');
        if (!slotBtn) return;

        this.slotsListEl.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        slotBtn.classList.add('active');
        this.selectedTime = slotBtn.dataset.time || slotBtn.textContent.trim();
      });
    }

    // Confirm button
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', () => {
        if (!this.selectedDate) return;
        const formatted = `${this.monthNames[this.selectedDate.month]} ${this.selectedDate.day}, ${this.selectedDate.year} at ${this.selectedTime}`;
        if (this.toastTimeEl) {
          this.toastTimeEl.textContent = formatted;
        }

        if (this.toastBackdrop) {
          this.toastBackdrop.classList.add('active');
        }

        // Fire subtle cosmic confetti burst
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#00e5ff', '#38bdf8', '#ffffff', '#ff9838']
        });
      });
    }

    // Close toast modal
    if (this.toastCloseBtn) {
      this.toastCloseBtn.addEventListener('click', () => {
        if (this.toastBackdrop) {
          this.toastBackdrop.classList.remove('active');
        }
      });
    }

    if (this.toastBackdrop) {
      this.toastBackdrop.addEventListener('click', (e) => {
        if (e.target === this.toastBackdrop) {
          this.toastBackdrop.classList.remove('active');
        }
      });
    }

    // Trigger schedule button
    if (this.triggerScheduleBtn) {
      this.triggerScheduleBtn.addEventListener('click', () => {
        if (this.bookingCard) {
          this.bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.bookingCard.style.transform = 'scale(1.02)';
          setTimeout(() => {
            this.bookingCard.style.transform = 'none';
          }, 300);
        }
      });
    }

    // Modal dismiss button (subtle collapse feedback)
    if (this.dismissBtn) {
      this.dismissBtn.addEventListener('click', () => {
        if (this.bookingCard) {
          this.bookingCard.style.opacity = '0.4';
          this.bookingCard.style.transform = 'scale(0.97)';
          setTimeout(() => {
            this.bookingCard.style.opacity = '1';
            this.bookingCard.style.transform = 'none';
          }, 500);
        }
      });
    }
  }
}
