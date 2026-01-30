# DECISIONS.md — Decision Log (Why we chose this)

Prompt ID: promptops-spec-20260130-003  
Format: YYYY-MM-DD / Decision / Reason / Impact

---

## 2026-01-30
### 1) 自作管理画面（/admin）にする
- Reason: 本体と同一デザイン/モーションで統一し、“作品”として見せるため
- Impact: 実装は増えるがAI臭が消え、採用・依頼に刺さる

### 2) 認証はGoogle + allowlist（管理者1人）
- Reason: どこでもログインでき、運用が簡単。権限管理を最小化できる
- Impact: Google OAuth設定が必要。セキュリティは明確化できる

### 3) 即公開（下書き運用は今は不要）
- Reason: 更新を最速にする。運用コストを下げる
- Impact: 将来必要なら公開フラグだけ残して拡張可能

### 4) 画像は作品サムネのみ
- Reason: 0円枠で現実的に運用しやすい。速度にも効く
- Impact: 表現は減るが一貫性と軽さが出る

### 5) 初期は0円運用（Vercel + Supabase + 無料Analytics）
- Reason: コスト0で公開・運用開始したい
- Impact: 無料枠の制限を織り込み、移行容易性（Export/Import）を必須化

### 6) ブログ/お知らせ/統計は全部入れる
- Reason: 継続更新の証明・信頼の積み上げになる
- Impact: コンテンツモデルと/adminのCRUDが増える（運用マニュアル必須）
