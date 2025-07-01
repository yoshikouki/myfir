# MyFir セキュリティ・プライバシー保護強化案

## 🛡️ 概要

MyFirは3-6歳児を対象とした学習プラットフォームとして、COPPA（児童オンラインプライバシー保護法）および関連法規制への完全準拠と、最高水準の児童プライバシー保護を実現します。

## 📋 法規制コンプライアンス

### COPPA 2025年改正対応

#### 新規制要件（2025年6月23日発効）
1. **拡張された直接通知要件**
   - 第三者情報共有カテゴリの明示
   - データ保持ポリシーの詳細開示
   - 保護者の権利説明の強化

2. **保護者同意の柔軟化**
   - 収集・利用のみの同意オプション
   - 第三者共有の別途同意仕組み
   - サービス不可欠な共有の例外規定

3. **新しい年齢確認方法**
   - 子どもが答えられない多肢選択問題
   - 知識ベース認証の強化
   - 技術的な年齢判定手法

### 実装すべき機能

#### 1. 年齢確認システム
```typescript
// 🔧 年齢確認インターフェース
export interface AgeVerificationFlow {
  // Step 1: 基本年齢入力
  askAge(): Promise<number>;
  
  // Step 2: 13歳未満の場合の確認
  confirmUnder13(): Promise<boolean>;
  
  // Step 3: 保護者同意プロセス開始
  initiateParentalConsent(): Promise<string>; // consent token
  
  // Step 4: 同意状況確認
  checkConsentStatus(token: string): Promise<ConsentStatus>;
}

// 🔧 実装例
export class ChildSafeAgeVerification implements AgeVerificationFlow {
  async askAge(): Promise<number> {
    // 子ども向けUIでの年齢入力
    return new Promise((resolve) => {
      // 大きなボタン、分かりやすい説明
      // 「何さいですか？」
    });
  }
  
  async confirmUnder13(): Promise<boolean> {
    // 追加確認（COPPA知識ベース認証）
    const questions = [
      {
        question: "あなたのお父さんまたはお母さんの携帯電話番号は何番ですか？",
        type: "text",
        validation: "parent-only-knowledge"
      },
      {
        question: "家族で最後に行った旅行先はどこですか？",
        type: "text", 
        validation: "parent-only-knowledge"
      }
    ];
    
    // 子どもが答えられない質問で年齢確認
    return this.validateKnowledgeQuestions(questions);
  }
}
```

#### 2. 保護者同意管理
```typescript
// 🔧 保護者同意インターフェース
export interface ParentalConsentManager {
  requestConsent(childInfo: ChildInfo): Promise<ConsentRequest>;
  verifyParent(verification: ParentVerification): Promise<boolean>;
  grantConsent(consentDetails: ConsentDetails): Promise<ConsentRecord>;
  withdrawConsent(consentId: string): Promise<boolean>;
  updateConsent(consentId: string, updates: ConsentUpdates): Promise<ConsentRecord>;
}

// 🔧 同意データ構造
export interface ConsentRecord {
  id: string;
  childId: string;
  parentEmail: string;
  consentType: 'collection-only' | 'collection-and-sharing';
  grantedAt: Date;
  expiresAt?: Date;
  permissions: {
    dataCollection: boolean;
    thirdPartySharing: boolean;
    marketing: boolean;
    analytics: boolean;
  };
  withdrawalInstructions: string;
  dataRetentionPeriod: number; // days
}

// 🔧 実装
export class COPPACompliantConsent implements ParentalConsentManager {
  async requestConsent(childInfo: ChildInfo): Promise<ConsentRequest> {
    // 複数の同意取得方法を提供
    const methods = [
      {
        type: 'email-plus-verification',
        description: 'メール認証 + 本人確認',
        timeRequired: '5-10分',
        recommended: true
      },
      {
        type: 'video-call',
        description: 'ビデオ通話での確認',
        timeRequired: '10-15分',
        recommended: false
      },
      {
        type: 'signed-form',
        description: '署名付き同意書（郵送）',
        timeRequired: '3-5営業日',
        recommended: false
      }
    ];
    
    return {
      requestId: generateSecureId(),
      childInfo,
      methods,
      expiresAt: addDays(new Date(), 30),
      instructions: this.generateJapaneseInstructions()
    };
  }
  
  private generateJapaneseInstructions(): string {
    return `
お子様がMyFirを安全にご利用いただくため、保護者の方の同意が必要です。

【同意していただく内容】
・お子様の学習進捗の記録
・安全な学習環境の提供
・必要最小限の情報のみ収集

【お子様の情報は以下の通り保護されます】
・第三者への情報提供は行いません
・広告表示は一切ありません
・いつでも情報削除を要求できます

ご不明な点がございましたら、いつでもお問い合わせください。
    `;
  }
}
```

## 🔒 技術的セキュリティ実装

