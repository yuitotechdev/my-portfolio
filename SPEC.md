# SPEC.md — Portfolio Web + Admin CMS (Single Source of Truth)

Prompt ID: promptops-spec-20260131-001  
Version: v1.3.0  
Last Updated: 2026-01-31  
Owners: わわわ（管理者）

> このファイルは仕様の唯一の正（Single Source of Truth）。
> 実装・修正は必ずこのSPECに従う。矛盾や未定義がある場合は **実装より先にSPECを更新** する。

---

## 1. ゴール
- 就活（採用担当）/一般/クライアント/コミュニティに刺さる **実績提示＋集客** ポートフォリオサイトを公開する
- **モーションが気持ちいい**（全操作に一貫したフィードバック）かつ **体感サクサク**
- **どこからでも更新できる** 自作管理画面 `/admin` を提供する（本体と同一デザイン/モーション）
- 初期は **0円運用優先**。将来の課金・移行（DB/Storage/Analytics）を詰ませない

---

## 2. ターゲット
- 採用担当（技術/非技術）
- 一般ユーザー
- クライアント（制作依頼検討）
- 友達/コミュニティ

---

## 3. 体験方針（最重要）
## 3. 体験方針（Premium Feel）
- **Hydraulic Response**：初動は敏感（即反応）、止まり際はしっとり（慣性/減衰）。Springアニメで統一
- **Motion-as-feedback**：動きは飾りではなく「押せた/移動した/完了した」を伝える言語
- **Layered Motion**：
    - **Micro**: Always (吸い付く/遅延ゼロ)
    - **Navigation**: Blocking (誤操作防止/0.4s以内)
    - **Scroll**: Throttled (節度あるReveal/逆スクロールで消さない)
    - **Delight**: Once (Hero等は1回のみ)
- **Low-spec Dignity**：`motion-preference` に応じて high/safe/minimal に縮退。OFFでも「美しい静止」を作る
- **Guardrails**：Scroll Jacking禁止、Layout Thrashing禁止、Input Lag禁止

---

## 4. ページ構成（本体）
必須：
- `/` Home（要約：強み/スタック/代表作/CTA）
- `/works` Works一覧
- `/works/[slug]` Works詳細
- `/products` Products一覧（販売物リンク）
- `/devices` Devices（使用デバイス紹介）
- `/news` News一覧（お知らせ）
- `/news/[slug]` News詳細
- `/blog` Blog一覧
- `/blog/[slug]` Blog詳細
- `/about` About（プロフィール詳細/設計思想/制作ポリシー）
- `/contact` Contact（メール中心：コピー/難読化方針）

任意（後で追加可）：
- `/stats` 公開用Stats（見せたい範囲だけ。内部は/adminで）

---

## 5. 管理画面（/admin）
### 5.1 認証・権限
- Googleログイン必須
- allowlist（管理者のGoogleメール1件）以外はアクセス不可
- 管理者は本人のみ（共同編集なし）

### 5.3 UXパターン (Premium Admin)
- **楽観的UI**：保存ボタン押下で即「成功」表示。裏で通信し、失敗時のみRollback
- **Draft Status**：下書き/公開を色で明確化
- **Auto-Save**：記事編集はLocalStorageへ自動保存
- **Image UX**：アップロード中はSkeleton＋SmartImage。失敗時はプレビュー維持＋再試行ボタン

### 5.4 画像
- 作品サムネのみ（works.thumbnail）
- **SmartImage標準化**：Skeleton + onLoadフェードインで「パッと出る」空白を防ぐ

---

## 6. データ方針（後で移行しやすく）
- データアクセスは **Repository層** を経由（DB差し替え可能）
- `/admin` から **Export/Import（JSON）** を提供（移行の生命線）
- 画像ストレージも抽象化（StorageRepository）

---

## 7. 技術スタック（第一候補）
- Next.js（App Router）
- Vercel（Hobby）
- DB/Auth/Storage：Supabase（Free→必要なら有料へ）
- Auth：Auth.js（Google Provider）
- Animation：GSAP or Motion（どちらかに統一）＋必要ならLenis
- Analytics：Cloudflare Web Analytics（無料）＋ Vercel Speed Insights（速度計測）

※代替（将来）：DB→Firebase/Neon 等、Storage→S3/Cloudinary 等

---

## 8. パフォーマンス要件（ガチ）
- 体感「重い」を出さない（スクロール/入力/遷移）
- アニメは transform/opacity中心
- 画像：next/image を必須。WebP/AVIF + lazyload。サムネ最大幅を制限
- 重要指標：LCP / INP / CLS が悪化したら改善が最優先

---

## 9. モーション要件（詳細は MOTION.md）
- 全てのUI操作（hover/press/focus/遷移/ロード）に一貫した動き
- prefers-reduced-motion の縮退実装必須
- 強演出は“見せ場”のみ

---

## 10. NG（やらないこと）
- 管理画面だけ既製CMSの見た目で世界観が崩れる
- 常時重いWebGL/動画で体感が落ちる
- 目的のない常時アニメ（情報理解と操作を邪魔する）
- 戻れない導線、読めない配色、フォーカスが消えるUI

---

## 11. Done 定義（完了条件）
MVP完了条件：
- 本体：Home/Works/Products/Devices/News/Blog/About/Contact が閲覧できる
- /admin：Googleログイン + allowlist + 各コンテンツCRUD + サムネアップロード
- Export/Import（JSON）が動く
- prefers-reduced-motion縮退が動く
- 速度劣化がない（明らかに重くない）

---

## 12. 変更ルール
- 仕様変更 → SPEC.mdを更新 → DECISIONS.mdに理由を記録 → 実装
- 実装中に迷いが出たら「仕様不足」。勝手に決めずにSPECへ追記案を出す

---

## 13. Open Questions（未確定）
- Blog本文エディタ方式：Markdownで十分か、リッチテキストが要るか
- メールの見せ方：表示/コピーのみ/難読化（JSで組み立て等）
