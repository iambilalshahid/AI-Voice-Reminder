import React from 'react'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Mic, Sparkles } from 'lucide-react-native'

export const EmptyState: React.FC = () => {
  return (
    <View className="items-center justify-center py-10 px-4">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-convora-sage-light">
        <Sparkles size={22} className="text-convora-sage" />
      </View>

      <Text className="text-center text-base font-bold text-foreground">
        No reminders yet
      </Text>

      <Text className="mt-1 max-w-[260px] text-center text-xs leading-4 text-muted-foreground">
        Tap the mic button above and speak your reminder.
      </Text>

      <View className="mt-4 flex-row items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5">
        <Mic size={13} className="text-muted-foreground" />
        <Text className="text-[11px] font-medium text-muted-foreground">
          "kal subah 8 baje gym jana hai"
        </Text>
      </View>
    </View>
  )
}
