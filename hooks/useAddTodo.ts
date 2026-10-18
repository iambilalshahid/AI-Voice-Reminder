import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/db'
import { todos } from '@/db/schema'
import { setAlarm } from '@/services/alarm'
import type { ParsedReminder, Todo } from '@/types'
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

export const useAddTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (parsed: ParsedReminder): Promise<Todo> => {
      try {
        const todo: Todo = {
          ...parsed,
          id: uuid(),
          completed: false,
          createdAt: Date.now(),
        }
        await db.insert(todos).values(todo)
        if (parsed.hasAlarm && parsed.time) {
          try {
            await setAlarm({ title: parsed.title, time: parsed.time, day: parsed.day })
          } catch (alarmErr) {
            console.warn('Could not trigger native alarm:', alarmErr)
          }
        }
        return todo
      } catch (error) {
        console.error('Failed to add todo:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
