import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { AudioPlayer } from './AudioPlayer'
import { Mic, ArrowRight, X } from 'lucide-react-native'

interface RecordingSheetProps {
  transcript: string
  audioUri: string | null
  durationMillis: number
  isProcessing: boolean
  onCancel: () => void
  onProceed: () => void
}

export const RecordingSheet: React.FC<RecordingSheetProps> = ({
  transcript,
  audioUri,
  durationMillis,
  isProcessing,
  onCancel,
  onProceed,
}) => {
  return (
    <View className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl">
      {/* Drag Indicator Pill */}
      <View className="mb-4 h-1 w-12 self-center rounded-full bg-muted-foreground/30" />

      {/* Sheet Title */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Mic size={16} className="text-primary" />
          </View>
          <Text className="text-base font-bold text-foreground">
            Review Recorded Voice
          </Text>
        </View>

        <Button
          variant="ghost"
          size="icon"
          onPress={onCancel}
          disabled={isProcessing}
        >
          <X size={18} className="text-muted-foreground" />
        </Button>
      </View>

      {/* Spoken Transcript Preview */}
      <View className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recognized Speech
        </Text>
        <Text className="mt-1.5 text-base font-medium text-foreground">
          {transcript ? `"${transcript}"` : 'No voice detected. Please try recording again.'}
        </Text>
      </View>

      {/* Audio Playback Player */}
      {audioUri ? (
        <View className="mt-4">
          <AudioPlayer
            uri={audioUri}
            totalDurationMillis={durationMillis}
          />
        </View>
      ) : null}

      {/* Action Buttons */}
      <View className="mt-6 flex-row items-center gap-3">
        <Button
          variant="outline"
          onPress={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-xl py-3"
        >
          <Text className="font-semibold text-muted-foreground">Cancel</Text>
        </Button>

        <Button
          variant="default"
          onPress={onProceed}
          disabled={isProcessing || !transcript}
          className="flex-1 rounded-xl py-3"
        >
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-primary-foreground">
                Proceed
              </Text>
              <ArrowRight size={16} color="#ffffff" />
            </View>
          )}
        </Button>
      </View>
    </View>
  )
}
