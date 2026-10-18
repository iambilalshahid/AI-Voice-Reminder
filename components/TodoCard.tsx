import React from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { AlarmBadge } from './AlarmBadge'
import { Calendar, Trash2, CheckCircle2, Circle } from 'lucide-react-native'
import type { Todo } from '@/types'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'

interface TodoCardProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onDelete }) => {
  const translateX = useSharedValue(0)

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed)
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -80)
      } else {
        translateX.value = 0
      }
    })
    .onEnd((event) => {
      if (event.translationX < -60) {
        runOnJS(handleDelete)()
        translateX.value = withSpring(0)
      } else {
        translateX.value = withSpring(0)
      }
    })

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View className="relative mb-3 overflow-hidden rounded-2xl">
      {/* Background Action for Swipe Left */}
      <View className="absolute inset-y-0 right-0 w-20 flex-row items-center justify-center rounded-2xl bg-destructive">
        <Trash2 size={22} color="#ffffff" />
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardAnimatedStyle}>
          <Card
            className={`flex-row items-center justify-between gap-0 p-4 ${todo.completed ? 'opacity-50' : 'opacity-100'
              }`}
          >
            <Pressable
              onPress={handleToggle}
              className="mr-3 flex-1 flex-row items-start gap-3"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: todo.completed }}
            >
              <View className="mt-0.5">
                {todo.completed ? (
                  <CheckCircle2 size={22} className="text-emerald-500" />
                ) : (
                  <Circle size={22} className="text-muted-foreground" />
                )}
              </View>

              <View className="flex-1 gap-1.5">
                <Text
                  className={`text-base font-semibold text-card-foreground ${todo.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                >
                  {todo.title}
                </Text>

                <View className="flex-row flex-wrap items-center gap-2">
                  <View className="flex-row items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                    <Calendar size={12} className="text-muted-foreground" />
                    <Text className="text-xs capitalize text-muted-foreground">
                      {todo.day}
                    </Text>
                  </View>

                  {todo.hasAlarm && todo.time ? (
                    <AlarmBadge time={todo.time} />
                  ) : null}
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="rounded-full p-2.5 active:bg-destructive/15"
              accessibilityRole="button"
              accessibilityLabel="Delete reminder"
            >
              <Trash2 size={18} className="text-destructive" />
            </Pressable>
          </Card>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
