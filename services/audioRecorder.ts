import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio'
import type { AudioRecorder } from 'expo-audio/build/AudioModule.types'

let recorderInstance: AudioRecorder | null = null
let meteringInterval: ReturnType<typeof setInterval> | null = null

export const prepareAudioRecorder = async () => {
  try {
    const permission = await requestRecordingPermissionsAsync()
    if (!permission.granted) {
      console.warn('Audio recording permission was not granted')
      return false
    }

    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
      interruptionMode: 'doNotMix',
    })
    return true
  } catch (error) {
    console.error('Error preparing audio recorder:', error)
    return false
  }
}

export const startAudioRecording = async (
  onMeteringUpdate: (normalizedLevel: number) => void
): Promise<boolean> => {
  try {
    const isReady = await prepareAudioRecorder()
    if (!isReady) return false

    if (recorderInstance) {
      try {
        await recorderInstance.stop()
      } catch {
        // ignore
      }
      recorderInstance = null
    }

    if (meteringInterval) {
      clearInterval(meteringInterval)
      meteringInterval = null
    }

    // Initialize AudioRecorder using AudioModule with metering enabled
    const recordingOptions = {
      ...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    }

    recorderInstance = new AudioModule.AudioRecorder(recordingOptions)
    await recorderInstance.prepareToRecordAsync()
    recorderInstance.record()

    // Poll status for metering level
    meteringInterval = setInterval(() => {
      if (!recorderInstance) return
      try {
        const status = recorderInstance.getStatus()
        if (status.isRecording && typeof status.metering === 'number') {
          // Metering typically ranges from -160 dB to 0 dB
          const clamped = Math.max(-60, Math.min(0, status.metering))
          const normalized = (clamped + 60) / 60
          onMeteringUpdate(normalized)
        }
      } catch {
        // ignore polling errors
      }
    }, 60)

    return true
  } catch (error) {
    console.error('Failed to start audio recording:', error)
    if (meteringInterval) {
      clearInterval(meteringInterval)
      meteringInterval = null
    }
    return false
  }
}

export const pauseAudioRecording = () => {
  try {
    if (recorderInstance) {
      recorderInstance.pause()
    }
  } catch (error) {
    console.warn('Failed to pause recording:', error)
  }
}

export const resumeAudioRecording = () => {
  try {
    if (recorderInstance) {
      recorderInstance.record()
    }
  } catch (error) {
    console.warn('Failed to resume recording:', error)
  }
}

export const stopAudioRecording = async (): Promise<{
  uri: string | null
  durationMillis: number
}> => {
  if (meteringInterval) {
    clearInterval(meteringInterval)
    meteringInterval = null
  }

  try {
    if (!recorderInstance) {
      return { uri: null, durationMillis: 0 }
    }

    const currentRecorder = recorderInstance
    recorderInstance = null

    let status: any = null
    try {
      status = currentRecorder.getStatus()
    } catch {
      // ignore
    }

    try {
      await currentRecorder.stop()
    } catch {
      // ignore
    }

    const uri = currentRecorder.uri || status?.url || null
    const durationMillis = status?.durationMillis || (currentRecorder.currentTime ? currentRecorder.currentTime * 1000 : 0)

    return { uri, durationMillis }
  } catch (error) {
    console.error('Failed to stop audio recording:', error)
    recorderInstance = null
    return { uri: null, durationMillis: 0 }
  }
}

