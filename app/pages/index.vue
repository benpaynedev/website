<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const toast = useToast();

const schema = toTypedSchema(
    z.object({
      name: z.string().nonempty(),
      email: z.string().nonempty().email(),
      message: z.string().nonempty(),
    }),
);

const { defineField, errorBag, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

let currentPage = ref('');
let isNavScrolling = ref(false);
let sending = ref(false);
let sent = ref(false);
let sendButtonText = ref('Send');
let config = useRuntimeConfig();

const displayedText = ref('Build');
const cyclingWordRef = ref<HTMLElement | null>(null);
const cyclingClasses = ref({
  'is-deleting': false,
  'is-typing': false,
  'is-idle': false,
});
const cyclingTimers: ReturnType<typeof setTimeout>[] = [];
let scrollEndCleanup: (() => void) | null = null;
const resumeModalOpen = ref(false);
const openResumeModal = () => { resumeModalOpen.value = true; };

function downloadPlainTextResume() {
  const a = document.createElement('a');
  a.href = '/Benjamin_Payne_Resume.txt';
  a.download = 'Benjamin_Payne_Resume.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

let [name, nameAttrs] = defineField('name');
let [email, emailAttrs] = defineField('email');
let [message, messageAttrs] = defineField('message');

const onSubmit = handleSubmit(values => {
  sending.value = true;
  sendButtonText.value = 'Sending...';

  const formData = new FormData()

  formData.append('from', `${values.name} <${values.email}>`);
  formData.append('to', `${config.public.WEBMASTER_EMAIL}`);
  formData.append('subject', `Website message from ${values.name}`);
  formData.append('text', `${values.message}`);

  $fetch("https://api.mailgun.net/v3/mail.benpayne.dev/messages", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(`api:${config.public.MAILGUN_API_KEY}`)
    },
    body: formData,
  }).then(() => {
    sent.value = true;
    sendButtonText.value = 'Sent!';

    setTimeout(() => {
      sendButtonText.value = 'Send';
    }, 3000);

    setTimeout(() => {
      sent.value = false;
      sending.value = false;
    }, 5000);
    resetForm();
  });
});

