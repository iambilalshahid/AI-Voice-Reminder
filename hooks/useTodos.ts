import { useQuery } from '@tanstack/react-query'
import { db } from '@/db'
import { todos } from '@/db/schema'
import { desc } from 'drizzle-orm'
import type { Todo } from '@/types'

export const useTodos = () =>
  useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      try {
        const result = await db.select().from(todos).orderBy(desc(todos.createdAt))
        return result.map(item => ({
          ...item,
          hasAlarm: Boolean(item.hasAlarm),
          completed: Boolean(item.completed),
        }))
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        throw error
      }
    },
  })
