import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

export const useTheme = () => {
  const theme = ref<Theme>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )
  
  const setTheme = (newTheme: Theme) => {
    // 更新 DOM
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    // 更新状态
    theme.value = newTheme
    // 保存到 localStorage
    localStorage.setItem('theme', newTheme)
    // 添加过渡效果
    document.documentElement.style.transition = 'background 0.3s ease-in-out'
  }

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })

  return {
    theme,
    setTheme
  }
} 