export interface Todo {
  id: string
  title: string          // English, max 5 words
  day: string            // "today" | "tomorrow" | "monday" etc
  time: string | null    // "HH:MM" or null
  hasAlarm: boolean
  completed: boolean
  createdAt: number      // Date.now()
}

export interface ParsedReminder {
  title: string
  day: string
  time: string | null
  hasAlarm: boolean
}

export interface AlarmPayload {
  title: string
  time: string           // "HH:MM"
  day: string
}

export type RecordingMode = 'click' | 'hold'
export type WorkflowStep = 'idle' | 'recording' | 'review_audio' | 'confirm_reminder'

export interface RecordingAudioData {
  uri: string | null
  durationMillis: number
  transcript: string
}
