<template>
  <div>
    <nav class="flex w-full py-4 justify-between fixed bg-white z-10">
      <div class="isolate relative flex items-center w-[145px] px-[0.5rem]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 mr-2">
          <path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
        </svg>
        <p class="text-lg/1 font-display">Ben Payne</p>
        <a href="/" class="absolute inset-1"></a>
      </div>
      <ul class="flex items-center">
        <li class="mx-1">
          <a href="#section-about" class="px-2 lg:px-4 py-2"
             :class="{active: currentPage === 'section-about'}"
          >
            About
          </a>
        </li>
        <li class="mx-1">
          <a href="#section-work" class="px-2 lg:px-4 py-2"
             :class="{active: currentPage === 'section-work'}"
          >
            Work
          </a>
        </li>
        <li class="mx-1">
          <a href="#section-contact" class="px-2 lg:px-4 py-2"
             :class="{active: currentPage === 'section-contact'}"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
    <div id="app" class="flex flex-col grow justify-between w-full min-h-screen">
      <!-- About -->
      <section id="section-about" class="flex justify-center items-center min-h-screen pt-14 bg-white">
        <div id="cta" class="max-w-[960px] px-[3%] lg:px-0 min-[1675px]:me-[2%]">
          <h1 id="cta-heading" class="lg:mt-0 text-5xl/22 sm:text-6xl/22 text-blue-400 font-extrabold tracking-tight">Hello!</h1>
          <div id="cta-body">
            <p class="text-xl/8 sm:text-3xl/11 mb-7">
              I'm Ben, I'm a Senior Full Stack developer at <a href="http://home.nationalservicealliance.com" class="underline" target="_blank">National Service Alliance</a>
              with 12+ years experience creating responsive, high-performance web applications. I bring expertise in PHP,
              Laravel, Vue, JavaScript, and MySQL as well as AI and Data Engineering. I'm driven by learning new things
              and being challenged. If you'd like to chat click
              <a href="#section-contact" class="underline">here</a>.
            </p>
            <div>
              <a href="https://github.com/benpaynedev?tab=repositories" class="block h-[25px] w-[23px]" target="_blank">
                <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                        fill="#24292f"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div id="cta-image" class="w-[600px] h-[600px] hidden min-[1675px]:block rounded-xl shadow-md"></div>
      </section>

      <!-- Work -->
      <section id="section-work" class="flex flex-col grow justify-center items-center min-h-screen pt-14 bg-white">
        <div class="w-full max-w-2xl px-[3%] lg:px-0">
          <h1 class="text-4xl text-slate-900 mb-8 mt-12 sm:mt-4">Where I've Worked</h1>
          <!-- Northpointe -->
          <VerticalTimelineEntry title="Northpointe Bank" date="2015-2022" :badges="['Laravel', 'Vue', 'WordPress']">
            <ul>
              <li class="mb-3">
                Created custom customer onboarding software for new banking accounts handling millions of dollars of transactions a year.
              </li>
              <li class="mb-3">
                Created custom B2B SaaS Correspondent Lending software moving millions of dollars in loans every year.
              </li>
              <li class="mb-3">
                Created custom loan document tracking software which tracked every original loan document for thousands of loans each year.
              </li>
              <li>
                Created custom loan officer CRM software allowing loan officers and customers to track a loan from origination, underwriting and closing.
              </li>
            </ul>
          </VerticalTimelineEntry>

         <!-- AnswerNet TPV -->
          <VerticalTimelineEntry title="AnswerNet TPV" date="2022-2022" :badges="['Laravel', 'Vue', 'MongoDB']">
            <ul>
              <li class="mb-3">
                Created a streamlined dashboard for monitoring and reporting on third party verification calls for energy sales.
              </li>
              <li>
                Streamlined IVR handling for thousands of calls a day.
              </li>
            </ul>
          </VerticalTimelineEntry>

          <!-- National Service Alliance -->
          <VerticalTimelineEntry title="National Service Alliance" date="2022 - " :badges="['PHP', 'Go', 'MySQL', 'AI', 'Leaflet']">
            <ul>
              <li class="mb-3">
                Modernized legacy monolith changing 10k+ lines of code and upgrading PHP from version 5.3 to version 8.4.
              </li>
              <li class="mb-3">
                Automated On Demand servicer onboarding process streamlining several hundred data entry points.
              </li>
              <li class="mb-3">
                Developed an AI classifier to better handle fuzzy customer responses to automated text messages.
              </li>
              <li>
                Created mission critical call routing software handling thousands of calls a month, allowing users to
                distribute calls across a geographical area using geolocation mapping software.
              </li>
            </ul>
          </VerticalTimelineEntry>
        </div>
      </section>

      <!-- Contact -->
      <section id="section-contact" class="flex flex-col grow justify-center items-center min-h-screen pt-14 bg-white">
        <Form class="w-full max-w-2xl px-[3%] lg:px-0" @submit="onSubmit">
          <h1 class="text-4xl text-slate-900 mb-10">Contact Me</h1>
          <div class="mb-5">
            <label for="name" class="block mb-2 text-sm/6 font-medium text-gray-900">Name</label>
            <div class="relative w-full rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-slate-600">
              <Field type="text" name="name" id="name" class="block w-full pl-4 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                     placeholder="John Smith" v-model="name" rules="name"
              />
              <ErrorMessage as="div" name="name" v-slot="{ message}">
                <p class="absolute top-[20%] right-[2%] text-sm text-red-400">{{ message }}</p>
              </ErrorMessage>
            </div>
          </div>

          <div class="mb-5">
            <label for="email" class="block mb-2 text-sm/6 font-medium text-gray-900">Email</label>
            <div class="relative w-full rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-slate-600">
              <Field type="email" name="email" id="email" class="block w-full pl-4 py-1.5 w-100 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                     placeholder="john.smith@email.com" v-model="email" rules="email"
              />
              <ErrorMessage as="div" name="email" v-slot="{ message }">
                <p class="absolute top-[20%] right-[2%] text-sm text-red-400">{{ message }}</p>
              </ErrorMessage>
            </div>
          </div>

          <div class="mb-5 relative">
            <label for="message" class="block mb-2 text-sm/6 font-medium text-gray-900">Message</label>
            <Field as="textarea" name="message" id="message" rows="5" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-slate-600 sm:text-sm/6"
                   placeholder="Send a note to me..." v-model="message" rules="message"
            />
            <ErrorMessage as="div" name="message" v-slot="{ message }">
              <p class="absolute top-[25%] right-[2%] text-sm text-red-400">{{ message }}</p>
            </ErrorMessage>
          </div>

          <div>
            <button type="submit" class="rounded-md cursor-pointer bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 disabled:pointer-events-none"
                    :disabled="sending" v-text="sending ? 'Sending...' : 'Send'"
            />
          </div>
        </Form>
      </section>
    </div>
  </div>
