import React from 'react'
import { FlatList, View } from 'react-native'
import { TodoCard } from './TodoCard'
import { EmptyState } from './EmptyState'
import type { Todo } from '@/types'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return <EmptyState />
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      contentContainerClassName="px-4 pt-2 pb-28"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TodoCard todo={item} onToggle={onToggle} onDelete={onDelete} />
      )}
      ItemSeparatorComponent={() => <View className="h-1" />}
    />
  )
}