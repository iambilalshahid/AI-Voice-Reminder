import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/db'
import { todos } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await db.delete(todos).where(eq(todos.id, id))
      } catch (error) {
        console.error('Failed to delete todo:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export const useToggleTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      try {
        await db.update(todos).set({ completed }).where(eq(todos.id, id))
      } catch (error) {
        console.error('Failed to toggle todo status:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