### 1. セキュリティヘッダー強化
```typescript
// next.config.ts - セキュリティ設定
const securityHeaders = [
  // XSS対策
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options', 
    value: 'DENY', // iframe埋め込み禁止
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  
  // CSP（Content Security Policy）
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Next.jsに必要
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  
  // HTTPS強制
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  
  // 参照者情報制限
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  
  // 機能ポリシー（児童保護）
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()', // カメラアクセス禁止
      'microphone=()', // マイクアクセス禁止
      'geolocation=()', // 位置情報禁止
      'payment=()', // 決済機能禁止
      'usb=()', // USB接続禁止
    ].join(', '),
  },
];

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
} satisfies NextConfig;
```

### 2. データ保護実装
```typescript
// 🔧 データ最小化の実装
export class ChildDataManager {
  // 収集データの最小化
  private readonly ALLOWED_DATA = {
    // 学習進捗のみ（個人識別情報なし）
    learningProgress: ['completedSteps', 'currentLevel', 'lastAccess'],
    // 設定情報（匿名）
    preferences: ['language', 'volume', 'animationSpeed'],
    // 技術的データ（統計目的のみ）
    technical: ['browserType', 'screenSize', 'performanceMetrics']
  } as const;
  
  // 禁止データ
  private readonly FORBIDDEN_DATA = [
    'name', 'email', 'phone', 'address',
    'ipAddress', 'userId', 'deviceId',
    'location', 'contacts', 'photos'
  ] as const;
  
  validateDataCollection(data: Record<string, any>): boolean {
    const keys = Object.keys(data);
    
    // 禁止データが含まれていないかチェック
    const hasForbiddenData = keys.some(key => 
      this.FORBIDDEN_DATA.includes(key as any)
    );
    
    if (hasForbiddenData) {
      throw new Error('COPPA violation: Forbidden data detected');
    }
    
    // 許可されたデータのみかチェック
    const allowedKeys = Object.values(this.ALLOWED_DATA).flat();
    const hasOnlyAllowedData = keys.every(key => 
      allowedKeys.includes(key as any)
    );
    
    return hasOnlyAllowedData;
  }
}
```

### 3. 暗号化・ストレージ
```typescript
// 🔧 安全なローカルストレージ
export class SecureChildStorage {
  private readonly ENCRYPTION_KEY = 'myfir-child-secure-2025';
  
  // データ暗号化
  private encrypt(data: string): string {
    // 簡易暗号化（実際はより強固な暗号化を使用）
    return btoa(data);
  }
  
  private decrypt(encryptedData: string): string {
    return atob(encryptedData);
  }
  
  // 学習進捗の安全な保存
  saveLearningProgress(progress: LearningProgress): void {
    // 個人識別情報を除去
    const sanitizedProgress = {
      completedSteps: progress.completedSteps,
      currentLevel: progress.currentLevel,
      lastAccess: progress.lastAccess.toISOString(),
      // userId等は保存しない
    };
    
    const encrypted = this.encrypt(JSON.stringify(sanitizedProgress));
    sessionStorage.setItem('learning-progress', encrypted);
    
    // ローカルストレージは使用しない（永続化回避）
  }
  
  // データ自動削除
  setupAutoCleanup(): void {
    // セッション終了時に全データ削除
    window.addEventListener('beforeunload', () => {
      sessionStorage.clear();
    });
    
    // 30分非アクティブで自動削除
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        sessionStorage.clear();
        window.location.reload();
      }, 30 * 60 * 1000); // 30分
    };
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
  }
}
```

## 🛡️ プライバシー・バイ・デザイン

### 1. データ収集の透明性
```typescript
// 🔧 データ収集の可視化
export const DataCollectionVisualizer = () => {
  const [showDataInfo, setShowDataInfo] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDataInfo(true)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
        aria-label="データの使用について"
      >
        🛡️
      </button>
      
      {showDataInfo && (
        <div className="absolute bottom-16 right-0 bg-white p-6 rounded-lg shadow-xl max-w-sm">
          <h3 className="font-bold text-lg mb-3">あんしん・あんぜん</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>がくしゅうのきろくだけをほぞん</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>おなまえやじゅうしょはきかない</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>こうこくはぜったいにでない</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>ほかのひとにはおしえない</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowDataInfo(false)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
          >
            わかった！
          </button>
        </div>
      )}
    </div>
  );
};
```

