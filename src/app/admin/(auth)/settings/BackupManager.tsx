'use client'

import { exportData, validateImport, executeImport, ImportSummary } from '@/app/actions/settings'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function BackupManager() {
    const [loading, setLoading] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [importSummary, setImportSummary] = useState<ImportSummary | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = async () => {
        try {
            setLoading(true)
            const data = await exportData()

            // Create downloadable file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success('エクスポートが完了しました！')
        } catch (e) {
            console.error(e)
            toast.error('エクスポートに失敗しました。')
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        setImportFile(file)
        setImportSummary(null)

        try {
            setLoading(true)
            const text = await file.text()
            const summary = await validateImport(text)
            setImportSummary(summary)

            if (!summary.valid) {
                toast.error('無効なバックアップファイルです。以下のエラーを確認してください。')
            } else {
                toast.info('バックアップファイルが検証されました。インポート前に概要を確認してください。')
            }
        } catch (e) {
            console.error(e)
            toast.error('ファイルの検証に失敗しました。')
        } finally {
            setLoading(false)
        }
    }

    const handleExecuteImport = async () => {
        if (!importFile) return

        if (!confirm('この操作により既存のデータが上書き/更新されます。元に戻すことはできません。よろしいですか？')) {
            return
        }

        try {
            setLoading(true)
            const text = await importFile.text()
            await executeImport(text)
            toast.success('インポートが完了しました！データが復元されました。')

            // Reset
            setImportFile(null)
            setImportSummary(null)
            if (fileInputRef.current) fileInputRef.current.value = ''

        } catch (e) {
            console.error(e)
            toast.error('インポートの実行に失敗しました。')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Export Section */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">データのエクスポート</h3>
                <p className="text-sm text-gray-500 mb-4">
                    すべてのコンテンツ（実績、投稿、お知らせ、プロフィール、リンク）のJSONバックアップをダウンロードします。
                </p>
                <Button
                    onClick={handleExport}
                    disabled={loading}
                    variant="outline"
                >
                    {loading ? '処理中...' : 'バックアップをダウンロード'}
                </Button>
            </div>

            <hr className="border-gray-100" />

            {/* Import Section */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">データのインポート</h3>
                <p className="text-sm text-gray-500 mb-4">
                    JSONバックアップからデータを復元します。まずファイルを選択して検証してください。
                </p>
                <label className="block max-w-sm">
                    <span className="sr-only">ファイルを選択</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        onChange={handleFileSelect}
                        disabled={loading}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100
                            transition-all cursor-pointer
                          "
                    />
                </label>

                {/* Validation Summary */}
                {importSummary && (
                    <div className={`mt-6 p-4 rounded border ${importSummary.valid ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                        <h4 className="font-semibold mb-2">インポート概要</h4>

                        {!importSummary.valid && (
                            <div className="text-red-600 text-sm mb-4">
                                <p className="font-bold">見つかったエラー:</p>
                                <ul className="list-disc pl-5">
                                    {importSummary.errors?.slice(0, 5).map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                    {(importSummary.errors?.length || 0) > 5 && (
                                        <li>...他 {(importSummary.errors?.length || 0) - 5} 件</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {importSummary.valid && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>WORKS_CONST: <span className="font-mono">{importSummary.counts.works}</span></div>
                                    <div>ブログ投稿: <span className="font-mono">{importSummary.counts.posts}</span></div>
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
                                        {loading ? '復元中...' : '復元を確定する (上書き)'}
                                    </Button>
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                        この操作により、既存のレコードが更新され、新しいレコードが挿入されます。
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
