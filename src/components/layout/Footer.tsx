import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
                <div className="font-medium">
                    © {new Date().getFullYear()} Portfolio. All rights reserved.
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/stats" className="hover:text-indigo-600 transition-colors">Stats</Link>
                    <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                </div>
            </div>
        </footer>
    )
}