onMounted(() => {
  // ─── Cursor glow ───
  const glow = document.getElementById('cursorGlow') ?? new HTMLInputElement;
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('active'));

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ─── Nav scroll effect ───
  const nav = document.getElementById('mainNav') ?? new HTMLElement;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ─── Scroll reveal ───
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ─── Magnetic buttons ───
  Array.from(document.querySelectorAll('.magnetic') as NodeListOf<HTMLElement>).forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ─── Scroll-end detection for nav scrolling ───
  function waitForScrollEnd() {
    if (scrollEndCleanup) {
      scrollEndCleanup();
      scrollEndCleanup = null;
    }

    const done = () => {
      isNavScrolling.value = false;
      if (scrollEndCleanup) {
        scrollEndCleanup();
        scrollEndCleanup = null;
      }
    };

    if ('onscrollend' in window) {
      const handler = () => done();
      window.addEventListener('scrollend', handler, { once: true });
      scrollEndCleanup = () => window.removeEventListener('scrollend', handler);
    } else {
      let timer: ReturnType<typeof setTimeout>;
      const handler = () => {
        clearTimeout(timer);
        timer = setTimeout(done, 150);
      };
      window.addEventListener('scroll', handler);
      scrollEndCleanup = () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handler);
      };
    }
  }

  // ─── Smooth anchor scrolling ───
  document.querySelectorAll<HTMLElement>('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href') ?? '';
      if (a.getAttribute('class')?.toLowerCase() === 'nav-logo') {
        isNavScrolling.value = true;
        currentPage.value = '';
        waitForScrollEnd();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return;
      }

      const target = document.querySelector(href);
      if (target) {
        isNavScrolling.value = true;
        currentPage.value = target.id ?? '';
        waitForScrollEnd();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Highlight current nav item tied to current section ----
  let sections = document.getElementsByTagName('section');
  let sectionObserver = new IntersectionObserver((entries) => {
    if (isNavScrolling.value) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentPage.value = entry.target.id ?? '';
      }
    });
  }, { rootMargin: '-50% 0px' });

  for (let i = 0; i < sections.length; i++) {
    if (sections[i] !== undefined) {
      sectionObserver.observe(sections[i] ?? new Element);
    }
  }

  // ─── Text cycling animation ───
  const words = ['Build', 'Create', 'Design', 'Craft', 'Shape', 'Launch', 'Ship', 'Engineer'];
  let wordIndex = 0;

  function setCyclingClass(phase: string) {
    cyclingClasses.value = {
      'is-deleting': phase === 'deleting',
      'is-typing': phase === 'typing',
      'is-idle': phase === 'idle',
    };
  }

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      const id = setTimeout(resolve, ms);
      cyclingTimers.push(id);
    });
  }

  async function cycleWords() {
    while (true) {
      const currentWord = words[wordIndex];

      if (currentWord !== undefined) {
        // Delete phase
        setCyclingClass('deleting');
        for (let i = currentWord.length; i >= 0; i--) {
          displayedText.value = currentWord.slice(0, i);
          await delay(80);
        }
      }

      // Move to next word
      wordIndex = (wordIndex + 1) % words.length;
      const nextWord = words[wordIndex];

      if (nextWord !== undefined) {
        // Type phase
        setCyclingClass('typing');
        for (let i = 1; i <= nextWord.length; i++) {
          displayedText.value = nextWord.slice(0, i);
          await delay(100);
        }
      }

      // Idle phase
      setCyclingClass('idle');
      await delay(5000);
    }
  }

  // ─── Resume modal buttons ───
  document.querySelectorAll('[data-resume-modal]').forEach(btn => {
    btn.addEventListener('click', openResumeModal);
  });

  const contactReveal = document.querySelector('#section-contact .reveal');
  if (contactReveal) {
    const cyclingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cyclingObserver.disconnect();
          // Wait for reveal animation to finish
          const startId = setTimeout(() => {
            cycleWords();
          }, 5000);
          cyclingTimers.push(startId);
        }
      });
    }, { threshold: 0.15 });
    cyclingObserver.observe(contactReveal);
  }
});

onUnmounted(() => {
  cyclingTimers.forEach(id => clearTimeout(id));
  if (scrollEndCleanup) {
    scrollEndCleanup();
    scrollEndCleanup = null;
  }
  document.querySelectorAll('[data-resume-modal]').forEach(btn => {
    btn.removeEventListener('click', openResumeModal);
  });
});
</script>

<style scoped>
.resume-modal-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resume-modal-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  text-align: left;
  width: 100%;
  font-family: var(--font-body);
}

.resume-modal-option:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-hover);
}

.resume-modal-option-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.resume-modal-option-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.resume-modal-option-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.resume-modal-option-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}
</style>

<template>
<!-- Cursor glow -->
<div class="cursor-glow" id="cursorGlow"></div>

<!-- Nav -->
<nav id="mainNav">
  <a href="#" class="nav-logo">ben<span>.</span>payne</a>
  <ul class="nav-links">
    <li><a href="#section-about" :class="{current: currentPage === 'section-about'}">About</a></li>
    <li><a href="#section-work" :class="{current: currentPage === 'section-work'}">Work</a></li>
    <li><a href="#section-contact" :class="{current: currentPage === 'section-contact'}">Contact</a></li>
  </ul>
</nav>

