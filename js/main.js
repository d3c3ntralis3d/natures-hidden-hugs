/* ==========================================
   Nature's Hidden Hugs — Main JavaScript
   ========================================== */

// ==========================================
// Story Data (from YouTube channel)
// ==========================================
const stories = [
  {
    id: "arctic-fox-rescue",
    title: "I Followed a Blood Trail in the Snow… and Found FOUR Tiny Lives",
    youtubeId: "8gm-vX-YrC4",
    desc: "A dramatic rescue story featuring arctic fox pups found in the snow.",
    views: "3.3M",
    tags: ["rescue", "wildlife"]
  },
  {
    id: "snow-leopard-cubs",
    title: "I Followed a Snow Leopard Into the Mountains… Then I Saw the Cubs",
    youtubeId: "D0eyVtalvEg",
    desc: "Snow leopard cubs discovered high in the mountains in a rocky den.",
    views: "6.8K",
    tags: ["wildlife", "wholesome", "mountain"]
  },
  {
    id: "cat-kitten-surgery",
    title: "My Cat Was Broken After Surgery… Then a Kitten Did This 🥺🐾",
    youtubeId: "bqeeVAh1h90",
    desc: "A heartwarming moment between a recovering cat and a comforting kitten.",
    views: "1.2K",
    tags: ["wholesome", "rescue"]
  },
  {
    id: "cougar-cub-rescue",
    title: "I Rescued a Baby Cougar Cub… and My Cat Became Her Mom",
    youtubeId: "pD5McoH2yGs",
    desc: "A cat takes on a maternal role for a rescued baby cougar cub.",
    views: "15K",
    tags: ["rescue", "wildlife"]
  },
  {
    id: "deer-mother-request",
    title: "Mother Deer Asks Me to Save Her Baby",
    youtubeId: "yzkWolfZlO8",
    desc: "A touching interaction where a wild deer leads a human to help her fawn.",
    views: "8.2K",
    tags: ["wildlife", "rescue"]
  },
  {
    id: "unexpected-kitten",
    title: "I Thought My Cat Bought Home A Kitten… Then I Looked Closer 😳",
    youtubeId: "QFJxNRHrRZg",
    desc: "The surprise discovery of a wild animal brought home by a domestic cat.",
    views: "12K",
    tags: ["wildlife", "wholesome"]
  },
  {
    id: "duck-love-story",
    title: "The Duck She Chose to Love",
    youtubeId: "-wKZlbMykNE",
    desc: "A heartwarming narrative about an unlikely bond with a duck.",
    views: "5.4K",
    tags: ["wholesome"]
  },


];

// ==========================================
// Soundtrack Data
// ==========================================
const soundtracks = [
  {
    id: "mothers-love-lyric",
    title: "A Mother's Love (Official Lyric Video)",
    youtubeId: "lYf22RPSRNA",
    desc: "A warm, emotional lyric video celebrating maternal love.",
    views: "71",
    tags: ["soundtrack", "music"]
  }
];

// ==========================================
// Shorts Data
// ==========================================
const shorts = [
  {
    id: "baby-otter-squeaks",
    title: "Baby Otter Squeaks in Water 🦦",
    youtubeId: "pypefxeOxR0",
    desc: "The cutest baby otter getting used to the water.",
    views: "1.2M",
    tags: ["shorts", "cute"]
  }
];

