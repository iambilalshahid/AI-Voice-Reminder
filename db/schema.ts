import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  day: text('day').notNull(),
  time: text('time'),
  hasAlarm: integer('has_alarm', { mode: 'boolean' }).default(false),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at').notNull(),
})
