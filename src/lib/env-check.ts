export function validateServerConfig() {
    const missing = []
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    if (!process.env.ADMIN_EMAIL) missing.push('ADMIN_EMAIL')
    if (!process.env.AUTH_SECRET) missing.push('AUTH_SECRET')

    if (missing.length > 0) {
        return {
            valid: false,
            message: `Server configuration incomplete. Missing: ${missing.join(', ')}`
        }
    }

    return { valid: true }
}
