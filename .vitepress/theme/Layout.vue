<template>
  <Layout>
    <!-- <template #nav-bar-content-before>
      <span class="ml-4 relative flex h-3 w-3">
        <span class="animate-ping absolute h-full w-full rounded-full bg-green opacity-75" />
        <span class="h-full w-full rounded-full bg-green" />
      </span>
    </template> -->

    <template #doc-before v-if="currentPost">
      <div class="vp-doc">
        <h1>{{ currentPost.title }}</h1>
        <p class="mt-2 space-x-2">
          <Badge type="tip">{{ new Date(currentPost.create).toISOString().split('T')[0] }}</Badge>
          <Badge type="info" v-for="tag in currentPost.tags" :key="tag">{{ tag }}</Badge>
        </p>

        <div class="custom-block quote" v-if="currentPostSummary">
          <p class="custom-block-title flex items-center gap-0.5em">
            <svg
              fill="currentColor"
              height="1em"
              viewBox="0 0 24 24"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
              />
            </svg>
            DeepSeek 生成的摘要
          </p>
          <p>{{ currentPostSummary }}</p>
        </div>
      </div>
    </template>

    <template #doc-after v-if="page.frontmatter.comment ?? true">
      <div class="VPDoc vp-doc">
        <h2 id="giscus">评论</h2>
      </div>
      <Giscus
        id="giscus"
        :key="page.relativePath"
        v-bind="theme.giscus"
        :theme="isDark ? 'transparent_dark' : 'light'"
      />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'
import mediumZoom from 'medium-zoom'
import { animate, stagger, spring } from 'motion'

import { data as posts } from '../posts.data'
import type { Post, ThemeConfig } from '.'
import { springScrollToElement } from './utils'

import summaries from '@/summaries.json'

const { Layout } = DefaultTheme
const { page, theme, frontmatter, isDark } = useData<ThemeConfig>()

// Load fonts
onMounted(() =>
  import('webfontloader').then((webfont) =>
    webfont.load({
      google: {
        families: ['JetBrains Mono:400,500,600,700'],
      },
    })
  )
)

// Trigger on page change (immediate)
onMounted(() => {
  watch(
    () => page.value.relativePath,
    async () => {
      // Wait for the DOM to update
      await nextTick()

      // Random taglines
      const taglineElement = document.querySelector('.tagline')
      if (taglineElement)
        taglineElement.innerHTML =
          theme.value.taglines[Math.floor(Math.random() * theme.value.taglines.length)]

      // Animate home page elements
      if (frontmatter.value.layout === 'home') {
        const homeAnim = { type: spring, bounce: 0.5, duration: 0.5 }

        animate('.main .name', { opacity: 1, x: [-200, 0] }, { ...homeAnim })
        animate('.main .text', { opacity: 1, x: [200, 0] }, { ...homeAnim })
        animate('.main .tagline', { y: [50, 0] }, { ...homeAnim })
        animate('.main .action', { y: [50, 0] }, { ...homeAnim, delay: stagger(0.05) })
      }

      // Animate outline link scrolls
      document.querySelectorAll<HTMLLinkElement>('.outline-link').forEach((element) => {
        const id = decodeURIComponent(element.href.split('#')[1])
        console.log(id)
        element.onclick = () => {
          const target = document.getElementById(id)
          if (!target) return
          springScrollToElement(target)
        }
      })
    },
    { immediate: true }
  )
})

// Trigger on page change (not immediate)
onMounted(() => {
  watch(
    () => page.value.relativePath,
    async () => {
      animate('.VPContent', { opacity: [0, 1] }, { ease: 'easeInOut', duration: 0.2 })
    }
  )
})

// Current post & summary
const currentPost = ref<Post | undefined>(undefined)
const currentPostSummary = computed(() => {
  const postId = currentPost.value?.id as keyof typeof summaries | undefined
  if (postId && summaries[postId]) return summaries[postId]
})
watch(
  () => page.value.relativePath,
  (newPath) => {
    // Find current post
    const postId = newPath.match(/posts\/(.*)\//)?.[1]
    currentPost.value = postId ? posts.find((post) => post.id === postId) : undefined
  },
  { immediate: true }
)

// Process markdown image
const mdImgSelector = '.vp-doc img'
onMounted(() => {
  watch(
    () => currentPost.value,
    async (post) => {
      if (!post) return
      await nextTick() // Wait for the DOM to update

      // Append alt text to images
      document.querySelectorAll(mdImgSelector).forEach((img) => {
        const alt = img.attributes.getNamedItem('alt')
        if (!alt) return

        const node = document.createElement('div')
        node.classList.add('img-alt')
        node.innerText = alt.value

        const parent = img.parentNode!
        if (parent.lastChild === img) parent.appendChild(node)
        else parent.insertBefore(node, img.nextSibling)
      })

      // Apply medium-zoom
      mediumZoom(mdImgSelector, {
        background: 'rgba(0, 0, 0, 0.5)',
      })
    },
    { immediate: true }
  )
})
</script>

<style lang="scss">
.post-header {
  margin-bottom: 64px;
}

.post-title {
  font-weight: 600;
  outline: none;
  line-height: 40px;
  font-size: 32px;
}
</style>
