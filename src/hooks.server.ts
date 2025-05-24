import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get(auth.sessionCookieName);

    if (!sessionToken) {
        event.locals.user = null;
        event.locals.session = null;

        if (event.url.pathname.startsWith('/app')) {
            return redirect(303, '/login')
        }

        return resolve(event);
    }

    const { session, user } = await auth.validateSessionToken(sessionToken);

    if (session) {
        auth.setSessionTokenCookie(event.cookies, sessionToken, session.expiresAt);
    } else {
        // console.log("NO SESSION FOUND")
        auth.deleteSessionTokenCookie(event.cookies);
    }

    event.locals.user = user;
    event.locals.session = session;
    return resolve(event);
};

export const handle: Handle = handleAuth;