// ==========================================
// Create Story Card Element
// ==========================================
function createStoryCard(story) {
  const card = document.createElement('div');
  card.className = 'card story-card';
  card.dataset.youtubeId = story.youtubeId;

  // YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${story.youtubeId}/maxresdefault.jpg`;
  const fallbackUrl = `https://img.youtube.com/vi/${story.youtubeId}/hqdefault.jpg`;

  // Format views
  const viewsDisplay = story.views ? `${story.views} views` : '';

  // Generate pill tags HTML
  const tagsHtml = story.tags && story.tags.length > 0
    ? `<div class="card-tags">${story.tags.map(tag =>
      `<span class="pill-tag pill-tag--${tag}">${tag}</span>`
    ).join('')}</div>`
    : '';

  // Check if story has a dedicated page
  const storiesWithPages = [
    'arctic-fox-rescue',
    'snow-leopard-cubs',
    'cat-kitten-surgery',
    'cougar-cub-rescue',
    'deer-mother-request',
    'unexpected-kitten',
    'duck-love-story'
  ];
  const hasPage = storiesWithPages.includes(story.id);
  const storyUrl = hasPage ? `stories/${story.id}.html` : null;
  const buttonText = hasPage ? 'Read Full Story' : 'Watch Story';

  card.innerHTML = `
    <div class="card-thumbnail">
      <img src="${thumbnailUrl}" alt="${story.title}" loading="lazy"
           onerror="this.src='${fallbackUrl}'">
      <div class="play-icon"></div>
    </div>
    <div class="card-body">
      ${viewsDisplay ? `<div class="card-meta"><span>👁️ ${viewsDisplay}</span></div>` : ''}
      <h3 class="card-title">${story.title}</h3>
      <p class="card-text">${story.desc}</p>
      ${tagsHtml}
      ${hasPage
      ? `<a href="${storyUrl}" class="btn btn-primary" style="width: 100%; margin-top: var(--space-sm); display: block; text-align: center; text-decoration: none;">${buttonText}</a>`
      : `<button class="btn btn-primary" style="width: 100%; margin-top: var(--space-sm); display: block; text-align: center;" onclick="event.stopPropagation(); openVideoModal('${story.youtubeId}')">${buttonText}</button>`
    }
    </div>
  `;

  // Add click handler - navigate to page or open modal
  card.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') return; // Let link handle click
    if (hasPage) {
      window.location.href = storyUrl;
    } else {
      openVideoModal(story.youtubeId);
    }
  });

  return card;
}

// ==========================================
// Video Modal
// ==========================================
function openVideoModal(youtubeId) {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');

  if (modal && iframe) {
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');

  if (modal && iframe) {
    modal.classList.remove('active');
    iframe.src = ''; // Stop video
    document.body.style.overflow = '';
  }
}

// ==========================================
// Back to Top Button
// ==========================================
function initBackToTop() {
  // Create the button dynamically
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  // Show/hide based on scroll position
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// Scroll Reveal Animations
// ==========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ==========================================
// Mobile Navigation
// ==========================================
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    // Close nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }
}

// ==========================================
// Lazy Load Images with Intersection Observer
// ==========================================
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    return;
  }

  // Fallback for older browsers
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}




// ==========================================
// Utility: Format Large Numbers
// ==========================================
function formatViews(num) {
  if (!num) return '';
  const n = parseInt(num.replace(/[^0-9]/g, ''));
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// ==========================================
// Dark Mode Toggle
// ==========================================
function initDarkMode() {
  // Create toggle button dynamically
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Toggle dark mode');
  toggle.innerHTML = `
    <span class="icon-moon">🌙</span>
    <span class="icon-sun">☀️</span>
  `;
  document.body.appendChild(toggle);

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Toggle handler
  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  });
}

// ==========================================
// Newsletter Form Handler
// ==========================================
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email || !isValidEmail(email)) {
        emailInput.classList.add('error');
        emailInput.focus();
        return;
      }

      // Simulate success (in production, you'd send to a backend)
      const button = this.querySelector('button');
      const originalText = button.textContent;

      button.innerHTML = '<span class="loading-spinner"></span>';
      button.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Show success state
        const container = this.closest('.newsletter-section') || this.parentElement;
        const successHtml = `
          <div class="newsletter-success show">
            <div class="checkmark">✅</div>
            <h3>You're In!</h3>
            <p>Thanks for subscribing. You'll receive our latest stories soon.</p>
          </div>
        `;

        this.outerHTML = successHtml;

        // Store subscription status
        localStorage.setItem('newsletter_subscribed', 'true');
      }, 1200);
    });

    // Remove error state on input
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        emailInput.classList.remove('error');
      });
    }
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ==========================================
// Initialize All Features on DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all features
  initScrollReveal();
  initMobileNav();
  initBackToTop();
  initLazyLoad();
  initSmoothScroll();
  initDarkMode();
  initNewsletterForm();

  // Modal close handlers
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('video-modal');

  if (modalClose) {
    modalClose.addEventListener('click', closeVideoModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeVideoModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
    }
  });
});
