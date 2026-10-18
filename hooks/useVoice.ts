import { useEffect } from 'react'
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice'
import {
  startListening,
  stopListening,
  destroyVoice,
  isVoiceAvailable,
} from '@/services/voice'
import {
  startAudioRecording,
  stopAudioRecording,
  pauseAudioRecording,
  resumeAudioRecording,
} from '@/services/audioRecorder'
import {
  appStore,
  setListening,
  setProcessing,
  setTranscript,
  setAudioMetering,
  setAudioData,
  setWorkflowStep,
  setParsedCandidate,
  resetRecordingWorkflow,
} from '@/store/todos.store'
import { parseVoiceInput } from '@/services/agent'
import { useAddTodo } from './useAddTodo'

export const useVoice = () => {
  const { mutateAsync: addTodo } = useAddTodo()

  useEffect(() => {
    if (!isVoiceAvailable()) return

    try {
      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        const text = e.value?.[0]
        if (text) {
          setTranscript(text)
        }
      }

      Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
        const text = e.value?.[0]
        if (text) {
          setTranscript(text)
        }
      }

      Voice.onSpeechError = (e: SpeechErrorEvent) => {
        console.warn('Speech recognition event warning:', e.error)
      }
    } catch (err) {
      console.warn('Voice event listener setup failed:', err)
    }

    return () => {
      destroyVoice()
    }
  }, [])

  // Start Parallel Recording (expo-av + speech transcript)
  const startRecording = async () => {
    try {
      setListening(true)
      setWorkflowStep('recording')

      await Promise.allSettled([
        startAudioRecording((meteringLevel) => {
          setAudioMetering(meteringLevel)
        }),
        startListening(),
      ])
    } catch (error) {
      console.error('Failed to start recording flow:', error)
      setListening(false)
      setWorkflowStep('idle')
    }
  }

  // Pause / Resume audio recording
  const pauseRecording = () => {
    pauseAudioRecording()
  }

  const resumeRecording = () => {
    resumeAudioRecording()
  }

  // Stop Recording and transition to Step 2 (Review Audio Sheet)
  const stopRecording = async () => {
    try {
      setListening(false)
      const audioResult = await stopAudioRecording()
      await stopListening()

      setAudioData(audioResult.uri, audioResult.durationMillis)
      setWorkflowStep('review_audio')
    } catch (error) {
      console.error('Failed to stop recording flow:', error)
      resetRecordingWorkflow()
    }
  }

  // Step 2 Proceed -> LangChain Agent -> Step 3 Dialog
  const proceedToAIReview = async () => {
    const transcript = appStore.state.lastTranscript
    if (!transcript) {
      console.warn('No speech text detected')
      return
    }

    setProcessing(true)
    try {
      const parsed = await parseVoiceInput(transcript)
      setParsedCandidate(parsed)
      setWorkflowStep('confirm_reminder')
    } catch (error) {
      console.error('AI parsing error:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Step 3 Save -> Drizzle DB + Android Alarm
  const saveConfirmedReminder = async (finalData: any) => {
    try {
      setProcessing(true)
      await addTodo(finalData)
      resetRecordingWorkflow()
    } catch (error) {
      console.error('Failed to save reminder:', error)
    } finally {
      setProcessing(false)
    }
  }

  const cancelWorkflow = () => {
    resetRecordingWorkflow()
  }

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    proceedToAIReview,
    saveConfirmedReminder,
    cancelWorkflow,
  }
}
