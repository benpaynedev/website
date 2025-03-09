<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "VerticalTimelineEntry",
  props: {
    title: String,
    date: String,
    badges: Array,
  }
});
</script>

<template>
  <div class="relative pl-8 sm:pl-32 py-6 group">
    <!-- Vertical line (::before) ~ Date ~ Title ~ Circle marker (::after) -->
    <div class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-slate-400 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
      <time class="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-22 h-6 mb-3 sm:mb-0 text-blue-500 bg-blue-100 rounded-full">{{ date }}</time>
      <div class="flex items-center">
        <p class="text-xl font-bold text-slate-900 mr-3">
          {{ title }}
        </p>
        <span class="hidden lg:block text-[8px] font-bold mr-1 py-1 px-2 rounded-sm bg-slate-900 text-white" v-for="badge in badges">{{ badge }}</span>
      </div>
    </div>
    <!-- Content -->
    <div class="text-slate-500"><slot /></div>
  </div>
</template>

<style scoped>

</style>