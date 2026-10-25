/* ============================================================
   Vivaha — Premium Indian Matrimony PWA
   Main Application Logic
   ============================================================ */
(function () {
  'use strict';

  // ============================================================
  // Utility Functions
  // ============================================================
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const LS = {
    get(key, defaultValue) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : defaultValue; }
      catch { return defaultValue; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch {}
    }
  };

  // ============================================================
  // State Management
  // ============================================================
  const state = {
    currentView: 'home',
    isOnline: navigator.onLine,
    installPrompt: null,
    profiles: [],
    filteredProfiles: [],
    searchFilters: {}
  };

  // ============================================================
  // Sample Data (Replace with API in production)
  // ============================================================
  const sampleProfiles = [
    {
      id: 'P001',
      name: 'Priya Sharma',
      age: 28,
      gender: 'female',
      city: 'New Delhi',
      state: 'Delhi',
      religion: 'hindu',
      caste: 'brahmin',
      motherTongue: 'Hindi',
      education: 'M.Tech',
      profession: 'Software Engineer',
      company: 'Google',
      income: '25-30 LPA',
      height: '5\'4"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23D4A843" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EPriya%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: { rashi: 'Mesh', nakshatra: 'Ashwini', gan: 'Deva', nadi: 'Adi' }
    },
    {
      id: 'P002',
      name: 'Rajesh Patel',
      age: 30,
      gender: 'male',
      city: 'Mumbai',
      state: 'Maharashtra',
      religion: 'hindu',
      caste: 'vaishya',
      motherTongue: 'Gujarati',
      education: 'MBBS',
      profession: 'Doctor',
      company: 'Apollo Hospitals',
      income: '30-40 LPA',
      height: '5\'9"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23C8962E" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3ERajesh%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: { rashi: 'Vrishabh', nakshatra: 'Rohini', gan: 'Manushya', nadi: 'Madhya' }
    },
    {
      id: 'P003',
      name: 'Ananya Reddy',
      age: 26,
      gender: 'female',
      city: 'Hyderabad',
      state: 'Telangana',
      religion: 'hindu',
      caste: 'kshatriya',
      motherTongue: 'Telugu',
      education: 'MBA',
      profession: 'Marketing Manager',
      company: 'Amazon',
      income: '20-25 LPA',
      height: '5\'5"',
      maritalStatus: 'never-married',
      manglik: true,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23B8860B" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EAnanya%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: { rashi: 'Simha', nakshatra: 'Magha', gan: 'Rakshasa', nadi: 'Antya' }
    },
    {
      id: 'P004',
      name: 'Arjun Singh',
      age: 32,
      gender: 'male',
      city: 'Bangalore',
      state: 'Karnataka',
      religion: 'hindu',
      caste: 'kshatriya',
      motherTongue: 'Kannada',
      education: 'M.Tech',
      profession: 'Data Scientist',
      company: 'Microsoft',
      income: '40-50 LPA',
      height: '5\'11"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23C8962E" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EArjun%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: { rashi: 'Kanya', nakshatra: 'Hasta', gan: 'Deva', nadi: 'Adi' }
    },
    {
      id: 'P005',
      name: 'Meera Nair',
      age: 29,
      gender: 'female',
      city: 'Kochi',
      state: 'Kerala',
      religion: 'christian',
      caste: 'syrian-christian',
      motherTongue: 'Malayalam',
      education: 'M.Sc',
      profession: 'Research Scientist',
      company: 'ISRO',
      income: '15-20 LPA',
      height: '5\'3"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23D4A843" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EMeera%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: false,
      kundali: null
    },
    {
      id: 'P006',
      name: 'Vikram Malhotra',
      age: 31,
      gender: 'male',
      city: 'Chandigarh',
      state: 'Punjab',
      religion: 'sikh',
      caste: 'khatri',
      motherTongue: 'Punjabi',
      education: 'CA',
      profession: 'Chartered Accountant',
      company: 'Deloitte',
      income: '35-40 LPA',
      height: '5\'10"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23C8962E" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EVikram%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: { rashi: 'Makar', nakshatra: 'Shravana', gan: 'Manushya', nadi: 'Madhya' }
    },
    {
      id: 'P007',
      name: 'Aisha Khan',
      age: 27,
      gender: 'female',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      religion: 'muslim',
      caste: 'sayyid',
      motherTongue: 'Urdu',
      education: 'B.Tech',
      profession: 'UX Designer',
      company: 'Adobe',
      income: '20-25 LPA',
      height: '5\'4"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23D4A843" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EAisha%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: null
    },
    {
      id: 'P008',
      name: 'Karan Mehta',
      age: 33,
      gender: 'male',
      city: 'Ahmedabad',
      state: 'Gujarat',
      religion: 'jain',
      caste: 'shwetambar',
      motherTongue: 'Gujarati',
      education: 'MBA',
      profession: 'Entrepreneur',
      company: 'Own Venture',
      income: '50+ LPA',
      height: '5\'8"',
      maritalStatus: 'never-married',
      manglik: false,
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"%3E%3Crect fill="%23C8962E" width="200" height="250"/%3E%3Ctext x="100" y="125" text-anchor="middle" fill="white" font-size="24"%3EKaran%3C/text%3E%3C/svg%3E',
      verified: true,
      premium: true,
      kundali: { rashi: 'Tula', nakshatra: 'Swati', gan: 'Deva', nadi: 'Adi' }
    }
  ];

  // Success Stories Data
  const successStories = [
    {
      id: 'S001',
      couple: 'Priya & Rahul',
      location: 'Delhi',
      duration: '6 months',
      story: 'We met on Vivaha during Diwali 2023. Our families connected through the family dashboard, and the Kundali matching gave us confidence. The relationship manager guided us through every step. Today we are happily married!',
      verified: true
    },
    {
      id: 'S002',
      couple: 'Ananya & Arjun',
      location: 'Bangalore',
      duration: '8 months',
      story: 'Being NRIs, we thought finding a match would be hard. Vivaha\'s NRI filters and video calling made it seamless. Our parents loved the family dashboard feature. The Kundali matching was 32/36 gunas!',
      verified: true
    },
    {
      id: 'S003',
      couple: 'Meera & Vikram',
      location: 'Chandigarh',
      duration: '5 months',
      story: 'We both wanted someone who values tradition as much as career. Vivaha\'s filters helped us find each other instantly. The relationship manager arranged our family meeting in Chandigarh. Best decision ever!',
      verified: true
    }
  ];

  // ============================================================
  // DOM Elements Cache
  // ============================================================
  const elements = {};

  function cacheElements() {
    elements.mobileMenu = $('#mobile-menu');
    elements.navToggle = $('.nav-toggle');
    elements.mobileNavLinks = $$('.mobile-nav-link');
    elements.navLinks = $$('.nav-link');
    elements.viewSections = $$('[id^="view-"], section[id]:not(.hero)');
    elements.searchForm = $('#searchForm');
    elements.storiesGrid = $('#storiesGrid');
    elements.installBanner = $('#installBanner');
    elements.installAccept = $('#installAccept');
    elements.installDismiss = $('#installDismiss');
    elements.offlineBanner = $('#offlineBanner');
    elements.toastContainer = $('#toastContainer');
    elements.navToggle = $('.nav-toggle');
    elements.header = $('.header');
  }

  // ============================================================
  // Navigation / View Management
  // ============================================================
  function showView(viewName, pushState = true) {
    // Update active nav links
    $$('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === viewName);
    });

    // Handle special views
    if (viewName === 'home') {
      // Home is the hero section + features etc - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      state.currentView = 'home';
      if (pushState) history.pushState({ view: 'home' }, '', '#home');
      return;
    }

    // For section-based views, just scroll to them
    const targetSection = $(`#${viewName}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
      state.currentView = viewName;
      if (pushState) history.pushState({ view: viewName }, '', `#${viewName}`);
    }

    // Close mobile menu
    closeMobileMenu();
  }

  function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    if (hash !== state.currentView) {
      showView(hash, false);
    }
  }

  function closeMobileMenu() {
    if (elements.mobileMenu && elements.mobileMenu.classList.contains('open')) {
      elements.mobileMenu.classList.remove('open');
      elements.navToggle.setAttribute('aria-expanded', 'false');
      elements.mobileMenu.hidden = true;
    }
  }

  // ============================================================
  // Search Functionality
  // ============================================================
  function initSearch() {
    if (!elements.searchForm) return;

    elements.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.searchForm);
      const filters = {};
      for (const [key, value] of formData.entries()) {
        if (value) filters[key] = value;
      }
      state.searchFilters = filters;
      performSearch(filters);
      showView('search');
      showToast('Searching profiles...', 'info');
    });
  }

  function performSearch(filters) {
    // In production, this would be an API call
    state.filteredProfiles = sampleProfiles.filter(profile => {
      if (filters.gender && profile.gender !== (filters.gender === 'groom' ? 'male' : 'female')) return false;
      if (filters.age) {
        const [min, max] = filters.age.split('-').map(Number);
        if (max) {
          if (profile.age < min || profile.age > max) return false;
        } else {
          if (profile.age < min) return false;
        }
      }
      if (filters.religion && profile.religion !== filters.religion) return false;
      if (filters.caste && profile.caste !== filters.caste) return false;
      if (filters.location && profile.city.toLowerCase() !== filters.location.toLowerCase() && profile.state.toLowerCase() !== filters.location.toLowerCase()) return false;
      return true;
    });

    renderSearchResults();
    showToast(`Found ${state.filteredProfiles.length} matches`, 'success');
  }

  function renderSearchResults() {
    const resultsContainer = $('#searchResults');
    if (!resultsContainer) return;

    if (state.filteredProfiles.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--gold); margin-bottom: var(--space-lg);"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <h3>No matches found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = state.filteredProfiles.map(profile => `
      <article class="profile-card" data-id="${profile.id}">
        <div class="profile-photo">
          <img src="${profile.photo}" alt="${profile.name}" loading="lazy">
          ${profile.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
          ${profile.premium ? '<span class="premium-badge">Premium</span>' : ''}
        </div>
        <div class="profile-info">
          <div class="profile-header">
            <h3>${profile.name}, ${profile.age}</h3>
            <span class="gender-badge">${profile.gender === 'male' ? '♂' : '♀'}</span>
          </div>
          <p class="profile-location">📍 ${profile.city}, ${profile.state}</p>
          <div class="profile-details">
            <span>${profile.education}</span>
            <span>${profile.profession}</span>
            <span>${profile.income}</span>
          </div>
          <div class="profile-tags">
            <span class="tag">${profile.religion.charAt(0).toUpperCase() + profile.religion.slice(1)}</span>
            <span class="tag">${profile.caste}</span>
            <span class="tag">${profile.motherTongue}</span>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary btn-sm" data-action="interest" data-id="${profile.id}">Express Interest</button>
          <button class="btn btn-outline btn-sm" data-action="view" data-id="${profile.id}">View Profile</button>
        </div>
      </article>
    `).join('');

    // Add click handlers for new buttons
    $$('[data-action="interest"]').forEach(btn => {
      btn.addEventListener('click', () => handleInterest(btn.dataset.id));
    });
    $$('[data-action="view"]').forEach(btn => {
      btn.addEventListener('click', () => viewProfile(btn.dataset.id));
    });
  }

  function handleInterest(profileId) {
    const profile = sampleProfiles.find(p => p.id === profileId);
    if (!profile) return;

    // In production, this would be an API call
    showToast(`Interest sent to ${profile.name}!`, 'success');

    // Simulate mutual interest for demo
    setTimeout(() => {
      if (Math.random() > 0.5) {
        showToast(`${profile.name} accepted your interest! 💕`, 'success');
      }
    }, 2000);
  }

  function viewProfile(profileId) {
    showToast('Full profile view coming soon!', 'info');
  }

  // ============================================================
  // Render Success Stories
  // ============================================================
  function renderSuccessStories() {
    if (!elements.storiesGrid) return;

    elements.storiesGrid.innerHTML = successStories.map(story => `
      <article class="story-card">
        <div class="story-header">
          <div class="story-avatar"></div>
          <div class="story-info">
            <h4>${story.couple}</h4>
            <p>${story.location} · Married ${story.duration} ago</p>
          </div>
        </div>
        <div class="story-content">
          <p>"${story.story}"</p>
        </div>
        <div class="story-meta">
          <span>${story.verified ? '✓ Verified' : ''}</span>
          <span>${story.duration} to marriage</span>
        </div>
      </article>
    `).join('');
  }

  // ============================================================
  // Counter Animation
  // ============================================================
  function animateCounters() {
    $$('.stat-number[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    });
  }

  // ============================================================
  // PWA Functionality
  // ============================================================
  function initPWA() {
    // Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.installPrompt = e;
      // Show after 30 seconds
      setTimeout(() => showInstallBanner(), 30000);
    });

    window.addEventListener('appinstalled', () => {
      state.installPrompt = null;
      hideInstallBanner();
      showToast('Vivaha installed successfully! 🎉', 'success');
    });

    // Online/Offline
    window.addEventListener('online', () => {
      state.isOnline = true;
      hideOfflineBanner();
      showToast('Back online', 'success');
    });

    window.addEventListener('offline', () => {
      state.isOnline = false;
      showOfflineBanner();
      showToast('You\'re offline - cached content available', 'info');
    });

    // Install Buttons
    if (elements.installAccept) {
      elements.installAccept.addEventListener('click', async () => {
        if (state.installPrompt) {
          await state.installPrompt.prompt();
          const result = await state.installPrompt.userChoice;
          if (result.outcome === 'accepted') {
            showToast('Installing Vivaha...', 'info');
          }
          state.installPrompt = null;
          hideInstallBanner();
        }
      });
    }

    if (elements.installDismiss) {
      elements.installDismiss.addEventListener('click', () => {
        hideInstallBanner();
        // Don't show again for 7 days
        localStorage.setItem('installDismissed', Date.now().toString());
      });
    }

    // Check if previously dismissed
    const dismissed = localStorage.getItem('installDismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      // Don't show for 7 days
    }
  }

  function showInstallBanner() {
    if (elements.installBanner && !matchMedia('(display-mode: standalone)').matches) {
      elements.installBanner.hidden = false;
    }
  }

  function hideInstallBanner() {
    if (elements.installBanner) {
      elements.installBanner.classList.add('closing');
      setTimeout(() => { elements.installBanner.hidden = true; elements.installBanner.classList.remove('closing'); }, 300);
    }
  }

  function showOfflineBanner() {
    if (elements.offlineBanner) elements.offlineBanner.hidden = false;
  }

  function hideOfflineBanner() {
    if (elements.offlineBanner) elements.offlineBanner.hidden = true;
  }

  // ============================================================
  // Toast Notifications
  // ============================================================
  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>' : type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' : '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'}
      </svg>
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ============================================================
  // Scroll Effects
  // ============================================================
  function initScrollEffects() {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (elements.header) {
        if (currentScroll > 100) elements.header.classList.add('scrolled');
        else elements.header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.feature-card, .service-card, .step, .story-card, .profile-card').forEach(el => {
      observer.observe(el);
    });

    // Trigger counter animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const hero = $('.hero');
    if (hero) heroObserver.observe(hero);
  }

  // ============================================================
  // Form Handling
  // ============================================================
  function initForms() {
    // Register form (if exists)
    const registerForm = $('#registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        // In production, submit to API
        showToast('Profile created successfully! Welcome to Vivaha 🎉', 'success');
        registerForm.reset();
        showView('home');
      });
    }

    // Contact form (if exists)
    const contactForm = $('#contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you! Our team will contact you within 24 hours.', 'success');
        contactForm.reset();
      });
    }
  }

  // ============================================================
  // Initialize App
  // ============================================================
  function init() {
    cacheElements();

    // Navigation
    $$('.nav-link, .mobile-nav-link, [data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        const view = link.dataset.nav;
        if (view && !link.classList.contains('btn')) {
          e.preventDefault();
          showView(view);
        }
      });
    });

    // Mobile menu toggle
    if (elements.navToggle) {
      elements.navToggle.addEventListener('click', () => {
        const isOpen = elements.mobileMenu.classList.toggle('open');
        elements.navToggle.setAttribute('aria-expanded', isOpen);
        elements.mobileMenu.hidden = !isOpen;
      });
    }

    // Close mobile menu on link click
    elements.mobileNavLinks?.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Hash-based routing
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    // Initialize features
    initSearch();
    initForms();
    initPWA();
    initScrollEffects();
    renderSuccessStories();

    // Initial counter animation
    setTimeout(animateCounters, 500);

    console.log('Vivaha PWA initialized 🕉️');
  }

  // ============================================================
  // Start App
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();