<!-- Hero -->
<section class="hero" id="section-about">
  <div class="hero-grid-bg"></div>
  <div class="floating-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <div class="tech-constellation" aria-hidden="true">
    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Connection lines (rendered first, behind nodes) -->
      <line class="constellation-line" x1="100" y1="80" x2="220" y2="150" />
      <line class="constellation-line" x1="220" y1="150" x2="350" y2="100" />
      <line class="constellation-line" x1="220" y1="150" x2="180" y2="280" />
      <line class="constellation-line" x1="350" y1="100" x2="400" y2="230" />
      <line class="constellation-line" x1="180" y1="280" x2="320" y2="320" />
      <line class="constellation-line" x1="400" y1="230" x2="320" y2="320" />
      <line class="constellation-line" x1="320" y1="320" x2="250" y2="420" />
      <line class="constellation-line" x1="180" y1="280" x2="80" y2="380" />
      <line class="constellation-line" x1="80" y1="380" x2="250" y2="420" />
      <line class="constellation-line" x1="250" y1="420" x2="400" y2="450" />
      <line class="constellation-line" x1="400" y1="450" x2="350" y2="540" />
      <line class="constellation-line" x1="250" y1="420" x2="350" y2="540" />
      <line class="constellation-line" x1="100" y1="80" x2="180" y2="280" />
      <line class="constellation-line" x1="350" y1="100" x2="320" y2="320" />
      <line class="constellation-line" x1="80" y1="380" x2="150" y2="520" />
      <line class="constellation-line" x1="150" y1="520" x2="350" y2="540" />
      <line class="constellation-line" x1="400" y1="230" x2="400" y2="450" />

      <!-- Nodes -->
      <g class="constellation-node constellation-node-1">
        <circle cx="100" cy="80" r="3" />
        <text x="100" y="65">PHP</text>
      </g>
      <g class="constellation-node constellation-node-2">
        <circle cx="220" cy="150" r="3" />
        <text x="220" y="135">Laravel</text>
      </g>
      <g class="constellation-node constellation-node-3">
        <circle cx="350" cy="100" r="3" />
        <text x="350" y="85">Vue</text>
      </g>
      <g class="constellation-node constellation-node-4">
        <circle cx="400" cy="230" r="3" />
        <text x="400" y="215">JavaScript</text>
      </g>
      <g class="constellation-node constellation-node-5">
        <circle cx="180" cy="280" r="3" />
        <text x="180" y="265">MySQL</text>
      </g>
      <g class="constellation-node constellation-node-6">
        <circle cx="320" cy="320" r="3" />
        <text x="320" y="305">Go</text>
      </g>
      <g class="constellation-node constellation-node-7">
        <circle cx="80" cy="380" r="3" />
        <text x="80" y="365">MongoDB</text>
      </g>
      <g class="constellation-node constellation-node-8">
        <circle cx="250" cy="420" r="3" />
        <text x="250" y="405">AI &amp; ML</text>
      </g>
      <g class="constellation-node constellation-node-9">
        <circle cx="400" cy="450" r="3" />
        <text x="400" y="435">WordPress</text>
      </g>
      <g class="constellation-node constellation-node-10">
        <circle cx="150" cy="520" r="3" />
        <text x="150" y="505">Leaflet</text>
      </g>
      <g class="constellation-node constellation-node-11">
        <circle cx="350" cy="540" r="3" />
        <text x="350" y="525">Data Engineering</text>
      </g>
    </svg>
  </div>

  <div class="hero-content">
    <div class="hero-greeting">// Hello, World</div>

    <h1 class="hero-name">
      <span class="line">I'm <em>Ben Payne</em>,</span>
      <span class="line">Full Stack Developer.</span>
    </h1>

    <div class="status-pill hidden!">
      <span class="status-dot"></span>
      Available for new opportunities
    </div>

    <p class="hero-desc">
      15+ years building responsive, high-performance web applications. I bring expertise in
      PHP, Laravel, Vue, JavaScript, MySQL — plus AI and Data Engineering. Driven by learning
      new things and being challenged.
    </p>

    <div class="hero-cta">
      <a href="#section-contact" class="btn btn-primary magnetic">
        Let's Talk
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
          <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clip-rule="evenodd" />
        </svg>
      </a>
      <a href="https://github.com/benpaynedev?tab=repositories" target="_blank" class="btn btn-secondary magnetic">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>
      <button type="button" class="btn btn-secondary magnetic" data-resume-modal>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          Resume
        </button>
    </div>
  </div>

  <div class="hero-scroll-hint">
    <div class="scroll-line"></div>
  </div>
