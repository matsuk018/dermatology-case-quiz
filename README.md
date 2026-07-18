# Dermatology Case Quiz

比較的新しい皮膚科の画像付き症例を探索し、診断を伏せた日本語クイズとして提示するプロジェクトです。

## 現在地

- 2026-07-18: 30症例の4択式日替わりPWAを実装
- JAAD Case ReportsのCC BY 4.0症例30件を検証・収録済み
- GitHub Pagesの自動公開ワークフローを追加済み（GitHub接続・初回公開は未実施）
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
- `app/`: iPhone対応の日替わり4択Webアプリ
- `scripts/validate-cases.mjs`: 公開前の症例データ検査
- `.github/workflows/pages.yml`: GitHub Pages自動公開
- `docs/`: 引き継ぎ仕様と設計判断

## 推奨する進め方

1. GitHubリポジトリを作成してこのフォルダを接続する
2. GitHub PagesのSourceを `GitHub Actions` に設定する
3. iPhoneでホーム画面追加とオフライン表示を確認する
4. 残数が少なくなる前に、同じ検証基準で症例プールを補充する

公開症例のみを使用し、大学認証、購読PDF、ユーザーの患者資料は扱いません。
