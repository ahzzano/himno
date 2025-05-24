import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    password: text('password').notNull(),
    date_created: timestamp('date_created', {
        withTimezone: true,
        mode: 'date'
    })
        .defaultNow(),
    age: integer('age'),
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const feeds = pgTable('feeds', {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    name: text('name').notNull(),
    user: text('user').references(() => user.id),
});

export const articles = pgTable('articles', {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    title: text('title'),
    feed: text('feed_id').references(() => feeds.id)
})

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Feed = typeof feeds.$inferSelect & {
    articles: Article[] | null;
}
export type Article = typeof articles.$inferSelect;
