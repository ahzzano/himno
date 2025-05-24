import { createSession, deleteSessionTokenCookie, generateSessionToken, setSessionTokenCookie, validateSessionToken } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { session, user } from "$lib/server/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64 } from "@oslojs/encoding";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail } from "assert";
import { and, eq } from "drizzle-orm/pg-core/expressions";

export const actions = {
    login_acct: async ({ request, cookies }) => {
        const formData = await request.formData()

        const password = String(formData.get('password'))
        const textEncoder = new TextEncoder()
        const bytes = sha256(textEncoder.encode(password))
        const hashedPassword = encodeBase64(bytes)

        const userInfo = {
            username: String(formData.get('username')),
            password: hashedPassword,
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

            setSessionTokenCookie(cookies, newToken, session.expiresAt)
        }
        else {
            const currentSess = currentSession[0]
            const result = await validateSessionToken(currentSess.id)

            if (result.session == null) {
                const newToken = generateSessionToken()
                const session = await createSession(newToken, results[0].id)
                setSessionTokenCookie(cookies, newToken, session.expiresAt)
            }
        }

        return redirect(303, '/app')

    }

} satisfies Actions
