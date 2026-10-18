import React, { useEffect, useState } from 'react'
import { View, Pressable, Modal, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { WaveformVisualizer } from './WaveformVisualizer'
import { Square, X, Sparkles, Pause } from 'lucide-react-native'
import { formatSecondsTimer } from '@/lib/utils'

interface RecordingOverlayProps {
  meteringLevel: number
  liveTranscript?: string | null
  onStop: () => void
  onCancel: () => void
}

export const RecordingOverlay: React.FC<RecordingOverlayProps> = ({
  meteringLevel,
  liveTranscript,
  onStop,
  onCancel,
}) => {
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={false}
      statusBarTranslucent={true}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f4f5f7" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
        {/* Top Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12 }}>
          <Pressable
            onPress={onCancel}
            style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 }}
            accessibilityRole="button"
            accessibilityLabel="Close recording"
          >
            <X size={18} color="#18181b" />
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: '700', color: '#18181b' }}>
            Recording
          </Text>

          {/* Placeholder for symmetry */}
          <View style={{ width: 40, height: 40 }} />
        </View>

        {/* Content Container */}
        <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 }}>
          <View style={{ gap: 16 }}>
            {/* Top Card: Waveform + Timer */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e4e4e7', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
              {/* Recording pill */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 9999, backgroundColor: '#fff4ed', paddingHorizontal: 12, paddingVertical: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f97316' }} />
                <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#ea580c' }}>
                  Recording
                </Text>
              </View>

              {/* Dynamic Waveform Visualizer */}
              <View style={{ width: '100%', height: 90, marginVertical: 16, alignItems: 'center', justifyContent: 'center' }}>
                <WaveformVisualizer
                  meteringLevel={isPaused ? 0 : meteringLevel}
                  isRecording={!isPaused}
                />
              </View>

              {/* Big Bold Timer */}
              <Text style={{ fontSize: 36, fontWeight: '800', letterSpacing: -1, color: '#18181b' }}>
                {formatSecondsTimer(seconds)}
              </Text>
            </View>

            {/* Bottom Card: Live Transcription */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 20, minHeight: 180, borderWidth: 1, borderColor: '#e4e4e7', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} color="#f97316" />
                <Text style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#71717a' }}>
                  Live Transcription
                </Text>
              </View>

              <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '500', lineHeight: 24, color: '#27272a' }}>
                {liveTranscript && liveTranscript.trim().length > 0
                  ? liveTranscript
                  : 'Speak now... your words will appear here in real time'}
              </Text>
            </View>
          </View>

          {/* Bottom Action Controls */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 16 }}>
            {/* Pause / Resume Button */}
            <Pressable
              onPress={togglePause}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e4e4e7', paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
            >
              <Pause size={17} color="#18181b" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#18181b' }}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </Pressable>

            {/* Stop Button */}
            <Pressable
              onPress={onStop}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, backgroundColor: '#18181b', paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 }}
            >
              <Square size={16} color="#ffffff" fill="#ffffff" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>
                Stop
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
