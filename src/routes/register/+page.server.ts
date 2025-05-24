import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64, encodeHexLowerCase } from "@oslojs/encoding";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    register_account: async ({ request }) => {
        const formData = await request.formData()
        const now = new Date(0)
        const password = String(formData.get('password'))

        const textEncoder = new TextEncoder()
        const bytes = sha256(textEncoder.encode(password))
        const hashedPassword = encodeBase64(bytes)

        const userData = {
            id: `${String(formData.get('username'))}-${now.toISOString()}`,
            username: String(formData.get('username')),
            password: hashedPassword,
        }

        if (userData.id == null || userData.password == null) {
            return { success: false }
        }

        await db.insert(user).values(userData)


        return redirect(303, '/login')
    }

} satisfies Actions
