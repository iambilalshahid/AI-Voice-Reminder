import React from 'react'
import { Pressable, View } from 'react-native'
import { Mic, Square } from 'lucide-react-native'

interface VoiceButtonProps {
  isListening: boolean
  isProcessing: boolean
  recordingMode: 'click' | 'hold'
  onPress: () => void
  onPressIn: () => void
  onPressOut: () => void
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  recordingMode,
  onPress,
  onPressIn,
  onPressOut,
}) => {
  return (
    <View className="items-center justify-center">
      {/* Outer ambient soft ring */}
      <View className="h-24 w-24 items-center justify-center rounded-full bg-convora-sage-light/60">
        {/* Inner subtle ring */}
        <View className="h-18 w-18 items-center justify-center rounded-full bg-convora-sage-subtle/50">
          <Pressable
            onPress={recordingMode === 'click' ? onPress : undefined}
            onPressIn={recordingMode === 'hold' ? onPressIn : undefined}
            onPressOut={recordingMode === 'hold' ? onPressOut : undefined}
            disabled={isProcessing}
            accessibilityRole="button"
            accessibilityLabel={isListening ? 'Stop recording' : 'Start speaking reminder'}
            className={`h-14 w-14 items-center justify-center rounded-full shadow-md active:scale-95 ${isListening
                ? 'bg-red-500 shadow-red-500/30'
                : isProcessing
                  ? 'bg-muted-foreground/50'
                  : 'bg-convora-sage shadow-convora-sage/40'
              }`}
          >
            {isListening ? (
              <Square size={20} color="#ffffff" fill="#ffffff" />
            ) : (
              <Mic size={24} color="#ffffff" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  )
}