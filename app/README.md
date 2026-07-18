# 皮膚科クイズ Web App

30症例を日本時間で日替わり表示する、4択式のモバイル向けPWAです。ビルド処理や外部依存関係はありません。

## ローカルで開く

プロジェクトルートで次を実行します。

```sh
python3 -m http.server 4173 -d app
```

ブラウザで `http://localhost:4173` を開きます。

同じWi-Fi上のiPhoneから確認する場合は、MacのローカルIPアドレスを使って `http://<MacのIP>:4173` を開きます。PWAのオフライン機能やホーム画面追加を安定して使うには、HTTPSでの公開が必要です。

## 日替わり動作

- `app/data/cases.js` にある30症例から、日本時間の0時に1例ずつ切り替わります。
- 30日後は先頭に戻ります。プールを追加すれば周期を延ばせます。
- `?case=0` から `?case=29` をURL末尾に付けると、公開前テスト用に任意の症例を表示できます。
- 初回画面には診断、著者、論文タイトル、URLを表示しません。

## GitHub Pages

`main` ブランチへの更新時に、症例データ検証を通過した場合だけ `.github/workflows/pages.yml` が `app/` をGitHub Pagesへ公開します。GitHub側でPagesのSourceを `GitHub Actions` に設定してください。

## 収録症例

- JAAD Case ReportsのCC BY 4.0症例30件
- 本文、画像、患者同意、PubMed/DOIを個別確認済み
- 各症例の正式な出典は回答後画面に表示
