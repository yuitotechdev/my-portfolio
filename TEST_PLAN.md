# 検証計画 (Verification Plan)

## 1. 前提条件 (Prerequisites)
- `.env.local` が完全に設定されていること (`AUTH_SECRET`, `GOOGLE_*`, `ADMIN_EMAIL`, `SUPABASE_*`)。
- `npm run dev` でローカルサーバーが起動していること。
- アクセス先: `http://localhost:3000`

## 2. 管理画面認証 (Admin Authentication)
### シナリオ: 管理者ログイン
1. `http://localhost:3000/admin` にアクセスする。
   - **期待値**: `/admin/login` にリダイレクトされる。
2. "Sign in with Google" をクリックする。
3. `.env.local` の `ADMIN_EMAIL` に設定した Google アカウントでログインする。
   - **期待値**: `/admin` ダッシュボード（または `/admin/works`）にリダイレクトされ、管理画面が表示される。

### シナリオ: 権限のないアクセス (オプション)
1. `ADMIN_EMAIL` 以外の Google アカウントでログインを試みる。
   - **期待値**: `403 Forbidden` 画面が表示され、管理機能にはアクセスできない。

## 3. Works CRUD (主要機能)
### シナリオ: 作品の新規作成 (Create)
1. `http://localhost:3000/admin/works` に移動する。
2. "Add New Work" をクリックする。
3. **画像アップロード**: 画像ファイルを選択し、プレビューが表示されることを確認する。
4. **フォーム入力**:
   - Title: "Test Work 001"
   - Slug: "test-001" (重複しない一意な値)
   - Description: "これはテスト用の説明文です。"
   - Tech Stack: "Next.js, Supabase"
   - URLs: (任意)
   - **Publish**: "Publish immediately" にチェックを入れる（重要）。
5. "Create Work" をクリックする。
   - **期待値**: `/admin/works` 一覧に戻り、新しい項目が "Public" ステータスで表示される。

### シナリオ: 公開側の確認 (Public Reflection)
1. 新しいタブまたは非公開ウィンドウを開く。
2. `http://localhost:3000/works` にアクセスする。
3. **期待値**: "Test Work 001" のカードが表示され、アップロードしたサムネイル画像が見えている。

### シナリオ: 作品の編集 (Edit)
1. 管理画面 (`/admin/works`) に戻り、"Test Work 001" の "Edit" をクリックする。
2. Title を "Test Work 001 (Updated)" に変更する。
3. "Publish" のチェックを **外す**（非公開にする）。
4. "Update Work" をクリックする。
   - **期待値**: 一覧に戻り、ステータスが "Draft" に変わっている。
5. 公開側 (`/works`) を確認する。
   - **期待値**: リロードすると、その作品が **一覧から消えている**（非表示になっている）。

### シナリオ: 作品の削除 (Delete)
1. 管理画面 (`/admin/works`) で、対象の作品の "Delete" ボタンをクリックする。
2. **期待値**: 一覧からその作品が完全に削除される。公開側にも表示されない。
