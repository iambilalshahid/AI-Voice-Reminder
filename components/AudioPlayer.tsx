import { Text } from '@/components/ui/text'
import { formatAudioTime } from '@/lib/utils'
import { createAudioPlayer } from 'expo-audio'
import { Pause, Play } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'

interface AudioPlayerProps {
  uri: string
  totalDurationMillis: number
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, totalDurationMillis }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTimeSec, setCurrentTimeSec] = useState(0)
  const [durationSec, setDurationSec] = useState((totalDurationMillis || 1000) / 1000)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!uri) return

    let player: any = null
    try {
      // In installed expo-audio on Android Expo Go, AudioPlayer constructor expects 4 arguments
      // (source, updateInterval, keepAudioSessionActive, preferredForwardBufferDuration)
      const AudioModule = require('expo-audio').AudioModule
      if (AudioModule?.AudioPlayer) {
        try {
          player = new AudioModule.AudioPlayer({ uri }, 100, false, 0)
        } catch {
          // If 5 arguments expected on newer builds
          player = new AudioModule.AudioPlayer({ uri }, 100, false, 0, true)
        }
      } else {
        player = createAudioPlayer({ uri }, { updateInterval: 100 })
      }
      playerRef.current = player

      const subscription = player.addListener('playbackStatusUpdate', (status: any) => {
        if (!status) return
        setIsPlaying(status.playing ?? false)
        if (typeof status.currentTime === 'number') {
          setCurrentTimeSec(status.currentTime)
        }
        if (typeof status.duration === 'number' && status.duration > 0) {
          setDurationSec(status.duration)
        }
        if (status.didJustFinish) {
          setIsPlaying(false)
          setCurrentTimeSec(0)
        }
      })

      return () => {
        subscription?.remove?.()
        try {
          player?.pause?.()
          player?.release?.()
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn('createAudioPlayer initialization warning:', err)
    }
  }, [uri])

  const togglePlayback = () => {
    const player = playerRef.current
    if (!player) return

    try {
      if (isPlaying) {
        player.pause?.()
      } else {
        if (durationSec > 0 && currentTimeSec >= durationSec) {
          player.seekTo?.(0)
        }
        player.play?.()
      }
    } catch (error) {
      console.error('Audio playback error:', error)
    }
  }

  const progressPercent = durationSec > 0
    ? Math.min(100, Math.max(0, (currentTimeSec / durationSec) * 100))
    : 0

  return (
    <View className="w-full flex-row items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 p-3.5">
      <Pressable
        onPress={togglePlayback}
        className="h-10 w-10 items-center justify-center rounded-full bg-primary active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause audio' : 'Play recorded voice'}
      >
        {isPlaying ? (
          <Pause size={18} color="#ffffff" fill="#ffffff" />
        ) : (
          <Play size={18} color="#ffffff" fill="#ffffff" className="ml-0.5" />
        )}
      </Pressable>

      {/* Progress Track */}
      <View className="flex-1 gap-1">
        <View className="h-2 w-full overflow-hidden rounded-full bg-border">
          <View
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-primary"
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] font-medium text-muted-foreground">
            {formatAudioTime(currentTimeSec * 1000)}
          </Text>
          <Text className="text-[11px] font-medium text-muted-foreground">
            {formatAudioTime(durationSec * 1000)}
          </Text>
        </View>
      </View>
    </View>
  )
}