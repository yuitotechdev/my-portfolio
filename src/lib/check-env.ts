export function checkEnvironment() {
    const required = [
        'AUTH_SECRET',
        'ADMIN_EMAIL',
        'NEXT_PUBLIC_SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY'
    ]

    const missing = required.filter(key => !process.env[key])

    if (missing.length > 0) {
        console.error('❌ FATAL: Missing Environment Variables:')
        missing.forEach(key => console.error(`   - ${key}`))
        console.error('Application likely to malfunction. check .env.local')
        // In strictly typed envs we might throw, but here we just log error to allow partial start or dev.
    } else {
        console.log('✅ Environment checks passed.')
    }
}
