<script setup lang="ts">
  import {computed} from 'vue'
  import {redirectTo} from '~/client/utils/constants.ts'
  import PVButton, {type ButtonProps} from 'primevue/button'
  import {stringify} from 'qs'
  const loginUrl = computed(() => {
    let redirectPath = '/'
    if (redirectTo.value && redirectTo.value.path !== '/login') {
      redirectPath = redirectTo.value.path
    }
    return `/api/auth/authorize${stringify({
      redirect_to: redirectPath
    }, {
      addQueryPrefix: true
    })}`
  })
  const pvButtonProps : ButtonProps = {
    label: 'Login with Netlify',
    pt: {
      root: 'bg-transparent dark:hover:bg-neutral-000 hover:bg-neutral-light-800 border-1 border-neutral-light-800 border-rounded-1.5 border-solid dark:border-neutral-000 cursor-pointer flex font-600 font-inherit gap-x-4 group items-center max-w-full p-x-10 p-y-3 text-4.5 text-inherit dark:hover:text-neutral-light-800 hover:text-neutral-000 transition-duration-250 w-90'
    }
  }
</script>
<template>
  <div class="box-border flex flex-col h-full m-x-auto lg:max-w-200 sm:max-w-148 xl:max-w-250 p-6 p-b-0 sm:p-x-0 sm:p-t-6 w-full">
    <svg class="h-10 self-start" viewBox="0 0 512 209" xmlns="http://www.w3.org/2000/svg">
      <path class="fill-teal-800 dark:fill-neutral-000 transition-duration-250" d="m212.06,108.73l-1.09,1.09h-33.88l-1.09,1.09c0,2.19,2.19,8.74,10.93,8.74,3.28,0,6.56-1.09,7.65-3.28l1.09-1.09h13.12l1.09,1.09c-1.09,6.56-6.56,16.4-22.95,16.4-18.58,0-27.33-13.12-27.33-28.42s8.74-28.42,26.23-28.42,26.23,13.12,26.23,28.42v4.37h0Zm-16.4-10.93c0-1.09-1.09-8.74-9.84-8.74s-9.84,7.65-9.84,8.74l1.09,1.09h17.49l1.09-1.09Zm47,17.49c0,2.19,1.09,3.28,3.28,3.28h9.84l1.09,1.09v10.93l-1.09,1.09h-9.84c-9.84,0-18.58-4.37-18.58-16.4v-24.05l-1.09-1.09h-7.65l-1.09-1.09v-10.93l1.09-1.09h7.65l1.09-1.09v-9.84l1.09-1.09h13.12l1.09,1.09v9.84l1.09,1.09h12.02l1.09,1.09v10.93l-1.09,1.09h-12.02l-1.09,1.09v24.05h0Zm40.44,16.4h-13.12l-1.09-1.09V56.26l1.09-1.09h13.12l1.09,1.09v74.32l-1.09,1.09Zm29.51-63.39h-13.12l-1.09-1.09v-10.93l1.09-1.09h13.12l1.09,1.09v10.93l-1.09,1.09Zm0,63.39h-13.12l-1.09-1.09v-52.46l1.09-1.09h13.12l1.09,1.09v52.46l-1.09,1.09Zm51.37-75.42v10.93l-1.09,1.09h-9.84c-2.19,0-3.28,1.09-3.28,3.28v4.37l1.09,1.09h10.93l1.09,1.09v10.93l-1.09,1.09h-10.93l-1.09,1.09v39.35l-1.09,1.09h-13.12l-1.09-1.09v-39.35l-1.09-1.09h-7.65l-1.09-1.09v-10.93l1.09-1.09h7.65l1.09-1.09v-4.37c0-12.02,8.74-16.4,18.58-16.4h9.84l1.09,1.09h0Zm40.44,76.51c-4.37,10.93-8.74,17.49-24.05,17.49h-5.47l-1.09-1.09v-10.93l1.09-1.09h5.47c5.46,0,6.56-1.09,7.65-4.37v-1.09l-17.49-42.63v-10.93l1.09-1.09h9.84l1.09,1.09,13.12,37.16h1.09l13.12-37.16,1.09-1.09h9.84l1.09,1.09v10.93l-17.49,43.72h0Zm-268.97-1.09l-1.09-1.09v-31.67c0-5.46-2.14-9.7-8.74-9.84-3.39-.09-7.27,0-11.42.17l-.62.63v40.7s-1.09,1.09-1.09,1.09h-13.11l-1.09-1.09v-53.05l1.09-1.09,29.51-.27c14.78,0,20.77,10.16,20.77,21.62v32.79l-1.09,1.09h-13.12Z"/>
      <path class="fill-teal-400 dark:fill-teal-200 transition-duration-250" d="m117.44,207.04v-52.43l1.09-1.09h10.92l1.09,1.09v52.43l-1.09,1.09h-10.92l-1.09-1.09Zm0-153.51V1.09L118.53,0h10.92l1.09,1.09v52.43l-1.09,1.09h-10.92l-1.09-1.09Zm-47.48,115.72h-1.54l-7.72-7.73v-1.54l18.03-18.03h8.18s1.1,1.09,1.1,1.09v8.18l-18.04,18.03Zm0-130.35h-1.54l-7.72,7.73v1.54l18.03,18.03h8.18s1.1-1.09,1.1-1.09v-8.18l-18.04-18.03ZM1.09,97.51h74.28l1.09,1.09v10.92l-1.09,1.09H1.09l-1.09-1.09v-10.92l1.09-1.09Zm439.91,0h69.91l1.09,1.09v10.92l-1.09,1.09h-74.28l-1.09-1.09,4.37-10.92,1.09-1.09Z"/>
    </svg>
    <div class="flex flex-1 flex-col gap-6 items-center justify-center w-full">
      <a class="decoration-none max-w-full text-inherit" v-bind:href="loginUrl">
        <PVButton v-bind="pvButtonProps">
          <template v-slot:icon>
            <svg class="h-8 w-8" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path class="fill-teal-800 dark:fill-neutral-000 dark-group-hover:fill-teal-800 group-hover:fill-neutral-000 transition-duration-250" d="m30.17,30.86h-3.29l-.27-.27v-7.7c0-1.37-.54-2.43-2.19-2.47-.85-.02-1.82,0-2.86.04l-.16.16v9.97l-.27.27h-3.29l-.27-.27v-13.16l.27-.27h7.41c2.88,0,5.21,2.33,5.21,5.21v8.23l-.27.27Z"/>
              <path class="fill-teal-400 dark:fill-teal-200 dark:group-hover:fill-teal-400 group-hover:fill-teal-200 transition-duration-250" d="m21.97,46.78v-10.93l.29-.29h3.48l.29.29v10.93l-.29.29h-3.48l-.29-.29Zm0-34.63V1.22l.29-.29h3.48l.29.29v10.93l-.29.29h-3.48l-.29-.29Zm-9.19,26.53h-.48l-2.39-2.39v-.48l3.18-3.19h2.53s.34.34.34.34v2.53l-3.18,3.19Zm-2.87-26.37v-.48l2.39-2.39h.48l3.19,3.19v2.53l-.34.34h-2.53l-3.19-3.19ZM.29,21.97h12.3l.29.29v3.48l-.29.29H.29L0,25.74v-3.48l.29-.29Zm47.42,4.07h-12.3l-.29-.29v-3.48l.29-.29h12.3l.29.29v3.48l-.29.29Z"/>
            </svg>
          </template>
        </PVButton>
      </a>
      <p class="m-0 opacity-50 text-3.5">Please ensure you've signed into <a
       class="font-600 text-inherit"
       href="https://app.netlify.com/"
       rel="nofollow noopener noreferrer"
       target="_blank">app.netlify.com</a> before attempting to login.</p>
    </div>
  </div>
</template>