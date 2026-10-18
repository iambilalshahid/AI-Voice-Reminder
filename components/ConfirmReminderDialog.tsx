import React, { useState, useEffect } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, Clock, Check } from 'lucide-react-native'
import type { ParsedReminder } from '@/types'
import { formatDisplayTime } from '@/lib/utils'

interface ConfirmReminderDialogProps {
  open: boolean
  candidate: ParsedReminder | null
  isSaving: boolean
  onClose: () => void
  onSave: (finalData: ParsedReminder) => void
}

export const ConfirmReminderDialog: React.FC<ConfirmReminderDialogProps> = ({
  open,
  candidate,
  isSaving,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState<string | null>(null)
  const [hasAlarm, setHasAlarm] = useState(false)

  useEffect(() => {
    if (candidate) {
      setTitle(candidate.title || '')
      setDay(candidate.day || 'today')
      setTime(candidate.time || null)
      setHasAlarm(Boolean(candidate.hasAlarm))
    }
  }, [candidate])

  const handleSave = () => {
    onSave({
      title: title.trim() || 'Reminder',
      day: day.trim() || 'today',
      time: time,
      hasAlarm: hasAlarm,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-11/12 max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <DialogHeader>
          <View className="mb-1 flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
              <Check size={18} className="text-emerald-500" />
            </View>
            <DialogTitle className="text-lg font-bold text-foreground">
              Confirm Reminder
            </DialogTitle>
          </View>
          <DialogDescription className="text-xs text-muted-foreground">
            AI has structured your speech. Review or edit before saving.
          </DialogDescription>
        </DialogHeader>

        <View className="gap-3 py-2">
          {/* Title Field */}
          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Task Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Go to Gym"
              placeholderTextColor="#9ca3af"
              className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-base font-semibold text-foreground"
            />
          </View>

          {/* Day & Time Row */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date / Day
              </Text>
              <View className="flex-row items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                <Calendar size={14} className="text-muted-foreground" />
                <TextInput
                  value={day}
                  onChangeText={setDay}
                  placeholder="today"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-sm font-medium capitalize text-foreground"
                />
              </View>
            </View>

            <View className="flex-1 gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Time (24h)
              </Text>
              <View className="flex-row items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                <Clock size={14} className="text-muted-foreground" />
                <TextInput
                  value={time || ''}
                  onChangeText={(val) => {
                    setTime(val || null)
                    if (val) setHasAlarm(true)
                  }}
                  placeholder="10:20"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-sm font-medium text-foreground"
                />
              </View>
            </View>
          </View>

          {/* Alarm Toggle Pill */}
          <Pressable
            onPress={() => setHasAlarm((prev) => !prev)}
            className="flex-row items-center justify-between rounded-xl border border-border/80 bg-muted/40 p-3"
          >
            <View className="flex-row items-center gap-2">
              <Bell
                size={16}
                className={hasAlarm ? 'text-amber-500' : 'text-muted-foreground'}
              />
              <Text className="text-xs font-semibold text-foreground">
                Native Android Alarm
              </Text>
            </View>

            <Badge
              variant={hasAlarm ? 'default' : 'outline'}
              className={hasAlarm ? 'bg-amber-500 text-white' : ''}
            >
              <Text className="text-[11px] font-bold">
                {hasAlarm ? `Set for ${formatDisplayTime(time || '10:20')}` : 'Off'}
              </Text>
            </Badge>
          </Pressable>
        </View>

        <DialogFooter className="mt-2 flex-row gap-2">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={isSaving}
            className="flex-1 rounded-xl"
          >
            <Text className="font-semibold text-muted-foreground">Cancel</Text>
          </Button>

          <Button
            variant="default"
            onPress={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex-1 rounded-xl"
          >
            <Text className="font-semibold text-primary-foreground">
              {isSaving ? 'Saving...' : '✓ Save Reminder'}
            </Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