</section>

<!-- Marquee -->
<div class="marquee-strip">
  <div class="marquee-track">
    <span class="marquee-item">SaaS Platforms</span>
    <span class="marquee-item">15+ Years Building</span>
    <span class="marquee-item">Financial Software</span>
    <span class="marquee-item">Millions in Transactions</span>
    <span class="marquee-item">AI Classifiers</span>
    <span class="marquee-item">3 Industries Served</span>
    <span class="marquee-item">Data Pipelines</span>
    <span class="marquee-item">CRM Systems</span>
    <span class="marquee-item">IVR & Call Routing</span>
    <span class="marquee-item">Geolocation Mapping</span>
    <span class="marquee-item">Legacy to Modern</span>
    <span class="marquee-item">SaaS Platforms</span>
    <span class="marquee-item">15+ Years Building</span>
    <span class="marquee-item">Financial Software</span>
    <span class="marquee-item">Millions in Transactions</span>
    <span class="marquee-item">AI Classifiers</span>
    <span class="marquee-item">3 Industries Served</span>
    <span class="marquee-item">Data Pipelines</span>
    <span class="marquee-item">CRM Systems</span>
    <span class="marquee-item">IVR & Call Routing</span>
    <span class="marquee-item">Geolocation Mapping</span>
    <span class="marquee-item">Legacy to Modern</span>
  </div>
</div>

<!-- Work -->
<section class="work-section" id="section-work">
  <div class="reveal">
    <span class="section-label">Experience</span>
    <h2 class="section-title">Where I've Worked</h2>
  </div>

  <div class="timeline">
    <!-- NSA -->
    <div class="timeline-item reveal reveal-delay-1">
      <div class="timeline-dot"></div>
      <span class="timeline-date">2022 — Present</span>
      <div class="work-card">
        <h3>National Service Alliance</h3>
        <div class="tech-tags">
          <span class="tech-tag">LAMP</span>
          <span class="tech-tag">jQuery</span>
          <span class="tech-tag">Bootstrap</span>
          <span class="tech-tag">Leaflet</span>
          <span class="tech-tag">Go</span>
          <span class="tech-tag">AI</span>
        </div>
        <ul>
          <li>Modernized legacy monolith — 10k+ lines changed, upgrading PHP 5.3 → 8.4.</li>
          <li>Automated On Demand servicer onboarding, streamlining several hundred data entry points.</li>
          <li>Developed an AI classifier to handle fuzzy customer responses to automated text messages.</li>
          <li>Created mission-critical call routing software handling hundreds of calls/month using geolocation mapping.</li>
          <li>Developed an AI-powered IVR for instant servicer and customer information retrieval.</li>
        </ul>
      </div>
    </div>

    <!-- AnswerNet -->
    <div class="timeline-item reveal reveal-delay-2">
      <div class="timeline-dot"></div>
      <span class="timeline-date">2022</span>
      <div class="work-card">
        <h3>AnswerNet TPV</h3>
        <div class="tech-tags">
          <span class="tech-tag">LAMP</span>
          <span class="tech-tag">Laravel</span>
          <span class="tech-tag">Vue</span>
          <span class="tech-tag">jQuery</span>
          <span class="tech-tag">Bootstrap</span>
          <span class="tech-tag">MongoDB</span>
        </div>
        <ul>
          <li>Created a streamlined dashboard for monitoring and reporting on third-party verification calls for energy sales.</li>
          <li>Streamlined IVR handling for thousands of calls per day.</li>
        </ul>
      </div>
    </div>

    <!-- Northpointe -->
    <div class="timeline-item reveal reveal-delay-3">
      <div class="timeline-dot"></div>
      <span class="timeline-date">2015 — 2022</span>
      <div class="work-card">
        <h3>Northpointe Bank</h3>
        <div class="tech-tags">
          <span class="tech-tag">LAMP</span>
          <span class="tech-tag">Laravel</span>
          <span class="tech-tag">Vue</span>
          <span class="tech-tag">jQuery</span>
          <span class="tech-tag">Bootstrap</span>
        </div>
        <ul>
          <li>Built custom customer onboarding software handling millions of dollars in transactions yearly.</li>
          <li>Created B2B SaaS Correspondent Lending software moving millions in loans every year.</li>
          <li>Developed loan document tracking software for thousands of original loan documents annually.</li>
          <li>Created loan officer CRM covering origination, underwriting, and closing workflows.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Contact -->
