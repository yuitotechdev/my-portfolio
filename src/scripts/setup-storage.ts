import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupBuckets() {
    const buckets = ['works', 'products', 'devices', 'avatars']
    for (const b of buckets) {
        const { error } = await supabase.storage.getBucket(b)
        if (error) {
            console.log(`Bucket ${b} not found, creating...`)
            const { error: createError } = await supabase.storage.createBucket(b, {
                public: true
            })
            if (createError) {
                console.error(`Failed to create bucket ${b}:`, createError)
            } else {
                console.log(`Bucket ${b} created successfully.`)
            }
        } else {
            console.log(`Bucket ${b} already exists.`)
        }
    }
}

setupBuckets()
