# Dermatology Case Quiz

比較的新しい皮膚科の画像付き症例を探索し、診断を伏せた日本語クイズとして提示するプロジェクトです。

## 現在地

- 2026-07-18: プロジェクトの骨組みを作成
- 実装前。まず専用のCodexチャットで手動MVPを設計する
- 初回出題形式は `docs/dermatology_case_quiz_handoff_v2.md` の第16節を正とする

## 最初に読むもの

1. `AGENTS.md`
2. `docs/decisions.md`
3. `docs/dermatology_case_quiz_handoff_v2.md`
4. `START-HERE.md`

## 構成

- `case_history.md`: 出題済み症例の重複防止
- `search_log.md`: 候補、除外理由、検証結果
- `prompts/daily_case_search.md`: 初回出題用プロンプト
- `prompts/answer_reveal.md`: 回答後の開示用プロンプト
- `docs/`: 引き継ぎ仕様と設計判断

## 推奨する進め方

1. まず1問を手動で探索・検証・出題する
2. 出題と回答後開示の品質を数回確認する
3. 画像ライセンスと表示方法を決める
4. その後に毎日20:00の自動化と通知方法を設計する

コード、依存関係、配信方式はまだ決めていません。実運用を試す前に作り込みすぎない方針です。
