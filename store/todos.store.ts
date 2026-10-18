import { Store } from '@tanstack/store'
import type { ParsedReminder, RecordingMode, WorkflowStep } from '@/types'

export interface AppState {
  isListening: boolean
  isProcessing: boolean
  lastTranscript: string
  audioUri: string | null
  audioDurationMillis: number
  audioMetering: number
  recordingMode: RecordingMode
  step: WorkflowStep
  parsedCandidate: ParsedReminder | null
}

export const appStore = new Store<AppState>({
  isListening: false,
  isProcessing: false,
  lastTranscript: '',
  audioUri: null,
  audioDurationMillis: 0,
  audioMetering: 0,
  recordingMode: 'click', // 'click' (tap to start / tap to stop) or 'hold'
  step: 'idle',
  parsedCandidate: null,
})

export const setListening = (val: boolean) => {
  appStore.setState(s => ({ ...s, isListening: val }))
}

export const setProcessing = (val: boolean) => {
  appStore.setState(s => ({ ...s, isProcessing: val }))
}

export const setTranscript = (text: string) => {
  appStore.setState(s => ({ ...s, lastTranscript: text }))
}

export const setAudioMetering = (val: number) => {
  appStore.setState(s => ({ ...s, audioMetering: val }))
}

export const setAudioData = (uri: string | null, durationMillis: number) => {
  appStore.setState(s => ({
    ...s,
    audioUri: uri,
    audioDurationMillis: durationMillis,
  }))
}

export const setWorkflowStep = (step: WorkflowStep) => {
  appStore.setState(s => ({ ...s, step }))
}

export const setParsedCandidate = (candidate: ParsedReminder | null) => {
  appStore.setState(s => ({ ...s, parsedCandidate: candidate }))
}

export const setRecordingMode = (mode: RecordingMode) => {
  appStore.setState(s => ({ ...s, recordingMode: mode }))
}

export const resetRecordingWorkflow = () => {
  appStore.setState(s => ({
    ...s,
    isListening: false,
    isProcessing: false,
    audioUri: null,
    audioDurationMillis: 0,
    audioMetering: 0,
    step: 'idle',
    parsedCandidate: null,
  }))
}
