import { signIn } from "@/auth"

export default function AdminLoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
                <form
                    action={async () => {
                        "use server"
                        await signIn("google", { redirectTo: "/admin" })
                    }}
                >
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    )
}
