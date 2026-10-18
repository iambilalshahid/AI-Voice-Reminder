import Voice from '@react-native-voice/voice'
import { NativeModules, Platform } from 'react-native'

export const isVoiceAvailable = (): boolean => {
  return Platform.OS !== 'web' && Boolean(NativeModules.Voice)
}

export const startListening = async () => {
  try {
    if (!NativeModules.Voice) {
      console.warn(
        '@react-native-voice/voice native module is not linked in this build. Needs Expo prebuild or Dev Client.'
      )
      return
    }
    await Voice.start('ur-PK') // Urdu Pakistan locale
  } catch (error) {
    console.error('Failed to start voice listening:', error)
    throw error
  }
}

export const stopListening = async () => {
  try {
    if (!NativeModules.Voice) {
      return
    }
    await Voice.stop()
  } catch (error) {
    console.warn('Failed to stop voice listening safely:', error)
  }
}

export const destroyVoice = async () => {
  try {
    if (!NativeModules.Voice) {
      return
    }
    await Voice.destroy()
    Voice.removeAllListeners()
  } catch (error) {
    console.warn('Failed to destroy voice service safely:', error)
  }
}
