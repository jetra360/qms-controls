import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidMount from './MermaidMount.vue'
import SidebarControls from './SidebarControls.vue'
import SidebarToggle from './SidebarToggle.vue'
import ContinueReading from './ContinueReading.vue'
import './custom.css'

// Plain extension of the default theme. No Vue aliasing — that caused the
// hydration failure recorded in lessons-learned.md.
export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => h(MermaidMount),
    'sidebar-nav-before': () => h(SidebarControls),
    'nav-bar-content-before': () => h(SidebarToggle),
    'doc-before': () => h(ContinueReading),
  }),
}
