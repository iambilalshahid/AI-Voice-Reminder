import React from 'react'
import { Pressable, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { useStore } from '@tanstack/react-store'
import { appStore, setRecordingMode } from '@/store/todos.store'
import { Sparkles, Sliders, Mic, ShieldCheck, Zap } from 'lucide-react-native'

export default function SettingsScreen() {
  const { recordingMode } = useStore(appStore, (s) => s)

  const toggleRecordingMode = () => {
    setRecordingMode(recordingMode === 'click' ? 'hold' : 'click')
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <Animated.View entering={FadeIn.duration(200)} className="flex-1">
        {/* Top Header */}
        <View className="px-6 py-4 border-b border-border/30">
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </Text>
          <Text className="text-xs text-muted-foreground mt-0.5">
            App Preferences & AI Voice Settings
          </Text>
        </View>

        <View className="px-6 py-5 gap-4">
          {/* Trigger Mode Card */}
          <View className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <View className="flex-row items-center gap-2">
              <Mic size={18} className="text-convora-sage" />
              <Text className="text-base font-bold text-foreground">
                Mic Trigger Mode
              </Text>
            </View>
            <Text className="mt-1 text-xs text-muted-foreground">
              Configure how audio recording is started and stopped.
            </Text>

            <View className="mt-4 flex-row items-center justify-between border-t border-border/40 pt-4">
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  Current Behavior
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {recordingMode === 'click' ? 'Click to Start & Stop' : 'Hold to Speak'}
                </Text>
              </View>

              <Pressable
                onPress={toggleRecordingMode}
                className="rounded-full bg-convora-sage px-4 py-2 active:opacity-80"
              >
                <Text className="text-xs font-bold text-white">
                  Switch to {recordingMode === 'click' ? 'Hold' : 'Click'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* AI Engine Model Card */}
          <View className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <View className="flex-row items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              <Text className="text-base font-bold text-foreground">
                AI Parser Engine
              </Text>
            </View>
            <Text className="mt-1 text-xs text-muted-foreground">
              Google Gemini 1.5 Flash processes natural voice in Urdu & English.
            </Text>

            <View className="mt-3 flex-row items-center gap-2 rounded-2xl bg-muted/50 p-3">
              <ShieldCheck size={16} className="text-convora-sage" />
              <Text className="text-xs font-medium text-foreground">
                Direct On-Device SQLite + Android Alarm Intent
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}
