import React, { useEffect, useState } from 'react'
import { Pressable, View, Text as RNText, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { WaveformVisualizer } from '@/components/WaveformVisualizer'
import { useStore } from '@tanstack/react-store'
import { appStore } from '@/store/todos.store'
import { useVoice } from '@/hooks/useVoice'
import { useRouter } from 'expo-router'
import { formatSecondsTimer } from '@/lib/utils'
import { Square, X, Sparkles, Pause, Mic, Play } from 'lucide-react-native'

export default function RecordScreen() {
  const router = useRouter()
  const { isListening, audioMetering, lastTranscript } = useStore(appStore, (s) => s)
  const { startRecording, stopRecording, pauseRecording, resumeRecording, cancelWorkflow } = useVoice()

  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [isTogglingPause, setIsTogglingPause] = useState(false)

  // Start recording on tab mount if not already listening
  useEffect(() => {
    if (!isListening) {
      startRecording()
    }
  }, [])

  useEffect(() => {
    if (isPaused || !isListening) return
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isPaused, isListening])

  const handleTogglePause = () => {
    if (isStopping || isTogglingPause) return
    setIsTogglingPause(true)
    if (isPaused) {
      resumeRecording()
      setIsPaused(false)
    } else {
      pauseRecording()
      setIsPaused(true)
    }
    // Instant feedback with quick micro debounce
    setTimeout(() => {
      setIsTogglingPause(false)
    }, 200)
  }

  const handleStop = async () => {
    if (isStopping) return
    setIsStopping(true)
    try {
      await stopRecording()
      router.replace('/')
    } catch {
      setIsStopping(false)
    }
  }

  const handleCancel = () => {
    if (isStopping) return
    cancelWorkflow()
    router.replace('/')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
      {/* Top Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14 }}>
        <Pressable
          onPress={handleCancel}
          disabled={isStopping}
          style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', opacity: isStopping ? 0.6 : 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 }}
          accessibilityRole="button"
          accessibilityLabel="Close recording"
        >
          <X size={18} color="#18181b" />
        </Pressable>

        <Text style={{ fontSize: 18, fontWeight: '700', color: '#18181b' }}>
          Recording
        </Text>

        <View style={{ width: 40, height: 40 }} />
      </View>

      {/* Content Container */}
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 28, paddingTop: 10 }}>
        <View style={{ gap: 16 }}>
          {/* Top Card: Waveform + Timer */}
          <View style={{ backgroundColor: '#ffffff', borderRadius: 24, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e4e4e7', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, overflow: 'hidden' }}>
            {/* Recording pill */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 9999, backgroundColor: '#fff4ed', paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isStopping ? '#71717a' : '#f97316' }} />
              <RNText style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: isStopping ? '#71717a' : '#ea580c' }}>
                {isStopping ? 'Saving...' : isListening && !isPaused ? 'Recording' : 'Paused'}
              </RNText>
            </View>

            {/* Dynamic Waveform Visualizer contained cleanly inside card */}
            <View style={{ width: '100%', height: 74, marginVertical: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <WaveformVisualizer
                meteringLevel={isPaused || isStopping ? 0 : audioMetering}
                isRecording={isListening && !isPaused && !isStopping}
                barCount={28}
                barColor="bg-[#f97316]"
              />
            </View>

            {/* Big Bold Timer */}
            <Text style={{ marginTop: 8, fontSize: 36, fontWeight: '800', letterSpacing: -0.5, color: '#18181b' }}>
              {formatSecondsTimer(seconds)}
            </Text>
          </View>

          {/* Bottom Card: Live Transcription */}
          <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 20, minHeight: 180, borderWidth: 1, borderColor: '#e4e4e7', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="#f97316" />
              <RNText style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#71717a' }}>
                Live Transcription
              </RNText>
            </View>

            <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '500', lineHeight: 24, color: '#27272a' }}>
              {lastTranscript && lastTranscript.trim().length > 0
                ? lastTranscript
                : 'Speak in Urdu or English... your words will appear here in real time'}
            </Text>
          </View>
        </View>

        {/* Bottom Action Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 16 }}>
          {/* Pause / Resume */}
          <Pressable
            onPress={handleTogglePause}
            disabled={isStopping || isTogglingPause}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e4e4e7', paddingVertical: 16, opacity: isStopping ? 0.5 : 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
          >
            {isTogglingPause ? (
              <ActivityIndicator size="small" color="#18181b" />
            ) : isPaused ? (
              <Play size={17} color="#18181b" />
            ) : (
              <Pause size={17} color="#18181b" />
            )}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#18181b' }}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </Pressable>

          {/* Stop Button */}
          <Pressable
            onPress={handleStop}
            disabled={isStopping}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, backgroundColor: '#18181b', paddingVertical: 16, opacity: isStopping ? 0.75 : 1, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 }}
          >
            {isStopping ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>
                  Processing...
                </Text>
              </>
            ) : (
              <>
                <Square size={16} color="#ffffff" fill="#ffffff" />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>
                  Stop
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
