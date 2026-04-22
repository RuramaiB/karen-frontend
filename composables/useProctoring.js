import { ref, onMounted, onUnmounted } from 'vue'

export const useProctoring = (options = {}) => {
  const isFullscreen = ref(false)
  const isFocused = ref(true)
  const incidents = ref([])
  const alertMessage = ref('')
  
  const token = localStorage.getItem('Token')
  const email = localStorage.getItem('Email')
  const examId = options.examId || 'unknown'

  const logIncident = async (type, detail, confidence = 1.0) => {
    const incident = {
      examId,
      studentEmail: email,
      incidentType: type,
      detail: detail,
      confidence: confidence,
      timestamp: new Date().toISOString(),
    }
    
    incidents.value.push(incident)
    alertMessage.value = `Incident Detected: ${type} - ${detail}`
    
    console.warn('Proctoring Incident:', incident)

    // Sync with backend
    try {
      await fetch('http://localhost:7210/verification/log-incident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(incident)
      })
    } catch (err) {
      console.error('Failed to sync incident to backend:', err)
    }
  }

  // Extension Integration: Trigger the Force Fullscreen extension
  const triggerExtensionFullscreen = () => {
    console.log('Dispatching PROCTOR_FORCE_FULLSCREEN for extension...')
    window.dispatchEvent(new CustomEvent('PROCTOR_FORCE_FULLSCREEN'))
  }

  // Fullscreen Management
  const enterFullscreen = async () => {
    triggerExtensionFullscreen() // Try extension first
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        isFullscreen.value = true
      }
    } catch (err) {
      // If native fails, extension might take over
      console.log('Native fullscreen request blocked, relying on extension.')
    }
  }

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      isFullscreen.value = false
      logIncident('FULLSCREEN_EXIT', 'User exited fullscreen mode')
      // Try to re-enforce
      setTimeout(enterFullscreen, 2000)
    } else {
      isFullscreen.value = true
    }
  }

  // Focus Detection
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      isFocused.value = false
      logIncident('TAB_SWITCH', 'User navigated away from the exam tab')
    } else {
      isFocused.value = true
    }
  }

  const handleBlur = () => {
    isFocused.value = false
    logIncident('WINDOW_BLUR', 'External window or application focused')
  }

  onMounted(() => {
    if (options.enforceFullscreen) {
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      enterFullscreen() // Trigger on mount
    }
    if (options.monitorFocus) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('blur', handleBlur)
    }
    if (options.blockInteractions) {
      document.addEventListener('contextmenu', (e) => e.preventDefault())
      document.addEventListener('copy', (e) => e.preventDefault())
      document.addEventListener('cut', (e) => e.preventDefault())
      document.addEventListener('paste', (e) => e.preventDefault())
    }
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('blur', handleBlur)
  })

  return {
    isFullscreen,
    isFocused,
    incidents,
    alertMessage,
    enterFullscreen,
    logIncident
  }
}
