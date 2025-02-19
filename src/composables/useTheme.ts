import { ref, watch, onMounted } from 'vue'

type Theme = 'dark' | 'light'

export function useTheme() {
  const theme = ref<Theme>('light')

  // 应用主题
  const applyTheme = (newTheme: Theme) => {
    // 更新 DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // 保存到 localStorage
    localStorage.setItem('theme', newTheme)
    theme.value = newTheme
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme)
  }

  // 初始化主题
  onMounted(() => {
    // 从 localStorage 获取主题
    const savedTheme = localStorage.getItem('theme') as Theme | null
    // 如果有保存的主题就使用，否则根据系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'))

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  })

  return {
    theme,
    setTheme
  }
} 