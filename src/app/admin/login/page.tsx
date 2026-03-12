import { signIn } from '@/auth'

export default function AdminLoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                <h1 className="mb-3 text-2xl font-bold">管理画面にログイン</h1>
                <p className="mb-6 text-sm text-gray-500">
                    管理者として許可された Google アカウントでサインインしてください。
                </p>
                <form
                    action={async () => {
                        'use server'
                        await signIn('google', { redirectTo: '/admin' })
                    }}
                >
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        Googleでサインイン
                    </button>
                </form>
            </div>
        </div>
    )
}
