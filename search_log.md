# Search Log

候補記事、除外理由、事実確認、URL確認、画像ライセンス確認を記録します。検索結果のスニペットだけで採用しません。

## Template

### YYYY-MM-DD

- Candidate:
- Decision: 採用 / 除外
- Reason:
- Full-text verification:
- PubMed / DOI verification:
- URL check:
- Image availability:
- License / display assessment:
- Duplicate check:

## 2026-07-18: 30症例プール作成

- Candidate source: Europe PMCで `JAAD Case Rep`、open access、2024-2026を検索。1,352件を確認し、直近候補60件のPMC全文XMLを取得。
- Decision: CC BY 4.0、臨床画像、症例記述、患者同意記載、PubMed/DOIを確認できた30件を採用。
- Full-text verification: 各PMCIDのPMC JATS全文で年齢、性別、部位、経過、診断、画像キャプション、患者同意を確認。
- PubMed / DOI verification: Europe PMC/PubMedメタデータと本文中のPMID・DOIを照合。詳細は `app/data/cases.js` と `case_history.md` に記録。
- URL check: 30件すべてのPMC本文URLとNCBI CDN画像URLを確認。ブラウザで全画像の正常読込と自然寸法を確認。
- Image availability: 30件とも臨床画像を `app/assets/cases/<pmcid>.jpg` に未加工で保存。
- License / display assessment: 30件すべて記事本文に明記されたCC BY 4.0。初回画面でライセンスを示し、回答後に著者、原題、PMC、PubMed、DOI、ライセンス、未加工である旨を表示。
- Exclusions: CC BY-NC-ND/CC BY-NC、臨床画像なし、患者同意記載を確認できない候補、症例クイズとして不向きな候補を除外。
- Duplicate check: PMCID、PMID、DOIで30件相互および既出1件との重複を検査。既出1件はプール先頭として再利用。
- Adopted PMCIDs: PMC13140061, PMC13234209, PMC13251510, PMC13251496, PMC13279893, PMC13191258, PMC13213215, PMC13224119, PMC13241892, PMC13242016, PMC13242034, PMC13251472, PMC13251495, PMC13280132, PMC13191250, PMC13196434, PMC13242013, PMC13251508, PMC13279917, PMC13285215, PMC13285216, PMC13285225, PMC13202008, PMC13251507, PMC13241895, PMC13241872, PMC13213216, PMC13242019, PMC13251471, PMC13224111.