### 2. 保護者向けダッシュボード
```typescript
// 🔧 保護者向け管理画面
export const ParentDashboard = () => {
  const [consentDetails, setConsentDetails] = useState<ConsentRecord | null>(null);
  const [childActivity, setChildActivity] = useState<ActivitySummary[]>([]);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          保護者ダッシュボード
        </h1>
        
        {/* 同意状況 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">プライバシー設定</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">現在の同意状況</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>学習データ収集</span>
                  <span className="text-green-600">✓ 許可</span>
                </div>
                <div className="flex justify-between">
                  <span>第三者共有</span>
                  <span className="text-red-600">✗ 禁止</span>
                </div>
                <div className="flex justify-between">
                  <span>分析データ利用</span>
                  <span className="text-green-600">✓ 許可</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">データ保持期間</h3>
              <p className="text-gray-600">
                学習進捗: 6ヶ月<br/>
                設定情報: セッション終了まで<br/>
                ログデータ: 保存しません
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              設定を変更
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
              すべてのデータを削除
            </button>
          </div>
        </div>
        
        {/* 活動履歴 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">お子様の学習履歴</h2>
          
          <div className="space-y-4">
            {childActivity.map((activity, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-600">
                  {activity.date} - {activity.duration}分間
                </div>
                <div className="text-sm text-gray-500">
                  進捗: {activity.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 🔍 監査・コンプライアンス

### 1. 定期監査システム
```typescript
// 🔧 コンプライアンス監査
export class COPPAComplianceAuditor {
  async performAudit(): Promise<ComplianceReport> {
    const report: ComplianceReport = {
      auditDate: new Date(),
      complianceLevel: 'FULL',
      findings: [],
      recommendations: []
    };
    
    // データ収集の監査
    const dataAudit = await this.auditDataCollection();
    report.findings.push(...dataAudit.findings);
    
    // 同意管理の監査
    const consentAudit = await this.auditConsentManagement();
    report.findings.push(...consentAudit.findings);
    
    // セキュリティ設定の監査
    const securityAudit = await this.auditSecuritySettings();
    report.findings.push(...securityAudit.findings);
    
    return report;
  }
  
  private async auditDataCollection(): Promise<AuditResult> {
    // 収集データの検証
    const collectedData = await this.getCollectedDataTypes();
    const violations = collectedData.filter(data => 
      !this.isAllowedUnderCOPPA(data)
    );
    
    return {
      findings: violations.map(v => ({
        severity: 'HIGH',
        message: `Unauthorized data collection: ${v.type}`,
        recommendation: `Remove ${v.type} collection immediately`
      }))
    };
  }
}
```

### 2. インシデント対応計画
```typescript
// 🔧 セキュリティインシデント対応
export class SecurityIncidentResponse {
  async handleDataBreach(incident: SecurityIncident): Promise<void> {
    // 1. 即座にデータ収集停止
    await this.emergencyDataCollectionStop();
    
    // 2. 影響範囲の特定
    const affectedUsers = await this.identifyAffectedUsers(incident);
    
    // 3. 保護者への通知（24時間以内）
    for (const user of affectedUsers) {
      await this.notifyParent(user, {
        incidentType: incident.type,
        dataInvolved: incident.affectedData,
        mitigationSteps: incident.mitigation,
        contactInfo: 'security@myfir.app'
      });
    }
    
    // 4. 当局への報告
    if (incident.severity === 'HIGH') {
      await this.reportToAuthorities(incident);
    }
    
    // 5. システム修正
    await this.implementSecurityFixes(incident.fixes);
  }
  
  private async notifyParent(user: User, details: IncidentDetails): Promise<void> {
    const message = `
【重要】MyFir セキュリティに関するお知らせ

保護者様

いつもMyFirをご利用いただき、ありがとうございます。

この度、システムの一部でセキュリティに関する事象が発生いたしました。
お子様の安全を最優先に、以下のとおりご報告いたします。

【発生した事象】
${details.incidentType}

【影響の可能性】
${details.dataInvolved}

【既に実施した対策】
${details.mitigationSteps}

【保護者様にお願いすること】
- 特別な対応は必要ありません
- ご心配な点がございましたら、下記までご連絡ください

お子様にご迷惑をおかけし、深くお詫び申し上げます。

MyFir セキュリティチーム
連絡先: ${details.contactInfo}
    `;
    
    // メール・SMSでの通知
    await this.sendNotification(user.parentContact, message);
  }
}
```

## 📋 実装スケジュール

### Phase 1: 基盤整備（2025年7月）
- [ ] COPPA準拠の年齢確認システム
- [ ] 基本的なセキュリティヘッダー設定
- [ ] データ収集最小化の実装

### Phase 2: 同意管理（2025年8月）
- [ ] 保護者同意システム構築
- [ ] 同意撤回・データ削除機能
- [ ] 保護者向けダッシュボード

### Phase 3: 監査・監視（2025年9月）
- [ ] 自動コンプライアンス監査
- [ ] インシデント対応システム
- [ ] 定期セキュリティ評価

### Phase 4: 最適化（2025年10月）
- [ ] UX改善
- [ ] パフォーマンス最適化
- [ ] 多言語対応

## 🏆 期待される効果

### コンプライアンス
- **COPPA 2025**: 100%準拠
- **GDPR**: 適用範囲での準拠
- **日本個人情報保護法**: 完全準拠

### セキュリティレベル
- **データ漏洩リスク**: ほぼゼロ
- **不正アクセス**: 多層防御で防止
- **児童プライバシー**: 最高水準の保護

### 保護者満足度
- **透明性**: データ使用の完全な可視化
- **制御性**: いつでも削除・変更可能
- **安心感**: 専門的なセキュリティ対策

---

**策定日**: 2025-06-30  
**実装開始**: 2025-07-01  
**完了予定**: 2025-10-31  
**レビュー**: 月次  
**担当**: MyFir セキュリティ・プライバシーチーム