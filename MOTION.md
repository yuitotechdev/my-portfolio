# MOTION.md — Motion System & Rules

Prompt ID: promptops-spec-20260131-001  
Version: v1.3.0  
Last Updated: 2026-01-31

> モーションは「美しさ」より「操作フィードバック＋理解補助」。
> 全画面（本体/管理）で共通ルールを守る。

---

## 1. グローバル規約（Hydraulic Response）
> **「初動は敏感、止まり際はしっとり」**
> 全てのアニメーションに物理演算（Spring）を適用し、重量感と信頼を作る。

### 1.1 Motion Tokens (Spring)
`src/config/motion.ts` で一元管理する。

| Token | Stiffness | Damping | Mass | 用途 |
| :--- | :--- | :--- | :--- | :--- |
| **`spring.rapid`** | 400 | 30 | 0.8 | Micro (Hover, Click, Toggle) |
| **`spring.smooth`** | 280 | 30 | 1.0 | Navigation, Page Transition, Modal |
| **`spring.heavy`** | 180 | 30 | 1.2 | Hero Reveal, Large Layout Change |

### 1.2 Ease (Fade/Color)
物理演算が不要なプロパティ（Opacity/Color）用。
- `ease.out`: `[0.22, 1, 0.36, 1]` (cubic-bezier)

### 1.3 Limits
- Navigation duration: Max **0.4s**
- Stagger total: Max **0.8s**

---

## 2. 必須モーション（UI別）
### 2.1 Buttons / Links
- hover：軽い持ち上がり＋glow（控えめ）
- press：scale down + shadow弱め
- focus：リング/アウトラインを必ず表示（消さない）

### 2.2 Cards（Works/Blogなど）
- hover：微細な浮き＋背景ノイズ/グロー
- click：詳細遷移の前に“選択された”フィードバック（短い）

### 2.3 Page Transition（重要）
- 目的：読み込み感を消し、どこに移動したか分かる
- 実装：上部バー/背景レイヤー/主役要素の順で入れる
- 戻る操作も同じ言語で

### 2.4 Scroll (In-view reveal)
- 基本：opacity + y の軽いreveal
- 強演出：Homeのヒーロー or 代表作品のセクションなど1〜2箇所だけ

### 2.5 Admin UX（同一世界観）
- 入力欄：focus時の視認性が最優先
- 保存/削除：toast or inline feedbackで確実に伝える
- 並び替え：ドラッグUIは軽く。重い演出禁止

---

## 3. Motion Tolerance (Guardrails)
### 3.1 Motion Toggle
`prefers-reduced-motion` とサイト内設定 `high / safe / minimal` で制御。

| Mode | Parallax | Scale | Transition |
| :--- | :--- | :--- | :--- |
| **High** (Default) | ON | ON | Spring (Move+Fade) |
| **Safe** | **OFF** (0) | **OFF** (1.0) | Spring (Move+Fade) |
| **Minimal** | **OFF** (0) | **OFF** (1.0) | **Fade / Instant** |

### 3.2 禁止事項
1.  **Layout Thrashing**: height/widthアニメーションで周囲をガタつかせない（`layout` prop使用時は注意）
2.  **Scroll Jacking**: スクロール慣性を奪わない
3.  **Zombie Animation**: 操作終了後に動き続けない
4.  **Disappearing Act**: マウスアウトで唐突に消さない（逆再生必須）

---

## 4. パフォーマンスルール
- アニメは transform / opacity を基本に
- layoutを頻繁に変えるアニメ禁止（height/width/top/left多用NG）
- スクロール連動は計算負荷が上がりやすい：見せ場以外は避ける
