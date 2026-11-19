<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import sidebar from '../sidebar.json'

const route = useRoute()
const KEY = 'qms-controls-last-page'

function flatten(items, out = []) {
  for (const item of items) {
    out.push(item)
    if (item.items) flatten(item.items, out)
  }
  return out
}
const pages = flatten(sidebar['/'])

const path = computed(() =>
  String(route.path).replace(/^\/qms-controls/, '').replace(/\.html$/, ''),
)
const isHome = computed(() => path.value === '/' || path.value === '')

const lastLink = ref('')
watch(path, () => {
  if (typeof window === 'undefined') return
  lastLink.value = window.localStorage.getItem(KEY) || ''
}, { immediate: true })
const lastPage = computed(() => pages.find((p) => p.link === lastLink.value))
</script>

<template>
  <a v-if="isHome && lastPage" class="continue-reading" :href="withBase(lastPage.link)">
    <span class="continue-reading__label">Continue where you left off</span>
    <span class="continue-reading__title">{{ lastPage.text }}</span>
    <span class="continue-reading__arrow" aria-hidden="true">→</span>
  </a>
</template>
