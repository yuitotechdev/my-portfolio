# CONTENT_MODEL.md — Data Model & API Contract

Prompt ID: promptops-spec-20260130-003  
Version: v1.0.0  
Last Updated: 2026-01-30

> ここは「データの正」。UIはこのモデルを描画するだけ。
> DBが変わっても、Export/Importはこの形で維持する。

---

## 1) Entities（概念）
- profile（プロフィール）
- links（SNS/外部リンク）
- works（制作物）
- products（販売物）
- devices（デバイス）
- news（お知らせ）
- posts（ブログ）
- stats_events（任意：クリック等の自前イベント。最初は外部Analytics中心）

---

## 2) JSON Export Format（/adminで出力する形）
```json
{
  "version": "content-export-v1",
  "exported_at": "2026-01-30T00:00:00Z",
  "profile": { },
  "links": [ ],
  "works": [ ],
  "products": [ ],
  "devices": [ ],
  "news": [ ],
  "posts": [ ]
}