<section class="contact-section" id="section-contact">
  <div class="contact-grid">
    <div class="contact-info">
      <div class="reveal">
        <span class="section-label">Get in Touch</span>
        <h2 class="section-title">Let's <span class="cycling-word is-idle" ref="cyclingWordRef"
            :class="cyclingClasses"><em>{{ displayedText }}</em></span> <br class="max-[480px]:block hidden">Something</h2>
      </div>
      <div class="reveal reveal-delay-1">
        <p class="contact-text">
          I'm always interested in hearing about <strong>new projects</strong> and <strong>opportunities</strong>.
          Whether you have a question or just want to say hi, send me a note and I'll get back to you!
        </p>
        <div class="contact-links">
          <a href="https://github.com/benpaynedev?tab=repositories" target="_blank" class="contact-link magnetic">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <button type="button" class="contact-link magnetic" data-resume-modal>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              Resume
            </button>
        </div>
      </div>
    </div>

    <form class="contact-form reveal reveal-delay-2" @submit.prevent="onSubmit" novalidate>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" placeholder="Your name" autocomplete="name"
               v-model="name" v-bind="nameAttrs"
        >
        <p v-if="errorBag.name">
          Please enter your name
        </p>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Your email" autocomplete="email"
               v-model="email" v-bind="emailAttrs"
        >
        <p v-if="errorBag.email">
          Please enter your email
        </p>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea name="message" id="message" placeholder="What's on your mind?"
                  v-model="message" v-bind="messageAttrs"
        ></textarea>
        <p v-if="errorBag.message">
          Please enter your message
        </p>
      </div>
      <button type="submit" class="btn btn-primary btn-submit magnetic" :class="{submitted: sent}" :disabled="sending" >
        <span v-text="sendButtonText"></span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
      </button>
    </form>
  </div>
</section>

<!-- Footer -->
<footer>
  <span id="copyright">© <NuxtTime :datetime="Date.now()" year="numeric" /> Ben Payne</span>
</footer>

<!-- Resume Modal -->
<UModal v-model:open="resumeModalOpen" title="Resume" description="Choose a format to view or download.">
  <template #body>
    <div class="resume-modal-options">
      <a href="/Benjamin_Payne_Resume.pdf" target="_blank" class="resume-modal-option" @click="resumeModalOpen = false">
        <div class="resume-modal-option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        </div>
        <div>
          <div class="resume-modal-option-title">View PDF</div>
          <div class="resume-modal-option-desc">Opens in a new tab</div>
        </div>
      </a>
      <button type="button" class="resume-modal-option" @click="downloadPlainTextResume(); resumeModalOpen = false">
        <div class="resume-modal-option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        </div>
        <div>
          <div class="resume-modal-option-title">Download for HR Software</div>
          <div class="resume-modal-option-desc">ATS-friendly format for Workday, Greenhouse, Lever, iCIMS, Taleo, etc.</div>
        </div>
      </button>
    </div>
  </template>
</UModal>
</template>
