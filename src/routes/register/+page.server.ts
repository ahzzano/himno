import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import type { Actions } from "@sveltejs/kit";

export const actions = {
    register_account: async ({ request }) => {
        const formData = await request.formData()
        const userData = {
            id: String(formData.get('username')),
            password: String(formData.get('password')),
        }

        if (userData.id == null || userData.password == null) {
            return { success: false }
        }

        await db.insert(user).values(userData)

        return { success: true }
    }

} satisfies Actions
