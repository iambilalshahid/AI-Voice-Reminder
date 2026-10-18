import * as IntentLauncher from 'expo-intent-launcher'
import { parseTime24 } from '@/lib/utils'
import type { AlarmPayload } from '@/types'

export const setAlarm = async ({ title, time }: AlarmPayload) => {
  try {
    const { hours, minutes } = parseTime24(time)

    await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
      extra: {
        'android.intent.extra.alarm.HOUR': hours,
        'android.intent.extra.alarm.MINUTES': minutes,
        'android.intent.extra.alarm.MESSAGE': title,
        'android.intent.extra.alarm.SKIP_UI': true, // silent set, no clock app open
        'android.intent.extra.alarm.VIBRATE': true,
      },
    })
  } catch (error) {
    console.error('Failed to set native Android alarm via IntentLauncher:', error)
    throw error
  }
}