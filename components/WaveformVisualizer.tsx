import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

interface WaveformVisualizerProps {
  meteringLevel: number // 0.0 to 1.0 float from expo-av
  isRecording: boolean
  barCount?: number
  barColor?: string
}

const BAR_COUNT = 30
const MIN_BAR_HEIGHT = 6
const MAX_BAR_HEIGHT = 58

const WaveformBar: React.FC<{ targetHeight: number; barColor?: string }> = ({
  targetHeight,
  barColor = 'bg-[#f97316]',
}) => {
  const heightAnim = useSharedValue(MIN_BAR_HEIGHT)

  useEffect(() => {
    heightAnim.value = withSpring(Math.max(MIN_BAR_HEIGHT, targetHeight), {
      damping: 15,
      stiffness: 180,
    })
  }, [targetHeight, heightAnim])

  const style = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }))

  return (
    <Animated.View
      style={style}
      className={`w-[3px] rounded-full ${barColor}`}
    />
  )
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  meteringLevel,
  isRecording,
  barCount = BAR_COUNT,
  barColor = 'bg-[#f97316]',
}) => {
  const [bars, setBars] = useState<number[]>(() =>
    Array(barCount).fill(MIN_BAR_HEIGHT)
  )

  useEffect(() => {
    if (isRecording) {
      // Calculate dynamic height from real metering
      // Accentuate higher volumes for nice visual punch
      const computedHeight = MIN_BAR_HEIGHT + Math.pow(meteringLevel, 1.2) * MAX_BAR_HEIGHT

      setBars((prev) => {
        const next = [...prev.slice(1), computedHeight]
        return next
      })
    } else {
      // Subtle idle breathing sine waves
      const interval = setInterval(() => {
        setBars((prev) => {
          const t = Date.now() / 400
          const idleBars = prev.map((_, i) => {
            const wave = Math.sin(t + i * 0.3) * 6 + 12
            return Math.max(MIN_BAR_HEIGHT, wave)
          })
          return idleBars
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isRecording, meteringLevel, barCount])

  return (
    <View className="h-full w-full flex-row items-center justify-center gap-1 px-2">
      {bars.map((height, idx) => (
        <WaveformBar key={idx} targetHeight={height} barColor={barColor} />
      ))}
    </View>
  )
}
