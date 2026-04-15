<template>
  <div class="downloads-page">
    <div class="downloads-card">
      <div class="header-icon">
        <UIcon name="i-heroicons-check" v-if="success"/>
        <UIcon name="i-heroicons-lock-closed" v-else/>
      </div>
      <h1 class="filename">{{ filename }}</h1>
      <template v-if="success === false">
        <p class="subtitle">This file is password protected.</p>
        <form ref="formRef" class="downloads-form">
          <input
              ref="passwordRef"
              type="password"
              class="password-input"
              placeholder="Enter password"
              autocomplete="current-password"
          />
          <button ref="submitRef" type="submit" class="download-btn" :disabled="loading">
            <UIcon v-if="loading" name="i-heroicons-arrow-path" class="spin"/>
            <UIcon v-else name="i-heroicons-arrow-down-tray"/>
            {{ loading ? 'Verifying…' : 'Download' }}
          </button>
        </form>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const filename = computed(() => route.params.filename as string)

useHead({title: `Download — ${filename.value}`})

const formRef = ref<HTMLFormElement | null>(null)
const passwordRef = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const errorMsg = ref('')
const success = ref(false)

let handleSubmit: (e: Event) => void

onMounted(() => {
  handleSubmit = async (e: Event) => {
    e.preventDefault()
    errorMsg.value = ''
    loading.value = true

    try {
      const data = await $fetch<{ url: string }>(`/api/download/${filename.value}`, {
        method: 'POST',
        body: {password: passwordRef.value?.value ?? ''},
      })
      window.open(data.url, '_blank')
      success.value = true
    } catch (err: any) {
      const status = err?.statusCode ?? err?.response?.status
      if (status === 401) {
        errorMsg.value = 'Incorrect password.'
      } else if (status === 404) {
        errorMsg.value = 'File not found.'
      } else {
        errorMsg.value = 'Something went wrong. Please try again.'
      }
    } finally {
      loading.value = false
    }
  }

  formRef.value?.addEventListener('submit', handleSubmit)
})

onUnmounted(() => {
  formRef.value?.removeEventListener('submit', handleSubmit)
})
</script>

<style scoped>
.downloads-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  font-family: var(--font-body);
  padding: 2rem;
}

.downloads-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent-dim);
  border: 1px solid var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.filename {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text);
  word-break: break-all;
  text-align: center;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
  text-align: center;
}

.downloads-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.password-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.password-input:focus {
  border-color: var(--accent);
}

.password-input::placeholder {
  color: var(--text-muted);
}

.download-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--accent);
  color: #0a0a0f;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.download-btn:hover:not(:disabled) {
  opacity: 0.88;
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-msg {
  font-size: 0.875rem;
  color: #f87171;
  margin: 0;
  text-align: center;
}

.success-msg {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  font-family: var(--font-mono);
}
</style>