</template>

<style>
  nav a.active { text-decoration: underline }

  #cta-heading {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  }

  #cta-heading .char {
    transform: translateY(115px);
  }

  #cta-body {
    opacity: 0;
  }

  #cta-image {
    opacity: 0;
    transform: translateX(50px);
    background-image: linear-gradient(
    45deg,
    hsl(212deg 100% 66%) 0%,
    hsl(213deg 100% 68%) 2%,
    hsl(214deg 100% 70%) 4%,
    hsl(215deg 100% 72%) 6%,
    hsl(215deg 100% 74%) 9%,
    hsl(216deg 100% 76%) 13%,
    hsl(216deg 100% 77%) 17%,
    hsl(217deg 100% 79%) 21%,
    hsl(217deg 100% 80%) 26%,
    hsl(218deg 100% 82%) 31%,
    hsl(218deg 100% 83%) 37%,
    hsl(219deg 100% 84%) 43%,
    hsl(219deg 100% 86%) 49%,
    hsl(219deg 100% 87%) 55%,
    hsl(220deg 100% 88%) 61%,
    hsl(220deg 100% 89%) 67%,
    hsl(220deg 100% 91%) 73%,
    hsl(221deg 100% 92%) 78%,
    hsl(221deg 100% 93%) 82%,
    hsl(221deg 100% 94%) 86%,
    hsl(221deg 100% 95%) 90%,
    hsl(222deg 100% 97%) 93%,
    hsl(222deg 100% 98%) 96%,
    hsl(222deg 100% 99%) 98%,
    hsl(0deg 0% 100%) 100%
  );
  }
</style>

<script type="module">
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from '@/components/ui/toast/use-toast';
import VerticalTimelineEntry from "~/components/VerticalTimelineEntry.vue";
import {$fetch} from "ofetch";
import { gsap } from "gsap";
import { ScrollToPlugin } from 'gsap/all';
import SplitType from 'split-type';

const { toast } = useToast();
let config;

export default {
  components: {
    VerticalTimelineEntry,
    ErrorMessage,
    Form,
    Field
  },
  data() {
    return {
      currentPage: 'about',
      name: '',
      email: '',
      message: '',
      sending: false
    }
  },
  methods: {
    onSubmit: function(_, { resetForm }) {
      this.sending = true;

      const formData = new FormData()

      formData.append('from', `${this.name} <${this.email}>`);
      formData.append('to', `${config.public.WEBMASTER_EMAIL}`);
      formData.append('subject', `Website message from ${this.name}`);
      formData.append('text', this.message);

      $fetch("https://api.mailgun.net/v3/mail.benpayne.dev/messages", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`api:${config.public.MAILGUN_API_KEY}`)
        },
        body: formData,
      }).then(() => {
        toast({
          description: 'Your message has been sent.',
        });

        this.sending = false;
        resetForm();
      });
    },
    getSamePageAnchor: function(link){
      if (
          link.protocol !== window.location.protocol ||
          link.host !== window.location.host ||
          link.pathname !== window.location.pathname ||
          link.search !== window.location.search
      ) {
        return false;
      }

      return link.hash;
    },
    scrollToHash: function(hash, e) {
      const elem = hash ? document.querySelector(hash) : false;
      if(elem) {
        if(e) {
          e.preventDefault();
        }
        gsap.to(window, {scrollTo: {y: elem, autoKill: false}});
      }
    }
  },
  setup() {
    config = useRuntimeConfig();
    gsap.registerPlugin(ScrollToPlugin)
  },
  mounted() {
    document.body.style.opacity = 1;

    let sections = document.getElementsByTagName("section");

    let sectionsObserver = new IntersectionObserver((entries) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          this.currentPage = entry.target.id;
        }
      }
    }, {
      rootMargin: '-50% 0px',
    });

    for (let i = 0; i < sections.length; i++) {
      sectionsObserver.observe(sections[i]);
    }

    SplitType.create('#cta-heading', {types: 'chars'});

    let tl = gsap.timeline();

    tl.to('.char', {
      y: 0,
      delay: 0.2,
      stagger: 0.09,
      duration: 0.5
    })
    .to(['#cta-body', '#cta-image'], {
      x: 0,
      opacity: 1,
      delay: 0.2,
      duration: 0.75,
    });

    // If a link's href is within the current page, scroll to it instead
    document.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', e => {
        this.scrollToHash(this.getSamePageAnchor(a), e);
      });
    });

    // Scroll to the element in the URL's hash on load
    this.scrollToHash(window.location.hash);
  }
}
</script>
