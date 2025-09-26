import { ref, onMounted } from 'vue'

export type Theme = 'dark' | 'light' | 'system'

export const useTheme = () => {
  const theme = ref<Theme>('system')

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      localStorage.removeItem('theme')
    } else {
      root.classList.add(newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('system')
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme.value === 'system') {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }
    })
  })

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}