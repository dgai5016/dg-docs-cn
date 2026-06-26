---
layout: home

hero:
  name: 中文技术文档合集
  text: 英文技术文档中文翻译
  tagline: 保留源站 UI，本站直达译站
  actions:
    - theme: brand
      text: 浏览项目
      link: "#projects"
    - theme: alt
      text: GitHub
      link: https://github.com/dgai5016/dg-docs-cn
---

<script setup>
import projectsData from './.vitepress/projects.json'
</script>

<div class="projects-intro">

所有翻译项目按字母顺序排列，点击卡片进入对应的中文文档站点。

</div>

<div id="projects" class="projects-grid" v-if="projectsData.length > 0">
  <a
    v-for="p in projectsData"
    :key="p.name"
    :href="p.url"
    target="_blank"
    rel="noopener"
    class="project-card"
  >
    <div class="project-card-header">
      <span :class="['ssg-badge', `ssg-${p.ssg}`]">{{ p.ssg }}</span>
      <span class="project-status">{{ p.status === 'complete' ? '✅' : '🚧' }}</span>
    </div>
    <h3>{{ p.title }}</h3>
    <p class="project-desc">{{ p.description || '暂无描述' }}</p>
    <div class="project-meta">
      <span v-if="p.translatedAt" class="meta-item" :title="`翻译于 ${p.translatedAt}`">
        📅 {{ p.translatedAt }}
      </span>
      <a
        v-if="p.originalRepo"
        :href="p.originalRepo"
        @click.stop
        target="_blank"
        rel="noopener"
        class="original-link"
      >原文 ↗</a>
    </div>
    <div v-if="p.originalCommitDate" class="project-version" :title="`基于原文 commit ${p.originalCommitShort}`">
      <span class="version-label">基于原文</span>
      <span class="version-date">{{ p.originalCommitDate }}</span>
      <span v-if="p.updateCount > 0" class="version-updates">· 已更新 {{ p.updateCount }} 次</span>
    </div>
  </a>
</div>

<div v-else class="empty-state">

**暂无翻译项目**

新项目添加后会自动出现在这里。在本仓库内触发 `dg-docs-cn` skill 即可翻译一个新项目。

</div>

<style>
.projects-intro {
  margin: 2rem 0 1rem;
  color: var(--vp-c-text-2);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0 4rem;
}

.project-card {
  display: block;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  background: var(--vp-c-bg);
}

.project-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ssg-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ssg-badge.ssg-vitepress {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.ssg-badge.ssg-mkdocs {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.ssg-badge.ssg-mdbook {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.project-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  border-top: none;
  padding-top: 0;
}

.project-desc {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.project-version {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  padding-top: 0.4rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.version-label {
  color: var(--vp-c-text-3);
  margin-right: 0.25rem;
}

.version-date {
  color: var(--vp-c-brand);
  font-weight: 500;
}

.version-updates {
  color: var(--vp-c-text-3);
  margin-left: 0.25rem;
}

.original-link {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.original-link:hover {
  text-decoration: underline;
}

.empty-state {
  margin: 2rem 0 4rem;
  padding: 3rem 1.5rem;
  text-align: center;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
}
</style>
