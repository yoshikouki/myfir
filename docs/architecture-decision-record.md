# Architecture Decision Record (ADR)

## Package by Features によるディレクトリ設計

### 決定事項

プロジェクトのディレクトリ構造は **Package by Features（ユースケースベース）** パターンを採用する。

### 理由

- **複雑性の管理**: ユースケース単位で機能を分離することで、各機能の責務が明確になる
- **ユーザー中心設計**: ユーザーのゴールと実装が1:1で対応し、ビジネス価値が明確
- **独立性**: 各ユースケースが独立しているため、並行開発や変更の影響範囲を限定できる

### 設計方針

#### 1. フィーチャー境界の定義

**異なるユーザーゴール = 異なるフィーチャー**

```
src/features/
├── create-first-project/    # 初めてのプロジェクトを作る
├── browse-tutorials/        # チュートリアルを探す
├── track-progress/          # 進捗を確認する
└── share-achievement/       # 達成を共有する
```

#### 2. 命名規則

**ユーザー視点の動詞-目的語形式**

- ✅ 良い例: `create-project`, `browse-content`, `manage-settings`
- ❌ 悪い例: `project-crud`, `user-module`, `data-service`

#### 3. ディレクトリ構造

```
features/
└── [use-case-name]/
    ├── components/      # UIコンポーネント
    ├── hooks/          # カスタムフック
    ├── api/            # API通信
    ├── utils/          # ユーティリティ関数
    └── types.ts        # 型定義
```

#### 4. Public API なし

- 各フィーチャーからの直接インポートを許可
- index.ts によるバレルエクスポートは使用しない
- 明示的なインポートパスで依存関係を可視化

### 共有リソースの扱い

```
src/
├── features/           # ユースケース別機能
├── shared/            # 複数フィーチャーで使用
│   ├── components/    # 共通UIコンポーネント
│   ├── hooks/         # 共通フック
│   └── utils/         # 共通ユーティリティ
└── app/               # Next.js App Router
```

### 今後の拡張性

- 新機能追加時は新しいユースケースフォルダを作成
- 既存フィーチャーの肥大化を防ぐため、ユーザーゴールが異なれば分割
- フィーチャー間の依存は最小限に保つ

### 参考

- [Screaming Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- Feature-Based Folder Structure Pattern (2024)

## 状態管理とデータフェッチング戦略

### フィーチャー間での状態共有

**原則**: 各フィーチャーは独立した状態を持つ

**共有が必要な場合**:
- 共通する状態のみを Context として切り出した新たな feature を作成
- 例: `user-context/` フィーチャーとしてユーザー情報を管理

```
features/
├── user-context/           # ユーザー情報の共有状態
│   ├── components/
│   │   └── UserProvider.tsx
│   └── hooks/
│       └── useUser.ts
└── create-profile/         # ユーザーコンテキストを利用
```

### データフェッチング戦略

**基本原則**: React Server Component (RSC) によるデータ取得

1. **サーバーサイドでのデータ取得を優先**
   - RSC でデータをフェッチし、props として Client Component に渡す
   - SEO とパフォーマンスの観点から最も推奨

2. **クライアントサイドフェッチが必要な場合**
   - ユーザーインタラクションに応じた動的なデータ取得
   - クライアントの情報（ブラウザAPI等）が必要な場合
   - この場合は Server Actions を使用

### 外部依存の扱い（DI パターン）

**Server Actions と fetch は「外部依存」として扱う**

#### 1. Props による注入（推奨）

```tsx
// デフォルト実装を提供
interface ProjectFormProps {
  onSubmit?: (data: ProjectData) => Promise<void>
}

function ProjectForm({ 
  onSubmit = createProjectAction // デフォルトの Server Action
}: ProjectFormProps) {
  // 実装
}
```

#### 2. Context による注入（Props Drilling 回避時のみ）

```tsx
// 深い階層で Server Action が必要な場合のみ検討
const ApiContext = createContext<ApiHandlers>()

// 使用は最小限に留める
```

**重要**: Context での DI を検討する前に、コンポーネント設計（children の活用など）で解決できないか再検討する

### バリデーション

**zod** を標準的なバリデーションライブラリとして採用

```tsx
// features/create-project/schemas/project.ts
import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional()
})
```

## 今後の検討事項

以下の事項は、必要になった時点で議論・決定する：

### 1. テスト戦略
- ユースケース単位でのテスト方針
- モックの扱い方
- E2E テストとの境界

### 2. エラーハンドリング
- エラーバウンダリの配置
- エラー通知の統一的な扱い
- リトライ戦略

### 3. パフォーマンス最適化
- Code Splitting の粒度
- 画像最適化戦略
- キャッシング戦略

### 4. 認証・認可
- 認証フローの実装パターン
- ルートガードの実装方法
- セッション管理

### 5. 国際化（i18n）
- 多言語対応が必要になった場合の実装方針
- 翻訳ファイルの管理方法

これらは実際のニーズが発生した時点で、具体的な要件に基づいて設計を行う。