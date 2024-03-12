<script setup lang="ts">
  import type {CLoadingIndicatorProps} from '~/types/props.ts'
  const props = withDefaults(defineProps<CLoadingIndicatorProps>(), {
    size: 10
  })
</script>
<template>
  <svg
    class="fill-current"
    v-bind:height="props.size * 4"
    v-bind:width="props.size * 4"
    viewBox="0 0 128 128">
    <mask id="c-loading-mask">
      <path class="fill-neutral-000" d="M0,0v128h128V0H0z M81.2,82.3H46.8V45.7h34.4V82.3z"/>
    </mask>
    <g mask="url(#c-loading-mask)">
      <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-line-1 fill-teal-400 dark:fill-teal-200 transform-origin-center-top transition-duration-250" d="M58.94,34.75V8.42l.73-.73h8.8l.73,.73v26.33l-.73,.73h-8.8l-.73-.73Z"/>
      <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-line-2 fill-teal-400 dark:fill-teal-200 transform-origin-left-center transition-duration-250" d="M127.27,69.13h-35.11l-.73-.73v-8.8l.73-.73h35.11l.73,.73v8.8l-.73,.73Z"/>
      <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-line-3 fill-teal-400 dark:fill-teal-200 transform-origin-center-bottom transition-duration-250" d="M58.94,119.58v-26.33l.73-.73h8.8l.73,.73v26.33l-.73,.73h-8.8l-.73-.73Z"/>
      <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-line-4 fill-teal-400 dark:fill-teal-200 transform-origin-bottom-left transition-duration-250" d="M34.59,101.73h-1.21l-6.03-6.03v-1.21l9.22-9.22h6.39l.85,.85v6.39l-9.22,9.22Z"/>
      <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-line-5 fill-teal-400 dark:fill-teal-200 transform-origin-left-center transition-duration-250" d="M35.84,69.13H.73l-.73-.73v-8.8l.73-.73H35.84l.73,.73v8.8l-.73,.73Z"/>
      <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-line-6 fill-teal-400 dark:fill-teal-200 transform-origin-top-left transition-duration-250" d="M27.35,33.5v-1.21l6.03-6.03h1.21l9.22,9.22v6.39l-.85,.85h-6.39l-9.22-9.22Z"/>
    </g>
    <path class="animate-duration-1400 animate-iteration-count-infinite animate-name-c-loading-n fill-teal-800 dark:fill-neutral-000 transform-origin-center transition-duration-250" d="M80.45,82.29h-8.78l-.73-.73v-20.54c0-3.66-1.44-6.49-5.84-6.59-2.27-.06-4.86,0-7.64,.11l-.42,.43v26.59l-.73,.73h-8.78l-.73-.73V46.45l.73-.73h19.75c7.68,0,13.9,6.22,13.9,13.9v21.94l-.73,.73Z"/>
  </svg>
</template>
<style>
  @keyframes c-loading-line-1 {
    0% {
      opacity: 0;
      transform: translateY(-0.25rem);
    }
    60% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      transform: translateY(2.5rem);
    }
  }
  @keyframes c-loading-line-2 {
    0%,
    70% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(6.25rem);
    }
  }
  @keyframes c-loading-line-3 {
    0%,
    12% {
      opacity: 0;
      transform: translateY(0.25rem);
    }
    40%,
    60% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      transform: translateY(-2.5rem);
    }
  }
  @keyframes c-loading-line-4 {
    0%,
    9% {
      opacity: 0;
      transform: translate(-0.25rem, 0.25rem);
    }
    40%,
    63% {
      opacity: 1;
      transform: translate(0);
    }
    100% {
      transform: translate(1.875rem, -1.875rem);
    }
  }
  @keyframes c-loading-line-5 {
    0%,
    6% {
      opacity: 0;
      transform: translateX(-0.25rem);
    }
    40%,
    63% {
      opacity: 1;
      transform: translate(0);
    }
    100% {
      transform: translateX(5.71875rem);
    }
  }
  @keyframes c-loading-line-6 {
    0%,
    3% {
      opacity: 0;
      transform: translate(-0.25rem, -0.25rem);
    }
    40%,
    63% {
      opacity: 1;
      transform: translate(0);
    }
    100% {
      transform: translate(1.875rem, 1.875rem);
    }
  }
  @keyframes c-loading-n {
    0%,
    65% {
      transform: scale(1);
    }
    80% {
      transform: scale(0.8);
    }
    85% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>