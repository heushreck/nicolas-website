import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Nicolas Neudeck",
  description: "My personal website about AI Engineering.",
  appearance: false,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog' },
      { text: 'About', link: '/about' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/heushreck' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/nicolasneudeck/' },
    ],
    search: {
      provider: 'local'
    }
  },
  head: [
    [ 'link', { rel: 'icon', href: 'https://nicolasneudeck.com/favicon.ico' } ],
  ],
  sitemap: {
    hostname: 'https://nicolasneudeck.com',
    lastmodDateOnly: false
  },
  lastUpdated: true,
  cleanUrls: true,
}))
