import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { session, user } from "$lib/server/db/schema";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail } from "assert";
import { and, eq } from "drizzle-orm/pg-core/expressions";

export const actions = {
    login_acct: async ({ request, event }) => {
        const formData = await request.formData()
        const userInfo = {
            username: String(formData.get('username')),
            password: String(formData.get('password')),
        }

        const results = await db.select()
            .from(user)
            .where(
                and(
                    eq(user.username, userInfo.username),
                    eq(user.password, userInfo.password),
                )
            )
        if (results.length == 0) {
            return fail("invalid login")
        }

        const currentSession = await db.select().
            from(session).
            where(eq(session.userId, results[0].id))

        console.log(currentSession)

        if (currentSession.length == 0) {
            const newToken = generateSessionToken()
            const session = await createSession(newToken, results[0].id)
            setSessionTokenCookie(event, session.id, session.expiresAt)
        }

        return redirect(303, '/app')

    }

} satisfies Actions
