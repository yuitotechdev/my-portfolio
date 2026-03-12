'use client'

import { executeImport, exportData, type ImportSummary, validateImport } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export function BackupManager() {
    const [loading, setLoading] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [importSummary, setImportSummary] = useState<ImportSummary | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = async () => {
        try {
            setLoading(true)
            const data = await exportData()

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)

            toast.success('バックアップを保存しました')
        } catch (error) {
            console.error(error)
            toast.error('バックアップの作成に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return
        }

        const file = event.target.files[0]
        setImportFile(file)
        setImportSummary(null)

        try {
            setLoading(true)
            const text = await file.text()
            const summary = await validateImport(text)
            setImportSummary(summary)

            if (!summary.valid) {
                toast.error('バックアップファイルに問題があります。内容を確認してください。')
            } else {
                toast.info('バックアップファイルを確認しました。問題なければ取り込みを実行できます。')
            }
        } catch (error) {
            console.error(error)
            toast.error('ファイルの読み込みに失敗しました')
        } finally {
            setLoading(false)
        }
    }

    const handleExecuteImport = async () => {
        if (!importFile) {
            return
        }

        if (!confirm('現在のデータを上書きします。続行しますか？')) {
            return
        }

        try {
            setLoading(true)
            const text = await importFile.text()
            await executeImport(text)
            toast.success('バックアップを取り込みました')

            setImportFile(null)
            setImportSummary(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (error) {
            console.error(error)
            toast.error('バックアップの取り込みに失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-2 text-sm font-medium text-gray-900">データを書き出す</h3>
                <p className="mb-4 text-sm text-gray-500">
                    制作実績、ブログ、お知らせ、プロフィール、リンクを JSON 形式で保存します。
                </p>
                <Button onClick={handleExport} disabled={loading} variant="outline">
                    {loading ? '処理中...' : 'バックアップをダウンロード'}
                </Button>
            </div>

            <hr className="border-gray-100" />

            <div>
                <h3 className="mb-2 text-sm font-medium text-gray-900">データを取り込む</h3>
                <p className="mb-4 text-sm text-gray-500">
                    JSON バックアップを選択して検証後に取り込みます。
                </p>
                <label className="block max-w-sm">
                    <span className="sr-only">ファイルを選択</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        onChange={handleFileSelect}
                        disabled={loading}
                        className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </label>

                {importSummary && (
                    <div className={`mt-6 rounded border p-4 ${importSummary.valid ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                        <h4 className="mb-2 font-semibold">取り込み結果</h4>

                        {!importSummary.valid && (
                            <div className="mb-4 text-sm text-red-600">
                                <p className="font-bold">見つかったエラー</p>
                                <ul className="list-disc pl-5">
                                    {importSummary.errors?.slice(0, 5).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                    {(importSummary.errors?.length || 0) > 5 && (
                                        <li>ほか {((importSummary.errors?.length || 0) - 5)} 件</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {importSummary.valid && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>制作実績: <span className="font-mono">{importSummary.counts.works}</span></div>
                                    <div>ブログ: <span className="font-mono">{importSummary.counts.posts}</span></div>
                                    <div>お知らせ: <span className="font-mono">{importSummary.counts.news}</span></div>
                                    <div>プロフィール: <span className="font-mono">{importSummary.counts.profile}</span></div>
                                    <div>リンク: <span className="font-mono">{importSummary.counts.links}</span></div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        onClick={handleExecuteImport}
                                        disabled={loading}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        {loading ? '取り込み中...' : '取り込みを実行する'}
                                    </Button>
                                    <p className="mt-2 text-center text-xs text-gray-500">
                                        実行すると現在のデータは上書きされます。
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
