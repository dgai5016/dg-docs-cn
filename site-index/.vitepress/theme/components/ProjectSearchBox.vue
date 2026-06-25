<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import projectsData from '../../projects.json'

interface Project {
  name: string
  title: string
  description?: string
  framework?: string
  status?: string
  url: string
}

const projects = projectsData as Project[]

const emit = defineEmits<{
  (e: 'close'): void
}>()

const shellEl = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()

const filterText = ref('')
const selectedIndex = ref(-1)

const q = computed(() => filterText.value.trim().toLowerCase())

const results = computed<Project[]>(() => {
  if (!q.value) return []
  return projects.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(q.value) ||
      (p.description || '').toLowerCase().includes(q.value)
  )
})

watch(results, () => {
  selectedIndex.value = results.value.length ? 0 : -1
  scrollToSelectedResult()
})

const disableReset = computed(() => filterText.value.length <= 0)

function focusSearchInput(select = true) {
  searchInput.value?.focus()
  if (select) searchInput.value?.select()
}

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    focusSearchInput()
  }
}

function scrollToSelectedResult() {
  nextTick(() => {
    shellEl.value
      ?.querySelector('.result.selected')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value =
      selectedIndex.value <= 0
        ? results.value.length - 1
        : selectedIndex.value - 1
    scrollToSelectedResult()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value =
      selectedIndex.value >= results.value.length - 1
        ? 0
        : selectedIndex.value + 1
    scrollToSelectedResult()
  } else if (event.key === 'Enter') {
    if (event.isComposing) return
    const selected = results.value[selectedIndex.value]
    if (selected) {
      event.preventDefault()
      window.open(selected.url, '_blank', 'noopener')
      emit('close')
    }
  } else if (event.key === 'Escape') {
    emit('close')
  }
}

function escapeHtml(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlight(text: string): string {
  const safe = escapeHtml(text)
  const query = q.value
  if (!query) return safe
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return safe.replace(new RegExp(escapedQuery, 'gi'), (m) => `<mark>${m}</mark>`)
}

function onMouseMove(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('.result')
  const index = Number.parseInt(target?.dataset.index || '-1')
  if (index >= 0 && index !== selectedIndex.value) {
    selectedIndex.value = index
  }
}

function resetSearch() {
  filterText.value = ''
  nextTick().then(() => focusSearchInput(false))
}

function onPopState() {
  emit('close')
}

let prevOverflow = ''

onMounted(() => {
  focusSearchInput()
  document.addEventListener('keydown', onKeyDown)
  prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  window.history.pushState(null, '', window.location.href)
  window.addEventListener('popstate', onPopState)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('popstate', onPopState)
  document.body.style.overflow = prevOverflow
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="shellEl"
      role="button"
      :aria-owns="results.length ? 'localsearch-list' : undefined"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-labelledby="localsearch-label"
      class="VPLocalSearchBox"
    >
      <div class="backdrop" @click="emit('close')" />

      <div class="shell">
        <form
          class="search-bar"
          @pointerup="onSearchBarClick($event)"
          @submit.prevent=""
        >
          <label
            title="搜索项目"
            id="localsearch-label"
            for="localsearch-input"
          >
            <span
              aria-hidden="true"
              class="vpi-search search-icon local-search-icon"
            />
          </label>
          <div class="search-actions before">
            <button
              class="back-button"
              title="关闭搜索"
              type="button"
              @click="emit('close')"
            >
              <span class="vpi-arrow-left local-search-icon" />
            </button>
          </div>
          <input
            ref="searchInput"
            v-model="filterText"
            :aria-activedescendant="
              selectedIndex > -1 ? 'localsearch-item-' + selectedIndex : undefined
            "
            aria-autocomplete="both"
            :aria-controls="results.length ? 'localsearch-list' : undefined"
            aria-labelledby="localsearch-label"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="search-input"
            id="localsearch-input"
            enterkeyhint="go"
            maxlength="64"
            placeholder="搜索项目标题或描述"
            spellcheck="false"
            type="search"
          />
          <div class="search-actions">
            <button
              class="clear-button"
              type="reset"
              :disabled="disableReset"
              title="清除"
              @click="resetSearch"
            >
              <span class="vpi-delete local-search-icon" />
            </button>
          </div>
        </form>

        <ul
          :id="results.length ? 'localsearch-list' : undefined"
          :role="results.length ? 'listbox' : undefined"
          :aria-labelledby="results.length ? 'localsearch-label' : undefined"
          class="results"
          @mousemove="onMouseMove"
        >
          <li
            v-for="(p, index) in results"
            :key="p.name"
            :id="'localsearch-item-' + index"
            :aria-selected="selectedIndex === index ? 'true' : 'false'"
            role="option"
          >
            <a
              :href="p.url"
              target="_blank"
              rel="noopener"
              class="result"
              :class="{ selected: selectedIndex === index }"
              :aria-label="p.title"
              @mouseenter="selectedIndex = index"
              @focusin="selectedIndex = index"
              @click="emit('close')"
              :data-index="index"
            >
              <div>
                <div class="titles">
                  <span class="title-icon">#</span>
                  <span class="title main">
                    <span class="text" v-html="highlight(p.title)" />
                  </span>
                  <span
                    v-if="p.framework"
                    class="framework-badge"
                  >{{ p.framework }}</span>
                </div>
                <div v-if="p.description" class="excerpt-wrapper">
                  <div
                    class="excerpt"
                    v-html="highlight(p.description)"
                  />
                </div>
              </div>
            </a>
          </li>
          <li
            v-if="filterText && !results.length"
            class="no-results"
          >
            没有匹配的项目 "<strong>{{ filterText }}</strong>"
          </li>
        </ul>

        <div class="search-keyboard-shortcuts">
          <span>
            <kbd aria-label="向上"><span class="vpi-arrow-up navigate-icon" /></kbd>
            <kbd aria-label="向下"><span class="vpi-arrow-down navigate-icon" /></kbd>
            导航
          </span>
          <span>
            <kbd aria-label="回车"><span class="vpi-corner-down-left navigate-icon" /></kbd>
            选择
          </span>
          <span>
            <kbd aria-label="关闭">esc</kbd>
            关闭
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.VPLocalSearchBox {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
  transition: opacity 0.5s;
}

.shell {
  position: relative;
  padding: 12px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-local-search-bg);
  width: min(100vw - 60px, 900px);
  height: min-content;
  max-height: min(100vh - 128px, 900px);
  border-radius: 6px;
}

@media (max-width: 767px) {
  .shell {
    margin: 0;
    width: 100vw;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}

.search-bar {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: text;
}

@media (max-width: 767px) {
  .search-bar {
    padding: 0 8px;
  }
}

.search-bar:focus-within {
  border-color: var(--vp-c-brand-1);
}

.local-search-icon {
  display: block;
  font-size: 18px;
}

.navigate-icon {
  display: block;
  font-size: 14px;
}

.search-icon {
  margin: 8px;
}

@media (max-width: 767px) {
  .search-icon {
    display: none;
  }
}

.search-input {
  padding: 6px 12px;
  font-size: inherit;
  width: 100%;
}

@media (max-width: 767px) {
  .search-input {
    padding: 6px 4px;
  }
}

.search-actions {
  display: flex;
  gap: 4px;
}

@media (any-pointer: coarse) {
  .search-actions {
    gap: 8px;
  }
}

@media (min-width: 769px) {
  .search-actions.before {
    display: none;
  }
}

.search-actions button {
  padding: 8px;
}

.search-actions button:not([disabled]):hover {
  color: var(--vp-c-brand-1);
}

.search-actions button.clear-button:disabled {
  opacity: 0.37;
}

.search-keyboard-shortcuts {
  font-size: 0.8rem;
  opacity: 75%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  line-height: 14px;
}

.search-keyboard-shortcuts span {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 767px) {
  .search-keyboard-shortcuts {
    display: none;
  }
}

.search-keyboard-shortcuts kbd {
  background: rgba(128, 128, 128, 0.1);
  border-radius: 4px;
  padding: 3px 6px;
  min-width: 24px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border: 1px solid rgba(128, 128, 128, 0.15);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.result {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  transition: none;
  line-height: 1rem;
  border: solid 2px var(--vp-local-search-result-border);
  outline: none;
  text-decoration: none;
  color: inherit;
}

.result > div {
  margin: 12px;
  width: 100%;
  overflow: hidden;
}

@media (max-width: 767px) {
  .result > div {
    margin: 8px;
  }
}

.titles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1001;
  padding: 2px 0;
}

.title.main {
  font-weight: 500;
}

.title-icon {
  opacity: 0.5;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.framework-badge {
  display: inline-block;
  padding: 1px 6px;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.result.selected {
  --vp-local-search-result-bg: var(--vp-local-search-result-selected-bg);
  border-color: var(--vp-local-search-result-selected-border);
}

.excerpt-wrapper {
  margin-top: 4px;
}

.excerpt {
  opacity: 0.65;
  font-size: 0.85rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result.selected .excerpt {
  opacity: 1;
}

.titles :deep(mark),
.excerpt :deep(mark) {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
}

.result.selected .titles,
.result.selected .title-icon {
  color: var(--vp-c-brand-1) !important;
}

.no-results {
  font-size: 0.9rem;
  text-align: center;
  padding: 12px;
}

svg {
  flex: none;
}
</style>
