# Mono Chat

![alt text](<pic.png>)

ReactとTypeScriptで構築されたミニマリストなチャットインターフェースです。Cerebras、OpenAI、Anthropicなど、複数のAIプロバイダーに対応し、マークダウン対応とリアルタイムストリーミングレスポンスを特徴とする、クリーンで直感的なAIチャット体験を提供します。

## 特徴

- クリーンで直感的なチャットインターフェース
- 浮石のようなUIによる動的なモデル切り替え機能
- タイピング効果のあるリアルタイムストリーミングレスポンス
- マークダウン形式のメッセージ表示対応
- コードブロックのシンタックスハイライトとコピー機能
- モダンなニューモーフィックスタイルのレスポンシブデザイン
- 効率的な操作のためのキーボードショートカット

## 技術スタック

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Markdown

## 前提条件

開始する前に、以下が必要です：
- Node.js（最新のLTSバージョン推奨）
- npm（Node.jsに付属）
- 使用したいサービス（Cerebras、OpenAI、Anthropic）のAPIキー

## インストール

1. リポジトリをクローンします：
```bash
git clone https://github.com/foxn2000/Mono-Chat.git
cd mono-chat
```

2. 依存関係をインストールします：
```bash
npm install
```

3. ルートディレクトリに`.env`ファイルを作成します：
```bash
cp .env.example .env
```

4. `.env`ファイルにAPIキーを追加します：
```
# Cerebras API設定
VITE_CEREBRAS_API_KEY=your_cerebras_api_key_here

# OpenAI API設定
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API設定
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

5. `models.yaml`でモデルを設定します：
```yaml
models:
  # デフォルトで使用するモデル
  default: cerebras-llama4

  # 利用可能なモデル
  available:
    cerebras-llama4:
      name: llama-4-scout-17b-16e-instruct
      baseUrl: https://api.cerebras.ai/v1/chat/completions
      apiKeyEnvName: VITE_CEREBRAS_API_KEY
      defaultParams:
        temperature: 0.7
        max_tokens: 1000
    # 必要に応じて他のモデルを追加
```

## 使用方法

1. 開発サーバーを起動します：
```bash
npm run dev
```

2. ブラウザで`http://localhost:5173`にアクセスします

3. メッセージを入力し、以下のキーを押して送信します：
   - Ctrl+Enter（Windows/Linux）または
   - Cmd+Enter（macOS）

### 機能ガイド

- **メッセージ入力**：下部の入力フィールドにメッセージを入力
- **メッセージ送信**：Ctrl+Enter（macOSではCmd+Enter）で送信
- **テキストのコピー**：メッセージをクリックして内容をコピー
- **コードブロック**：コードスニペットは自動的にフォーマットされ、クリックでコピー可能
- **モデル選択**：画面左上にマウスを合わせると浮石のようにモデルセレクターが現れます。クリックすると利用可能なモデルの一覧が表示され、選択できます

## 開発

### プロジェクト構造

```
mono-chat/
├── src/
│   ├── api/          # API連携とファクトリー
│   ├── components/   # Reactコンポーネント
│   ├── config/       # 設定管理
│   ├── hooks/        # カスタムReactフック
│   ├── styles/       # CSSスタイル
│   ├── types/        # TypeScript型定義
│   └── assets/       # 静的アセット
├── public/           # 公開アセット
├── models.yaml       # モデル設定
└── ...config files   # 各種設定ファイル
```

### 利用可能なスクリプト

- `npm run dev` - 開発サーバーの起動
- `npm run build` - プロダクションビルド
- `npm run preview` - プロダクションビルドのプレビュー
- `npm run lint` - ESLintの実行

## 環境変数

以下の環境変数がサポートされています：

- `VITE_CEREBRAS_API_KEY`: Cerebras APIキー
- `VITE_CEREBRAS_BASE_URL`: Cerebras APIのベースURL（デフォルトは https://api.cerebras.ai/v1）
- `VITE_OPENAI_API_KEY`: OpenAI APIキー
- `VITE_ANTHROPIC_API_KEY`: Anthropic APIキー

## モデル設定

モデルは`models.yaml`ファイルで設定します。以下が可能です：

- デフォルトモデルの設定
- 異なるプロバイダーからの複数のモデルの設定
- モデルパラメータ（temperature、max tokensなど）のカスタマイズ
- 新しいモデルの簡単な追加

このアプリケーションは、以下を含むOpenAI API互換のサービスをサポートしています：
- Cerebras AI
- OpenAI
- Anthropic
- その他のOpenAI API互換サービス

## コントリビューション

コントリビューションを歓迎します！Pull Requestをお気軽にご提出ください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています - 詳細はLICENSEファイルをご覧ください。
