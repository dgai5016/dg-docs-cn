import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

const projectSearchBoxPath = fileURLToPath(
  new URL('./theme/components/ProjectSearchBox.vue', import.meta.url)
)

export default defineConfig({
  lang: 'zh-CN',
  title: '英文技术文档中文翻译合集',
  description: '保留源站 UI，本站直达译站',
  base: '/dg-docs-cn/',
  cleanUrls: true,
  lastUpdated: true,

  vite: {
    plugins: [
      {
        name: 'dg-replace-local-search',
        enforce: 'pre',
        resolveId(source, importer) {
          if (
            source.endsWith('VPLocalSearchBox.vue') &&
            importer &&
            importer.includes('vitepress')
          ) {
            return projectSearchBoxPath
          }
          return null
        }
      }
    ]
  },

  themeConfig: {
    siteTitle: '英文技术文档中文翻译合集',

    // nav: [
    //   { text: '首页', link: '/' },
    //   {
    //     text: 'GitHub',
    //     link: 'https://github.com/dgai5016/dg-docs-cn'
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dgai5016/dg-docs-cn' }
    ],

    footer: {
      message: '基于各原项目的开源协议发布，本仓库仅提供中文翻译。',
      copyright: 'Copyright © 2026 dgai5016'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '本页内容'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdatedText: '最后更新',

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
