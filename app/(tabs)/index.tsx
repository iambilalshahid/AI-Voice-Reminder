import { TodoList } from '@/components/TodoList'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { useDeleteTodo, useToggleTodo } from '@/hooks/useDeleteTodo'
import { useTodos } from '@/hooks/useTodos'
import { CheckCircle2, Clock, Sparkles } from 'lucide-react-native'
import { View } from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { data: todos = [], isLoading } = useTodos()
  const { mutate: deleteTodo } = useDeleteTodo()
  const { mutate: toggleTodo } = useToggleTodo()

  const completedCount = todos.filter((t) => t.completed).length
  const pendingCount = todos.length - completedCount

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <Animated.View entering={FadeIn.duration(200)} className="flex-1">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border/30">
        <View className="flex-row items-center gap-2">
          {/* Convora Brand Audio Bars Icon */}
          <View className="flex-row items-center gap-0.5">
            <View className="h-3 w-0.5 rounded-full bg-convora-sage" />
            <View className="h-5 w-0.5 rounded-full bg-convora-sage" />
            <View className="h-3.5 w-0.5 rounded-full bg-convora-sage" />
            <View className="h-2 w-0.5 rounded-full bg-convora-sage" />
          </View>
          <Text className="text-xl font-bold tracking-tight text-foreground">
            Convora
          </Text>
        </View>

        <Badge
          variant="secondary"
          className="flex-row items-center gap-1.5 rounded-full border border-convora-sage/20 bg-convora-sage-light/70 px-3 py-1.5"
        >
          <Sparkles size={12} className="text-convora-sage" />
          <Text className="text-xs font-semibold text-convora-sage">AI 1.5</Text>
        </Badge>
      </View>

      {/* Greeting Title */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-xs font-medium text-muted-foreground">
          Good day,
        </Text>
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          Voice Reminders
        </Text>
      </View>

      {/* Quick Summary Cards (Convora Style) */}
      <View className="flex-row gap-3 px-6 py-3">
        <View className="flex-1 rounded-2xl border border-border/60 bg-muted/40 p-3.5">
          <View className="flex-row items-center gap-2">
            <Clock size={15} className="text-muted-foreground" />
            <Text className="text-xs font-semibold text-muted-foreground">Pending</Text>
          </View>
          <Text className="mt-1.5 text-2xl font-bold text-foreground">{pendingCount}</Text>
        </View>

        <View className="flex-1 rounded-2xl border border-border/60 bg-muted/40 p-3.5">
          <View className="flex-row items-center gap-2">
            <CheckCircle2 size={15} className="text-convora-sage" />
            <Text className="text-xs font-semibold text-muted-foreground">Done</Text>
          </View>
          <Text className="mt-1.5 text-2xl font-bold text-foreground">{completedCount}</Text>
        </View>
      </View>

      {/* Reminders List */}
      <View className="flex-1 px-6 pt-2 pb-24">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-foreground">
            Your Schedule
          </Text>
          <Text className="text-xs text-muted-foreground">
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>

        {isLoading ? (
          <View className="gap-3 pt-1">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="flex-row items-center justify-between gap-0 rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-1 gap-2.5">
                  <Skeleton className="h-5 w-44 rounded-md" />
                  <View className="flex-row items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </View>
                </View>
                <Skeleton className="h-8 w-8 rounded-full" />
              </Card>
            ))}
          </View>
        ) : (
          <TodoList
            todos={todos}
            onToggle={(id, completed) => toggleTodo({ id, completed })}
            onDelete={(id) => deleteTodo(id)}
          />
        )}
      </View>
      </Animated.View>
    </SafeAreaView>
  )
}
