import React from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated'
import { Home, Mic, Settings } from 'lucide-react-native'

interface FloatingDockProps {
  activeTab: 'home' | 'settings'
  onSelectTab: (tab: 'home' | 'settings') => void
  onMicPress: () => void
  isListening?: boolean
  visible?: boolean
}

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 220,
  mass: 0.8,
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeTab,
  onSelectTab,
  onMicPress,
  isListening = false,
  visible = true,
}) => {
  const insets = useSafeAreaInsets()
  const convoraSageVar = useCSSVariable('--color-convora-sage') as string | undefined
  const mutedForegroundVar = useCSSVariable('--color-muted-foreground') as string | undefined

  const activeColor = convoraSageVar || '#2a5849'
  const inactiveColor = mutedForegroundVar || '#71717a'

  const homeScale = useSharedValue(1)
  const settingsScale = useSharedValue(1)
  const micScale = useSharedValue(1)
  const translateY = useSharedValue(0)

  React.useEffect(() => {
    translateY.value = withSpring(visible ? 0 : 150, {
      damping: 16,
      stiffness: 180,
    })
  }, [visible])

  const handleTabPress = (tab: 'home' | 'settings') => {
    onSelectTab(tab)
    const scaleVal = tab === 'home' ? homeScale : settingsScale

    // Bouncy spring animation sequence
    scaleVal.value = withSequence(
      withSpring(0.75, { damping: 10, stiffness: 350 }),
      withSpring(1.25, SPRING_CONFIG),
      withSpring(1, SPRING_CONFIG)
    )
  }

  const handleMicPress = () => {
    onMicPress()
    micScale.value = withSequence(
      withSpring(0.85, { damping: 10, stiffness: 350 }),
      withSpring(1.15, SPRING_CONFIG),
      withSpring(1, SPRING_CONFIG)
    )
  }

  const homeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: homeScale.value }],
  }))

  const settingsAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsScale.value }],
  }))

  const micAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }))

  const dockContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: withSpring(visible ? 1 : 0),
  }))

  const bottomOffset = Math.max(insets.bottom, 16)

  return (
    <Animated.View
      style={[{ bottom: bottomOffset }, dockContainerStyle]}
      className="absolute left-0 right-0 z-40 items-center justify-center pointer-events-box-none"
    >
      {/* Outer Floating Capsule themed with card background and border */}
      <View className="flex-row items-center rounded-full border border-border/70 bg-card/95 px-3 py-2 shadow-2xl shadow-black/15 backdrop-blur-md">
        {/* Home Tab Button */}
        <Pressable
          onPress={() => handleTabPress('home')}
          className={`h-11 w-11 items-center justify-center rounded-full transition-all ${activeTab === 'home' ? 'bg-convora-sage-light/60' : 'bg-transparent'
            }`}
          accessibilityRole="button"
          accessibilityLabel="Home tab"
        >
          <Animated.View style={homeAnimStyle}>
            <Home
              size={20}
              color={activeTab === 'home' ? activeColor : inactiveColor}
              fill={activeTab === 'home' ? activeColor : 'transparent'}
            />
          </Animated.View>
        </Pressable>

        {/* Center Prominent Convora Sage Mic Pill */}
        <Pressable
          onPress={handleMicPress}
          className={`mx-2 h-12 w-24 items-center justify-center rounded-full shadow-lg active:opacity-90 ${isListening
            ? 'bg-destructive shadow-destructive/40'
            : 'bg-convora-sage shadow-convora-sage/40'
            }`}
          accessibilityRole="button"
          accessibilityLabel="Record voice reminder"
        >
          <Animated.View style={micAnimStyle} className="flex-row items-center gap-1.5">
            <Mic size={20} color="#ffffff" strokeWidth={2.2} />
          </Animated.View>
        </Pressable>

        {/* Settings Tab Button */}
        <Pressable
          onPress={() => handleTabPress('settings')}
          className={`h-11 w-11 items-center justify-center rounded-full transition-all ${activeTab === 'settings' ? 'bg-convora-sage-light/60' : 'bg-transparent'
            }`}
          accessibilityRole="button"
          accessibilityLabel="Settings tab"
        >
          <Animated.View style={settingsAnimStyle}>
            <Settings
              size={20}
              color={activeTab === 'settings' ? activeColor : inactiveColor}
              fill={activeTab === 'settings' ? activeColor : 'transparent'}
            />
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  )
}