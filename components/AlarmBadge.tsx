import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Text } from '@/components/ui/text'
import { Bell } from 'lucide-react-native'
import { formatDisplayTime } from '@/lib/utils'

interface AlarmBadgeProps {
  time: string
}

export const AlarmBadge: React.FC<AlarmBadgeProps> = ({ time }) => {
  return (
    <Badge
      variant="secondary"
      className="flex-row items-center gap-1.5 bg-amber-500/15 border-amber-500/30 px-2.5 py-0.5 dark:bg-amber-400/20 dark:border-amber-400/30"
    >
      <Bell size={12} className="text-amber-600 dark:text-amber-400" />
      <Text className="text-xs font-semibold text-amber-700 dark:text-amber-300">
        {formatDisplayTime(time)}
      </Text>
    </Badge>
  )
}
