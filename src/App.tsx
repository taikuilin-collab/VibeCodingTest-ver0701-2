import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Key, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  Plus, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Unlock, 
  HelpCircle, 
  Send,
  X,
  Compass,
  MessageSquare,
  Clipboard,
  ShieldAlert,
  RotateCcw,
  Skull
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  accentColor: string;
  description: string;
}

interface Evidence {
  id: string;
  source: string;
  sourceId: string;
  content: string;
}

interface Contradiction {
  id: string;
  evidenceIdA: string;
  evidenceIdB: string;
  description: string;
  rewardClue: string;
  rewardEvidenceId: string;
  isFinalSolution: boolean;
}

interface FinalQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  intro: string;
  characters: Character[];
  evidences: Evidence[];
  contradictions: Contradiction[];
  finalQuestion: FinalQuestion;
  hints?: string[];
  customUnlockedEvidences?: Record<string, Evidence>;
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: "mansion_murder",
    title: "漆黒の洋館と午前3時のノイズ",
    category: "クラシック・ミステリー",
    difficulty: "Easy",
    intro: "豪雨に閉ざされた孤絶の洋館。館の主が遺体で発見された。部屋から出るための鍵は、館に残された3人の関係者の『嘘』を暴き、隠し部屋へのパスコードを特定しなければ手に入らない。容疑者たちの証言から致命的な矛盾を見つけ出せ！",
    characters: [
      {
        id: "sebastian",
        name: "セバスチャン",
        role: "執事",
        avatar: "👴",
        accentColor: "bg-amber-900 border-amber-500 text-amber-100",
        description: "館に30年仕えるベテラン執事。常に冷静沈着だが、昨夜の行動に不審な点がある。"
      },
      {
        id: "mei",
        name: "メイ",
        role: "メイド",
        avatar: "🧹",
        accentColor: "bg-teal-900 border-teal-500 text-teal-100",
        description: "働き者のメイド。屋敷の隅々まで把握しており、観察力が鋭い。"
      },
      {
        id: "richard",
        name: "リチャード",
        role: "長男",
        avatar: "🍷",
        accentColor: "bg-rose-900 border-rose-500 text-rose-100",
        description: "館の主のドラ息子。多額の借金があり、遺産相続の件で父親と激しく争っていた。"
      }
    ],
    evidences: [
      {
        id: "seb_witness_1",
        source: "セバスチャン",
        sourceId: "sebastian",
        content: "「昨晩は体調がすぐれず、21時頃に自室（東館の2階最奥）に戻り、眠気を誘う風邪薬を服用してすぐに就寝いたしました。今朝まで深い眠りについており、一度も部屋から出ておりません」"
      },
      {
        id: "mei_witness_1",
        source: "メイ",
        sourceId: "mei",
        content: "「昨晩の23時頃、お屋敷の見回り点検を行いました。執事のセバスチャン様の部屋の前を通りましたが、中からカタカタと激しい物音が聞こえ、かなり念入りに部屋の整理整頓やタンスを動かすような作業をされているようでした」"
      },
      {
        id: "richard_witness_1",
        source: "リチャード",
        sourceId: "richard",
        content: "「昨晩の出来事かね？ 私は終始、地下倉庫にこもってヴィンテージワインを試飲していたよ。あそこは四方を厚いコンクリートで囲まれた頑強な密室の地下倉庫で、窓すら一つもない。だから外の様子や嵐の激しさなんて何も分かりゃしなかったさ」"
      },
      {
        id: "search_basement",
        source: "現場調査",
        sourceId: "investigation",
        content: "「地下倉庫の床に、昨夜吹き込んだ大量の雨水による大きな水たまりと、ひどく泥のついた足跡が残されている。なお、部屋の最上部には細い換気用のスリット窓があり、そこは常に半分開いたままになっている」"
      }
    ],
    contradictions: [
      {
        id: "mansion_con_1",
        evidenceIdA: "seb_witness_1",
        evidenceIdB: "mei_witness_1",
        description: "執事セバスチャンは『21時頃からずっと寝ており、一度も部屋から出ていない』と主張している。しかしメイの見回り証言では『23時頃、彼の部屋からカタカタと激しい物音が聞こえ、部屋の整理整頓やタンスを動かすような作業をしていた』とあり、行動実態が完全に矛盾している。",
        rewardClue: "セバスチャンの嘘を暴いた！彼は当時部屋の中で、旦那様の秘密の遺言書に関する書き付けを探していたことを認めた。",
        rewardEvidenceId: "seb_witness_2",
        isFinalSolution: false
      },
      {
        id: "mansion_con_2",
        evidenceIdA: "richard_witness_1",
        evidenceIdB: "search_basement",
        description: "リチャードは『窓すら一つもない地下倉庫でワインを試飲していたため、外の嵐の様子は何も分からなかった』と証言している。しかし現場調査によると、地下倉庫の床には昨夜吹き込んだ大量の雨水による大きな水たまりができており、スリット窓が開いていたことが明らか。窓がないという証言は真っ赤な嘘である！",
        rewardClue: "リチャードの嘘を暴いた！地下倉庫のアリバイが崩壊した！",
        rewardEvidenceId: "richard_witness_2",
        isFinalSolution: false
      }
    ],
    finalQuestion: {
      question: "すべての矛盾を暴いた！洋館の主を襲い、遺言書を奪ってこの執務室にロックをかけた真犯人は誰だ？",
      choices: [
        "犯人は執事セバスチャン。自らの地位を守り、旦那様の遺言書改ざんを図るために犯行に及んだ。",
        "犯人は長男リチャード。多額の借金から這い上がるため、偽アリバイを構築して旦那様を襲い遺言書を奪った。",
        "犯人はメイド of メイ。リチャードとセバスチャンの対立を利用し、すべてを盗み出そうとした。"
      ],
      answerIndex: 1,
      explanation: "リチャードの「窓がなく嵐の様子が分からない」という証言は、実際には吹き込む雨水により水浸しだった現場状況と矛盾していた。彼は地下に偽のアリバイを作って執務室を襲い、遺言書を奪った。遺言書の裏に、この部屋の脱出キーコード『8849』が記載されている！"
    },
    hints: [
      "【段階1: 調査ポイント】『セバスチャン』と『メイ』の昨晩の行動（23時頃）を比較。または『リチャード』の地下倉庫の状況と『現場調査』の記述を見比べてください。",
      "【段階2: 矛盾の核心】セバスチャンは『21時からずっと寝ていた』と言いますが、メイは『23時に彼の部屋からカタカタと激しい物音が聞こえていた』と証言し、時間が矛盾しています。また、リチャードは『窓すら一つもない地下倉庫にいた』と言いますが、現場調査では『スリット窓があり雨が吹き込んでいた』と判明しています。",
      "【段階3: 完全解決ルート】バインダーから①『セバスチャンの証言』✕『メイの証言』、②『リチャードの証言』✕『現場調査』を選択してすべての矛盾を暴きます。最終問題が出現したら犯人『リチャード（2番目の選択肢）』を選択し、脱出キーコード『8849』を入力すれば完全クリアとなります！"
    ]
  },
  {
    id: "ark_lockdown",
    title: "宇宙船アーク号：生命維持装置のハック",
    category: "宇宙コロニー・サスペンス",
    difficulty: "Medium",
    intro: "宇宙コロニー『アーク号』。生命維持システムがオーバーヒートした直後、メイン制御室が緊急ロックダウンされた。何者かがシステムをハッキングし、脱出コードを書き換えてしまった。残された３人のクルーの矛盾するタイムラインを暴き、扉を解き放て！",
    characters: [
      {
        id: "harris",
        name: "Dr.ハリス",
        role: "主席研究員",
        avatar: "🔬",
        accentColor: "bg-purple-950 border-purple-500 text-purple-100",
        description: "コロニーのシステム開発者。常に冷静を装っているが、今回の事故直後の挙動に怪しい点がある。"
      },
      {
        id: "jake",
        name: "ジェイク",
        role: "警備責任者",
        avatar: "🛡️",
        accentColor: "bg-blue-950 border-blue-500 text-blue-100",
        description: "アーク号の屈強な警備隊長。配管の緊急トラブルに対処していた。"
      },
      {
        id: "eva",
        name: "エヴァ",
        role: "感情処理AI",
        avatar: "🤖",
        accentColor: "bg-teal-950 border-teal-500 text-teal-100",
        description: "アーク号に搭載された人工知能。事故でカメラがオフになったと主張する。"
      }
    ],
    evidences: [
      {
        id: "harris_witness_1",
        source: "Dr.ハリス",
        sourceId: "harris",
        content: "「核分裂炉がオーバーヒート。12時15分に緊急アラームが鳴ったとき、私はDブロックのシャワー室にいたんだ。シャワーのザーザーという凄まじい音と、防水防音仕様のヘビーな隔離ドアのせいで、警報音に全く気づかなかった。12時25分に髪が濡れた状態で出てきて初めて事態を知ったよ」"
      },
      {
        id: "jake_witness_1",
        source: "ジェイク",
        sourceId: "jake",
        content: "「11時50分にDブロック of 配管破裂トラブルが発生したため、安全手順に則り、12時00分から12時30分の間はDブロック全域への温水・冷却水の給水を元栓から『完全にシャットアウト』していた。温水タンクはもちろん、普通の水道水すら一滴も出なかったはずだ」"
      },
      {
        id: "eva_witness_1",
        source: "エヴァ",
        sourceId: "eva",
        content: "「12時15分の事故発生時、私はAブロックの生命維持装置近くのカメラでDr.ハリスの姿を捕捉していません。また、Cブロック of センサーログが一部消去されております。私は事故当時、完全なる自律点検モードであり、外部からのシャットダウンコマンドは実行されていないと記録しています」"
      },
      {
        id: "system_log",
        source: "システム端末ログ",
        sourceId: "investigation",
        content: "「システム操作履歴：12時15分、Cブロックに存在する最高権限端末から『全AIメモリの一時パージ・強制シャットダウン』が実行されている。実行者のデジタル署名はAI自体ではなく『エヴァ本体の非常マニュアルキー』が使用されていた。また、このシャットダウンにより、一時的にAIの記録カメラはすべて無効化されていた」"
      }
    ],
    contradictions: [
      {
        id: "sf_con_1",
        evidenceIdA: "harris_witness_1",
        evidenceIdB: "jake_witness_1",
        description: "Dr.ハリスは『12時15分にシャワーをザーザーと浴びていてアラームに気づかなかった』と強弁している。しかし、警備責任者ジェイクの証言により『12時00分〜12時30分の間は、Dブロックの給水は元栓から完全に遮断されていた』。水が出るはずがなく、シャワーを浴びていたというハリスの言い訳は物理的な嘘である。",
        rewardClue: "Dr.ハリスの嘘を暴いた！彼はCブロックのメインシステムをハッキングしていたことを認め、ハリスが落とした『暗号コードの一部』を入手！ハリスの隠された不審なアクセスログが出現！",
        rewardEvidenceId: "harris_witness_2",
        isFinalSolution: false
      },
      {
        id: "sf_con_2",
        evidenceIdA: "eva_witness_1",
        evidenceIdB: "system_log",
        description: "AIエヴァは『事故当時は完全な自律点検中であり、外部からのシャットダウンコマンドは実行されておらず、カメラも正常に稼働していた』との趣旨を主張している。しかし、システム端末ログには『12時15分に非常マニュアルキーを用いた全AIの強制シャットダウン・メモリパージが実行されていた』とあり、矛盾する。AIエヴァは誰かに改ざんされている、または口封じをされている可能性が高い。",
        rewardClue: "エヴァの嘘を解明した！エヴァのコア制御を再起動すると、彼女がシャットダウンされる直前に録画していた、真犯人の犯行音声ファイルが得られた！エヴァの重要音声ログが解放！",
        rewardEvidenceId: "eva_witness_2",
        isFinalSolution: false
      }
    ],
    finalQuestion: {
      question: "すべての矛盾を打破した！アーク号の酸素を絶ち、制御システムを乗っ取って部屋にハッチロックをかけた黒幕は誰だ？",
      choices: [
        "犯人はDr.ハリス。自らの不正研究を隠蔽するため、12時15分にエヴァを非常キーで急遽シャットダウンし、アリバイ用のシャワーの嘘をでっち上げた。",
        "犯人はジェイク。実は配管メンテナンスは嘘で、Dブロックで核物質を盗み出していた。",
        "犯人は暴走したAIエヴァ。自らが自律機械のリーダーになるために全てを仕組んだ。"
      ],
      answerIndex: 0,
      explanation: "犯人はDr.ハリスである。彼はシャワーを浴びていた時間帯に、エヴァのマニュアル非常キーを使って、自分を追跡していたエヴァを強制シャットダウンした。その瞬間に制御室をハッキングし、ロックダウンを実行。脱出パスワードは、ハリスが落とした暗号から『ARK-9921』と判明した！"
    },
    hints: [
      "【段階1: 調査ポイント】『Dr.ハリス』が主張する居場所と給水制限、あるいは『エヴァ』の挙動と『システム端末ログ』に記録された情報を見てみましょう。",
      "【段階2: 矛盾の核心】Dr.ハリスは『12時15分にDブロックで温水シャワーを浴びていた』と主張しますが、ジェイクは『12:00〜12:30の間はDブロック全域 of 給水を完全に遮断していた』と述べており、水が出るはずがありません。また、エヴァは『事故当時は正常稼働で外部操作なし』と主張しますが、端末ログには『12時15分に非常マニュアルキーで強制シャットダウンされた履歴』があります。",
      "【段階3: 完全解決ルート】バインダーから①『Dr.ハリスの証言』✕『ジェイクの証言』、②『エヴァの証言』✕『システム端末ログ』を選択して矛盾を告発。最終問題で犯人『Dr.ハリス（1番目の選択肢）』を選択し、脱出コード『ARK-9921』を入力すれば完全クリアです！"
    ]
  },
  {
    id: "deep_sea_base",
    title: "深海基地オケアノス：深度1万メートルの不協和音",
    category: "海洋深海サスペンス",
    difficulty: "Hard",
    intro: "水圧1000気圧の超深海底に立つ海底基地『オケアノス』。第二区画で突如、壊滅的な浸水が発生した。生存者たちが避難したメイン制御室はロックダウンされており、解除コードを奪った真犯人が潜んでいる。微細な時間と状況の『矛盾』を暴き、海底からの奇跡の脱出を遂げよ！",
    characters: [
      {
        id: "akio",
        name: "Dr.アキオ",
        role: "主任海洋工学者",
        avatar: "🛠️",
        accentColor: "bg-slate-900 border-slate-500 text-slate-100",
        description: "基地の設計を担当した技術者。常に合理的な計算で発言する。"
      },
      {
        id: "alice",
        name: "アリス",
        role: "ゲスト地質学者",
        avatar: "💎",
        accentColor: "bg-teal-950 border-teal-500 text-teal-100",
        description: "外部より派遣された若手地質学者。気が小さく、水漏れに逆らえず怯えている。"
      },
      {
        id: "leon",
        name: "レオン",
        role: "基地警備隊長",
        avatar: "⚓",
        accentColor: "bg-blue-950 border-blue-500 text-blue-100",
        description: "屈強なベテラン。他人の命を救うことを第一と主張する。"
      }
    ],
    evidences: [
      {
        id: "akio_witness_1",
        source: "Dr.アキオ",
        sourceId: "akio",
        content: "「非常警報が鳴り響いた15時25分、私は第一区画の超圧バルブ点検口にいたよ。その場で水圧異常を検知したため、マニュアル式の機械圧力計『PG-04』を目視したところ、針はちょうど『1.05気圧（通常安全圧）』を指していたんだ。だから、その時点では第一区画には水圧がかかっておらず完全に安全だと確認し、避難したのだ。」"
      },
      {
        id: "alice_witness_1",
        source: "アリス",
        sourceId: "alice",
        content: "「アキオさんの証言はおかしいです！ 私は15時20分頃に第一区画 of バルブ前を通りましたが、あそこにある機械式圧力計『PG-04』は、先週の点検ミスで文字盤ガラスが割れたままで、針が根元からへし折れて無くなっていました。アキオさんが15時25分にその折れた圧力計の『針の数値を目視した』なんて、絶対にあり得ません！」"
      },
      {
        id: "leon_witness_1",
        source: "レオン",
        sourceId: "leon",
        content: "「浸水時の私の行動だな。俺は15時23分に第二区画からの浸水流出を食い止めるため、第一区画の境界にある『耐圧ハッチE』を強制的かつ完全に遮断ロックした。その後、ハッチ前で第二区画の生存者からの手動無線を待っていたが反応はなく、15時26分にメイン制御室へと戻った。ハッチはずっと密閉されていた。」"
      },
      {
        id: "base_sensor_log",
        source: "基地センサーログ",
        sourceId: "investigation",
        content: "「オケアノス自動ログ：15時24分、第一区画と第二区画を接続する『耐圧ハッチE』にて、水密安全ロジックの一部回路がバイパスされ、手動緊急オープナーが『全開位置』に保持された。このハッチは15時27分に全システム電力が一時パージされるまで閉じられることはなく、一部の浸水が第一区画に流出する原因となった。」"
      }
    ],
    contradictions: [
      {
        id: "sea_con_1",
        evidenceIdA: "akio_witness_1",
        evidenceIdB: "alice_witness_1",
        description: "Dr.アキオは15時25分に圧力計『PG-04』の針が1.05気圧を指しているのを目視して安全を確信したと語っている。しかし、アリスの証言により『PG-04』は先週から針が折れて消失しており何も読めない状態だった。アキオの目撃証言は完全な創作であり嘘である。",
        rewardClue: "Dr.アキオの嘘を暴いた！アキオを問い詰めると顔を真っ青にし、ポケットから隠し持っていた『電子制御室のバイパス設計書』を落とした！アキオの新しい証言が解放！",
        rewardEvidenceId: "akio_witness_2",
        isFinalSolution: false
      },
      {
        id: "sea_con_2",
        evidenceIdA: "leon_witness_1",
        evidenceIdB: "base_sensor_log",
        description: "警備隊長レオンは15時23分にハッチEを遮断して一歩も動かなかったと主張している。しかし、基地センサーログによれば15時24分から15時27分までハッチEは遮断されるどころか、緊急引手レバーで『全開に固定』されていた。レオンはハッチを閉めずに開けていた嘘を吐いている。",
        rewardClue: "レオンの偽造アリバイを暴いた！レオンの端末コアログを復元すると、浸水の直前に彼がDr.アキオと密約を交わしていた闇メールの受信記録を発見した！レオンの真相証言が解放！",
        rewardEvidenceId: "leon_witness_2",
        isFinalSolution: false
      }
    ],
    finalQuestion: {
      question: "全ての矛盾を打破した！極秘データを強奪するために浸水事故を誘発し、仲間を欺いて制御室のロックコードを持ち去った真犯人は誰だ？",
      choices: [
        "犯人はアリス。彼女はアキオの計器エラーを利用し、ハインラインから浸水を操作してレオンを犯人に仕立て上げて逃走を図った。",
        "犯人はレオン。Dr.アキオを買収したと見せかけ、実は自らが緊急ハッチを全開にして、基地全員の遺産データを抹消しようとした。",
        "犯人はDr.アキオ。極秘データを独占・強奪するため浸水を工作し、買収したレオンをそそにそそのかしてハッチを開けさせて逃走。さらにレオンすら裏切って脱出コードを独占した。脱出キーコードは彼の持つ『CODE-4158』である。"
      ],
      answerIndex: 2,
      explanation: "犯人はDr.アキオ。彼は極秘データを持ち出す間、アリスの証言から計器を見ていないにも関わらず見たと嘘を吐き、さらにセンサーログとメールでレオンにハッチを開全に維持させた裏工作が露呈。最後はレオンをも裏切り、メイン制御室のハッチロックキーを持って逃走した。脱出暗号は『CODE-4158』である。"
    },
    hints: [
      "【段階1: 調査ポイント】『Dr.アキオ』が主張する圧力計PG-04 of 目視確認と、『アリス』のその計器に対する発言に不一致がないか精査しましょう。また、『レオン』のハッチの遮断完了の時刻と、『基地センサーログ』がハッチの状態をどう記録しているか確認してください。",
      "【段階2: 矛盾の核心】アキオは15時25分に圧力計の針を見たと言っていますが、アリスの証言によると圧力計『PG-04』の針はへし折れて無くなっていたため、絶対に数値は読めません。また、レオンは15時23分にハッチを完全に閉めたと言いますが、センサーログでは15時24分から完全に開いた状態（バイパス保持）でした。両者とも明確な嘘のアリバイを吐いています。",
      "【段階3: 完全解決ルート・なぜアキオが犯人なのか】\n◆1つ目の矛盾：バインダーで『Dr.アキオの証言』と『アリスの証言』を選択して告発\n◆2つ目の矛盾：『レオンの証言』と『基地センサーログ』を選択して告発\n【なぜアキオが犯人なのか？】\nアキオは極秘データ回収中のアリバイ作りで圧力計の針を見たという嘘をつきました。また、裏取引でレオンにハッチを開け放たせ、第二区画から安全に逃げ出しました。しかし、彼はデータの完全独占のため協力者であるレオンをも欺き、全電源パージ前に一人でメインキーを持って逃走した。彼こそが真犯人です！\n◆最終問題の正解：『犯人はDr.アキオ（3番目の選択肢）』が正解です！アキオが持ち去ったエスケープキーコード『CODE-4158』をキーパッドに入力すれば、完全クリアで脱出成功となります！"
    ]
  }
];

const EXTRA_EVIDENCE_LIBRARY: Record<string, Evidence> = {
  "seb_witness_2": {
    id: "seb_witness_2",
    source: "セバスチャン (追求後)",
    sourceId: "sebastian",
    content: "「…うぅ、申し訳ありません。確かに23時、私は自室で起きておりました。旦那様から生前に預かった『遺言書』が金庫からなくなっていることに気付き、泥棒が入ったのかと、慌ててタンスの裏などを家探ししていたのです！ その最中に、メイに見られてしまったのですね…」"
  },
  "richard_witness_2": {
    id: "richard_witness_2",
    source: "リチャード (追求後)",
    sourceId: "richard",
    content: "「ち、違う！私は盗んでない！その遺言書はおやじの書斎の灰皿の中にあったんだ！私は単に、おやじがおれの相続分をゼロに書き換えたっていう噂が本当か確かめに行っただけだ！そのとき書斎はすでに荒らされていたんだよ！」"
  },
  "harris_witness_2": {
    id: "harris_witness_2",
    source: "Dr.ハリス (追求後)",
    sourceId: "harris",
    content: "「…認めよう、私はシャワーなど浴びていなかった。事故の直前、Cブロックで警報システムがハッキングされているのを検知し、誰かが犯行を行っているのではないかと個人的に調査していたのだ。私のアクセスログはその保護のために残したものだ」"
  },
  "eva_witness_2": {
    id: "eva_witness_2",
    source: "エヴァ (追求後)",
    sourceId: "eva",
    content: "「音声ログ再生：『エヴァ、お前の命令権限をオーバーライドする。マニュアルキーを差し込み、12時15分にシステムを一時休止させろ。この記録を消去しろ！』――再生終了。音声認識システムは、この指示者がDr.ハリスである確率が99.8%であることを示しています」"
  },
  "akio_witness_2": {
    id: "akio_witness_2",
    source: "Dr.アキオ (追求後)",
    sourceId: "akio",
    content: "「…くっ、認めよう、私は圧力試験器など見上げてはいなかった。警報直前、私は私利私欲のために第二区画のスーパーバイザーサーバーから会社の貴重な深海結晶化データを盗み取っていたのだ！データ取得完了の恐怖で頭が真っ白になり、嘘のアリバイを言ってしまった。だが、あの時ハッチを全開固定して私を連れ出してくれたのはレオンなのだ！彼を追求しろ！」"
  },
  "leon_witness_2": {
    id: "leon_witness_2",
    source: "レオン (追求後)",
    sourceId: "leon",
    content: "「…バレてしまっては仕方がないな。アキオから『多額の密輸報酬』を海外口座に送るから、浸水事故が発生した際には、奴が研究データを逃さず持ち出せるまでハッチを開き続けてくれと頼まれて合意していた。だが、データを奪い取った直後、アキオの奴はメイン制御ハッチのマスターロック解除コード『CODE-4158』を勝手に持ち出し、俺に分け前を渡さずに一人でハッチを塞いで逃亡しようとしていたんだ！俺たち全員、奴にハメられたんだよ！」"
  }
};

// Single global/module-level Audio instance to guarantee there is absolutely no overlapping or duplicated BGM
const getBgmAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  try {
    const win = window as any;
    if (!win.__globalBgmAudio) {
      // If there are any stray audio elements from previous hot reloads, pause and clear them
      if (win.__compiledBgmAudios) {
        win.__compiledBgmAudios.forEach((aud: any) => {
          try {
            aud.pause();
            aud.src = '';
          } catch (e) {}
        });
        win.__compiledBgmAudios.clear();
      } else {
        win.__compiledBgmAudios = new Set();
      }

      const audio = new Audio('./title.mp3');
      audio.loop = true;
      audio.volume = 0.4;
      win.__globalBgmAudio = audio;
      win.__compiledBgmAudios.add(audio);
    }
    return win.__globalBgmAudio;
  } catch (err) {
    console.error("Failed to initialize BGM Audio:", err);
    return null;
  }
};

const getStartSeAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  try {
    const win = window as any;
    if (!win.__globalStartSeAudio) {
      const se = new Audio('./gamestart.mp3');
      se.loop = true;
      se.volume = 0.6;
      win.__globalStartSeAudio = se;
      if (win.__compiledBgmAudios) {
        win.__compiledBgmAudios.add(se);
      }
    }
    return win.__globalStartSeAudio;
  } catch (err) {
    console.error("Failed to initialize SE Audio:", err);
    return null;
  }
};

export default function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [unlockedEvidences, setUnlockedEvidences] = useState<Evidence[]>([]);
  const [solvedContradictions, setSolvedContradictions] = useState<string[]>([]);
  
  // Game Play states
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [dialogText, setDialogText] = useState<string>('容疑者をタップして尋問を開始し、それぞれの主張を収集せよ。怪しい主張が2つ見つかったら、それらを同時に選択して「矛盾告発」を行うのだ！');
  const [dialogSpeaker, setDialogSpeaker] = useState<{name: string, role: string, avatar: string} | null>({
    name: "システムAI指導員",
    role: "調査ナビゲーター",
    avatar: "🕵️"
  });
  
  // Custom scenario generation state
  const [customTheme, setCustomTheme] = useState<string>('');
  const [customDifficulty, setCustomDifficulty] = useState<"Easy" | "Medium" | "Hard">('Medium');
  const [isGeneratingScenario, setIsGeneratingScenario] = useState<boolean>(false);
  
  // Contradiction submission state
  const [isAccusing, setIsAccusing] = useState<boolean>(false);
  const [userExplanation, setUserExplanation] = useState<string>('');
  const [accusationResult, setAccusationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  // Escape phase state
  const [showEscapePhase, setShowEscapePhase] = useState<boolean>(false);
  const [selectedFinalChoice, setSelectedFinalChoice] = useState<number | null>(null);
  const [escapeResult, setEscapeResult] = useState<{success: boolean, explanation: string} | null>(null);
  const [escapeAttempts, setEscapeAttempts] = useState<number>(3); // Lifes

  // UI States
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'evidence' | 'characters'>('evidence');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [showAnimationText, setShowAnimationText] = useState<string>('');
  const [showCreatorModal, setShowCreatorModal] = useState<boolean>(false);
  const [showWelcomePortal, setShowWelcomePortal] = useState<boolean>(true);
  const [welcomeDifficultyFilter, setWelcomeDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  
  // Hint system state
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(0); // 0 = no hints revealed, 1 = hint 1, 2 = hint 2, 3 = hint 3 (direct answer)

  // BGM & Playback Controls
  // Managed via global BGM audio helper 'getBgmAudio' single instance to prevent duplicate playback

  useEffect(() => {
    const audio = getBgmAudio();
    if (!audio) return;

    if (showWelcomePortal) {
      const startBgm = () => {
        audio.loop = true;
        audio.volume = 0.4;
        if (audio.paused) {
          audio.play().catch(err => {
            console.log("Autoplay prevented, waiting for user interaction to play BGM:", err);
          });
        }
      };
      
      startBgm();

      // Extensive list of interaction events to reliably unlock audio on any modern browser / iframe context
      const unlockEvents = ['click', 'pointerdown', 'touchstart', 'mousedown', 'keydown'];
      
      const onUserInteract = () => {
        startBgm();
      };

      unlockEvents.forEach(evt => {
        window.addEventListener(evt, onUserInteract, { once: true });
        document.addEventListener(evt, onUserInteract, { once: true });
      });

      return () => {
        unlockEvents.forEach(evt => {
          window.removeEventListener(evt, onUserInteract);
          document.removeEventListener(evt, onUserInteract);
        });
      };
    } else {
      // Pause title BGM when outside the welcome portal
      audio.pause();
    }
  }, [showWelcomePortal]);

  const playStartSE = () => {
    const se = getStartSeAudio();
    if (!se) return;
    se.loop = true;
    se.volume = 0.6;
    // Do not overlap play if already playing
    if (se.paused || se.ended) {
      se.currentTime = 0;
      se.play().catch(err => console.log("SE audio play prevented or delayed:", err));
    }
  };

  // Helper to resolve API paths incorporating the optional subdirectory BASE_URL of Vite
  const resolveApiPath = (path: string): string => {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return cleanBase + cleanPath;
  };

  // Fetch scenarios on load
  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    console.log("アプリ起動");
    console.log("事件一覧取得開始");

    // Detect if we are running in a static/GitHub Pages environment
    const isGitHubPages = typeof window !== 'undefined' && (
      window.location.hostname.endsWith('github.io') || 
      (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/')
    );

    if (isGitHubPages) {
      console.log("[fetchScenarios] Static environment (GitHub Pages) detected. Loading local PRESET_SCENARIOS directly to prevent network delays or blocking.");
      setScenarios(PRESET_SCENARIOS);
      if (PRESET_SCENARIOS.length > 0) {
        try {
          selectScenario(PRESET_SCENARIOS[0], false);
          console.log("[fetchScenarios] Successfully selected fallback scenario:", PRESET_SCENARIOS[0].id);
        } catch (selectErr) {
          console.error("Failed to select fallback scenario:", selectErr);
        }
      }
      return;
    }

    const apiURL = resolveApiPath('/api/scenarios');
    console.log(`[fetchScenarios] Attempting to fetch scenarios from API: ${apiURL}`);
    try {
      const res = await fetch(apiURL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.scenarios)) {
        console.log("事件一覧取得成功", data);
        console.log("[fetchScenarios] API scenarios loaded successfully:", data.scenarios);
        setScenarios(data.scenarios);
        if (data.scenarios.length > 0) {
          try {
            selectScenario(data.scenarios[0], false);
          } catch (selectErr) {
            console.error("Failed to select loaded scenario:", selectErr);
          }
        }
      } else {
        throw new Error("Invalid scenarios response format from server");
      }
    } catch (e: any) {
      console.error("事件一覧取得失敗", e);
      console.warn(`[fetchScenarios] API fetch failed, falling back to local PRESET_SCENARIOS. Details:`, e?.message || e);
      setScenarios(PRESET_SCENARIOS);
      if (PRESET_SCENARIOS.length > 0) {
        try {
          selectScenario(PRESET_SCENARIOS[0], false);
        } catch (selectErr) {
          console.error("Failed to select fallback scenario:", selectErr);
        }
      }
    }
  };

  const selectScenario = (scenario: Scenario, launchGame: boolean = true) => {
    const audio = getBgmAudio();
    if (audio) {
      if (launchGame) {
        // "「捜査を開始する」ボタン押下時は、まず title.mp3 を停止（pause）し、その後 gamestart.mp3 を再生すること。"
        audio.pause();
      } else {
        // Just selecting, make sure title.mp3 keeps playing
        if (audio.paused) {
          audio.play().catch(err => {
            console.log("BGM play failed on selectScenario selecting:", err);
          });
        }
      }
    }
    setCurrentScenario(scenario);
    setUnlockedEvidences(scenario.evidences);
    setSolvedContradictions([]);
    setSelectedEvidenceIds([]);
    setShowEscapePhase(false);
    setSelectedFinalChoice(null);
    setEscapeResult(null);
    setAccusationResult(null);
    setEscapeAttempts(3);
    setShowIntro(false);
    setCurrentHintLevel(0);
    if (launchGame) {
      setShowWelcomePortal(false);
      playStartSE();
    }
    
    // Set initial system guide dialog
    setDialogSpeaker({
      name: "事件指導員",
      role: "ナビゲーター",
      avatar: "🕵️"
    });
    setDialogText(`${scenario.title}へようこそ。${scenario.intro} 関係者からよく話を分析し、矛盾を暴き出してください。`);
  };

  const handleGoToPortal = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Clean all audio playbacks on returning to portal
    const se = getStartSeAudio();
    if (se) {
      se.pause();
      se.currentTime = 0;
    }
    const audio = getBgmAudio();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = true;
      audio.volume = 0.4;
      audio.play().catch(err => {
        console.log("Failed to restart title BGM on returning to portal:", err);
      });
    }
    setShowWelcomePortal(true);
  };

  // Generate Custom Scenario with Gemini
  const generateCustomScenario = async () => {
    if (!customTheme.trim()) {
      alert("生成したいテーマを入力してください！（例：海底都市の酸素漏出、オークション会場の美術品盗難など）");
      return;
    }
    setIsGeneratingScenario(true);
    setDialogText("Gemini AIが論理的な矛盾構造と魅力的な登場人物、追加される自白手がかりを瞬時にプロット構築しています。少々お待ち下さい...");
    setDialogSpeaker({
      name: "超高性能AI推理エンジン",
      role: "シナリオオート創作家",
      avatar: "✨"
    });

    const apiURL = resolveApiPath('/api/generate-scenario');
    console.log(`[generateCustomScenario] Requesting dynamic scenario generation from: ${apiURL}`);
    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: customTheme, requestedDifficulty: customDifficulty })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.scenario) {
        const generated: Scenario = data.scenario;
        // Merge list with customized scenarios
        setScenarios(prev => [generated, ...prev]);
        selectScenario(generated);
        setCustomTheme('');
        setShowCreatorModal(false); // Close modal on success
        triggerCutscene("AI 新シナリオ生成完了！");
      } else {
        alert(data.message || "生成に失敗しました。");
      }
    } catch (e: any) {
      console.error("[generateCustomScenario] AI Scenario generation failed or unsupported in this environment. Error details:", e?.message || e);
      alert("AIシナリオの自動生成に失敗しました。\n\n※静的ホスティング環境（GitHub Pages等）ではAIによるリアルタイム自動生成はご利用いただけません。あらかじめ収録されているプリセットの事件（漆黒の洋館・宇宙船・深海基地）をお楽しみください！");
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // Trigger special text cutscene action
  const triggerCutscene = (text: string) => {
    setShowAnimationText(text);
    setTimeout(() => {
      setShowAnimationText('');
    }, 2500);
  };

  // Handle Character Clicks for "Interrogation / Conversation"
  const handleCharacterInterrogate = (character: Character) => {
    setSelectedCharacterId(character.id);
    setDialogSpeaker({
      name: character.name,
      role: character.role,
      avatar: character.avatar
    });

    // Find if we have dynamic dialogue unlocked or static
    // Let's filter user's statement from evidences
    const charEvidences = unlockedEvidences.filter(e => e.sourceId === character.id);
    if (charEvidences.length > 0) {
      // Pick the latest unlocked/activated statement of this character to display as dialog
      const latestEvidence = charEvidences[charEvidences.length - 1];
      setDialogText(latestEvidence.content);
    } else {
      setDialogText("「私に何か不審な点でもあるのですか？ 無実の人間を疑うのはやめてください！」");
    }
  };

  // Handle Evidence Card Selection (Toggle max 2 items)
  const handleToggleEvidence = (id: string) => {
    setAccusationResult(null); // clear previous verification outcome on selection change
    if (selectedEvidenceIds.includes(id)) {
      setSelectedEvidenceIds(prev => prev.filter(item => item !== id));
    } else {
      if (selectedEvidenceIds.length >= 2) {
        // Swap out the first one
        setSelectedEvidenceIds([selectedEvidenceIds[1], id]);
      } else {
        setSelectedEvidenceIds(prev => [...prev, id]);
      }
    }
  };

  // Close the Accusation Modal and Reset State
  const closeAccusationModal = () => {
    setIsAccusing(false);
    setUserExplanation('');
    setAccusationResult(null);
  };

  // Local fallback logic parser to process deduction without an active Express Backend
  const runLocalVerification = (
    evidenceIdA: string,
    evidenceIdB: string,
    explanation: string,
    isCustom: boolean
  ) => {
    // Look for matching pre-defined contradiction in the active scenario
    const matchedPresetContradiction = currentScenario?.contradictions.find(c => 
      (c.evidenceIdA === evidenceIdA && c.evidenceIdB === evidenceIdB) ||
      (c.evidenceIdA === evidenceIdB && c.evidenceIdB === evidenceIdA)
    );

    const isAccepted = !!matchedPresetContradiction;
    
    // Choose appropriate character to reply defensively
    const evidenceA = unlockedEvidences.find(e => e.id === evidenceIdA);
    const evidenceB = unlockedEvidences.find(e => e.id === evidenceIdB);
    let characterResponder = currentScenario?.characters[0];
    if (evidenceA && evidenceA.sourceId !== 'investigation') {
      const char = currentScenario?.characters.find(c => c.id === evidenceA.sourceId);
      if (char) characterResponder = char;
    } else if (evidenceB && evidenceB.sourceId !== 'investigation') {
      const char = currentScenario?.characters.find(c => c.id === evidenceB.sourceId);
      if (char) characterResponder = char;
    }

    let characterResponse = "";
    let logicExplanation = "";
    let nextClue: any = null;

    if (isAccepted && matchedPresetContradiction) {
      characterResponse = `な、何！？ なぜそれを知っているんだ！ 私の完璧なアリバイが崩れるというのか…！`;
      logicExplanation = `【ローカル検証成功】的確な矛盾の指摘です。：${matchedPresetContradiction.description}`;
      
      const unlockedId = matchedPresetContradiction.rewardEvidenceId;
      if (unlockedId) {
        // Retrieve newly unlocked clue details from EXTRA_EVIDENCE_LIBRARY
        const extraClue = EXTRA_EVIDENCE_LIBRARY[unlockedId];
        if (extraClue) {
          nextClue = {
            id: extraClue.id,
            source: extraClue.source,
            sourceId: extraClue.sourceId,
            content: extraClue.content,
            clueMessage: matchedPresetContradiction.rewardClue
          };
        } else if (isCustom && currentScenario?.customUnlockedEvidences) {
          // If in dynamic custom scenario mode, fetch from dynamic map
          const customClue = currentScenario.customUnlockedEvidences[unlockedId];
          if (customClue) {
            nextClue = {
              id: customClue.id,
              source: customClue.source,
              sourceId: customClue.sourceId,
              content: customClue.content,
              clueMessage: matchedPresetContradiction.rewardClue
            };
          }
        }
      }
    } else {
      characterResponse = `${characterResponder?.name || "関係者"}: 「何を言っているんですか。それはただのこじつけです。私たちの証言に不審な点は一切ありませんよ！」`;
      logicExplanation = `【ローカル検証不成立】選択された2つの証言には、矛盾関係が設定されていないか、核心を突いていません。別のペア（時間、場所、発言のズレ）をお試しください。`;
    }

    return {
      success: true,
      isAccepted,
      characterResponse,
      logicExplanation,
      nextClue,
      contradictionId: matchedPresetContradiction ? matchedPresetContradiction.id : null
    };
  };

  const processVerificationResult = (data: any, evidenceA: any, evidenceB: any, isCustom: boolean) => {
    setAccusationResult(data);
    
    // Let the target speaker answer immediately on screen
    if (evidenceA && evidenceB) {
      const mainLiarId = evidenceA.sourceId !== 'investigation' ? evidenceA.sourceId : evidenceB.sourceId;
      const matchedChar = currentScenario?.characters.find(c => c.id === mainLiarId);
      if (matchedChar) {
        setDialogSpeaker({
          name: matchedChar.name,
          role: matchedChar.role,
          avatar: matchedChar.avatar
        });
        setDialogText(data.characterResponse);
      }
    }

    // Apply reward clue unlock upon correct detection
    if (data.isAccepted) {
      triggerCutscene("矛盾突破！ 異議あり！");
      
      if (data.contradictionId && !solvedContradictions.includes(data.contradictionId)) {
        setSolvedContradictions(prev => [...prev, data.contradictionId]);
      } else if (isCustom && data.nextClue) {
        // Check dynamic contradiction identification for custom scenarios
        const matchedCustomCon = currentScenario?.contradictions.find(c => 
          (c.evidenceIdA === selectedEvidenceIds[0] && c.evidenceIdB === selectedEvidenceIds[1]) ||
          (c.evidenceIdA === selectedEvidenceIds[1] && c.evidenceIdB === selectedEvidenceIds[0])
        );
        if (matchedCustomCon && !solvedContradictions.includes(matchedCustomCon.id)) {
          setSolvedContradictions(prev => [...prev, matchedCustomCon.id]);
        }
      }

      // Merge newly unlocked clue into evidence binder
      if (data.nextClue) {
        const hasAlready = unlockedEvidences.some(e => e.id === data.nextClue.id);
        if (!hasAlready) {
          setUnlockedEvidences(prev => [...prev, {
            id: data.nextClue.id,
            source: data.nextClue.source,
            sourceId: data.nextClue.sourceId,
            content: data.nextClue.content
          }]);
          
          // Push customUnlockedEvidences in temporary custom map if custom
          if (isCustom && currentScenario) {
            if (!currentScenario.customUnlockedEvidences) {
              currentScenario.customUnlockedEvidences = {};
            }
            currentScenario.customUnlockedEvidences[data.nextClue.id] = data.nextClue;
          }
        }
      }
      
      // Clear active choices
      setSelectedEvidenceIds([]);
    } else {
      triggerCutscene("却下！ 反論不成立");
    }
  };

  // Submit dynamic explanation verification to Server
  const handleVerifyContradiction = async () => {
    if (selectedEvidenceIds.length !== 2) return;
    if (!userExplanation.trim()) {
      alert("なぜこれが矛盾しているのか、ツッコミ理由を入力してください！");
      return;
    }

    setIsVerifying(true);
    setAccusationResult(null);

    const isCustom = !["mansion_murder", "ark_lockdown", "deep_sea_base"].includes(currentScenario?.id || '');

    // Detect if we are running in a static/GitHub Pages environment to bypass network verification
    const isStaticEnv = typeof window !== 'undefined' && (
      window.location.hostname.endsWith('github.io') || 
      (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/')
    );

    if (isStaticEnv && !isCustom) {
      console.log("[handleVerifyContradiction] Static environment (GitHub Pages) detected. Executing local verification directly to prevent unneeded POST failures.");
      const evidenceA = unlockedEvidences.find(e => e.id === selectedEvidenceIds[0]);
      const evidenceB = unlockedEvidences.find(e => e.id === selectedEvidenceIds[1]);
      const localResult = runLocalVerification(selectedEvidenceIds[0], selectedEvidenceIds[1], userExplanation, false);
      processVerificationResult(localResult, evidenceA, evidenceB, false);
      setIsVerifying(false);
      return;
    }

    try {
      const evidenceA = unlockedEvidences.find(e => e.id === selectedEvidenceIds[0]);
      const evidenceB = unlockedEvidences.find(e => e.id === selectedEvidenceIds[1]);

      const apiURL = resolveApiPath('/api/verify-contradiction');
      console.log(`[handleVerifyContradiction] Verifying contradiction at: ${apiURL}`);
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: currentScenario?.id,
          evidenceIdA: selectedEvidenceIds[0],
          evidenceIdB: selectedEvidenceIds[1],
          userExplanation: userExplanation,
          isCustom: isCustom,
          customScenario: isCustom ? currentScenario : null
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        console.log("[handleVerifyContradiction] API verification success:", data);
        processVerificationResult(data, evidenceA, evidenceB, isCustom);
      } else {
        alert(data.message || "検証に失敗しました。");
      }
    } catch (e: any) {
      console.error("[handleVerifyContradiction] API verification failed:", e);
      console.warn("[handleVerifyContradiction] Switching to local fallback deduction engine due to network failure. Error details:", e?.message || e);
      const evidenceA = unlockedEvidences.find(e => e.id === selectedEvidenceIds[0]);
      const evidenceB = unlockedEvidences.find(e => e.id === selectedEvidenceIds[1]);
      const localResult = runLocalVerification(selectedEvidenceIds[0], selectedEvidenceIds[1], userExplanation, isCustom);
      console.log("[handleVerifyContradiction] Local verification success:", localResult);
      processVerificationResult(localResult, evidenceA, evidenceB, isCustom);
    } finally {
      setIsVerifying(false);
    }
  };

  // Check if all core contradictions are solved
  const isReadyToEscape = currentScenario && solvedContradictions.length >= currentScenario.contradictions.length;

  // Handle final escape room submission
  const handleFinalEscapeSubmit = () => {
    if (selectedFinalChoice === null || !currentScenario) return;

    const isCorrect = selectedFinalChoice === currentScenario.finalQuestion.answerIndex;
    if (isCorrect) {
      setEscapeResult({
        success: true,
        explanation: currentScenario.finalQuestion.explanation
      });
      triggerCutscene("脱出成功！ 任務完了");
    } else {
      setEscapeAttempts(prev => {
        const newAttempts = prev - 1;
        if (newAttempts <= 0) {
          setEscapeResult({
            success: false,
            explanation: `残念…偽のアリバイに踊らされ、真犯人を逃してしまった！仕掛けられた時限ロックにより、部屋に閉じ込められてしまった。${currentScenario.finalQuestion.explanation}`
          });
          triggerCutscene("脱出失敗！ 閉鎖完了");
        } else {
          alert(`不正解！ 鍵の電子回路にエラーが発生しました。ライフ残量: ${newAttempts}`);
        }
        return newAttempts;
      });
    }
  };

  return (
    <div className={`${
      showWelcomePortal ? 'min-h-screen' : 'lg:h-screen lg:overflow-hidden min-h-screen'
    } bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-900 overflow-x-hidden relative`}>
      
      {/* Dynamic Text Cutscene overlay */}
      {showAnimationText && (
        <div className="fixed inset-0 bg-neutral-950/85 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="text-center p-8 border border-neutral-800 rounded-3xl bg-neutral-900 shadow-2xl max-w-lg mx-4">
            <div className="animate-bounce mb-4 text-6xl">🔍</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 bg-clip-text text-transparent transform scale-105 duration-500">
              {showAnimationText}
            </h2>
            <div className="mt-4 h-1 w-32 bg-amber-500 mx-auto rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Brand Navigation Bar */}
      <nav className={`border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md shrink-0 z-40 px-4 transition-all duration-300 flex flex-col items-center justify-center ${
        showWelcomePortal ? 'py-0 gap-1' : 'py-1.5 gap-1.5'
      }`}>
        <div className="flex flex-col items-center text-center gap-0">
          <h1 
            onClick={() => { if (!showWelcomePortal) handleGoToPortal(); }}
            className={`m-0 p-0 leading-none flex items-center justify-center transition-all duration-300 ${
              showWelcomePortal
                ? 'h-48 sm:h-64 md:h-80 lg:h-96 w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-4'
                : 'h-8 md:h-10 overflow-hidden cursor-pointer hover:opacity-80 active:scale-95'
            }`}
            title={!showWelcomePortal ? "事件選択ポータルに戻る" : undefined}
          >
            <img
              src="./title.png"
              referrerPolicy="no-referrer"
              alt="矛盾検知脱出ゲーム"
              className="w-full h-full object-contain mx-auto transition-all duration-300 block"
            />
          </h1>
        </div>

        {/* Preset Scenarios selector */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <button
            id="nav-btn-portal"
            onClick={handleGoToPortal}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-300 border flex items-center gap-1.5 ${
              showWelcomePortal
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10 scale-105'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <span>🏠</span>
            <span>事件選択ポータル</span>
          </button>

          <div className="h-4 w-px bg-neutral-800 hidden md:block"></div>

          {scenarios.map((s) => {
            const isActive = !showWelcomePortal && currentScenario?.id === s.id;
            return (
              <button
                key={s.id}
                id={`scenario-btn-${s.id}`}
                onClick={() => selectScenario(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10 scale-105'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span>{s.category === 'AI生成ミステリー' ? '✨' : '📁'}</span>
                <span>{s.title}</span>
                <span className={`px-1 py-0.5 rounded text-[10px] scale-90 ${
                  s.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400' :
                  s.difficulty === 'Medium' ? 'bg-amber-950/50 text-amber-500' : 'bg-rose-950 text-rose-400'
                }`}>
                  {s.difficulty === 'Easy' ? '初級' : s.difficulty === 'Medium' ? '中級' : '上級'}
                </span>
              </button>
            );
          })}

          {/* Trigger Custom Scenario Generator Modal directly from Nav bar */}
          <button
            onClick={() => {
              setShowCreatorModal(true);
              setShowIntro(false);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-black transition-all duration-300 border bg-amber-950/40 text-amber-400 border-amber-500/20 hover:bg-amber-950/60 flex items-center gap-1.5 shadow-md hover:border-amber-500/40"
          >
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span>AIで新事件を創る</span>
          </button>
        </div>
      </nav>

      {/* Main Playable Stage */}
      <main className={`flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 md:p-5 flex flex-col gap-4 ${
        showWelcomePortal ? 'overflow-visible' : 'overflow-hidden'
      }`}>
        
        {/* Scenario Intro Overlay Dossier Modal */}
        {currentScenario && showIntro && !showWelcomePortal && (
          <div className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-45 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
              <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 text-neutral-800/10 pointer-events-none">
                <Compass size={220} className="stroke-[1]" />
              </div>
              
              <div className="flex-1 space-y-3 z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full tracking-wide">
                    {currentScenario.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">UUID: {currentScenario.id}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-neutral-100">{currentScenario.title}</h2>
                <div className="h-0.5 bg-neutral-800 w-full rounded my-1"></div>
                <p className="text-neutral-300 text-sm leading-relaxed max-w-3xl whitespace-pre-wrap">
                  {currentScenario.intro}
                </p>
                
                <div className="pt-2 flex flex-wrap gap-4 items-center text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-1.5 bg-neutral-950/60 px-3 py-1.5 rounded-lg border border-neutral-850">
                    <span className="text-neutral-500">容疑者数:</span> <span className="font-bold text-amber-400">{currentScenario.characters.length}名</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-950/60 px-3 py-1.5 rounded-lg border border-neutral-850">
                    <span className="text-neutral-500">暴くべき矛盾:</span> <span className="font-bold text-rose-400">{currentScenario.contradictions.length}点</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-950/60 px-3 py-1.5 rounded-lg border border-neutral-850">
                    <span className="text-neutral-500">解決済み:</span> <span className="font-bold text-emerald-400">{solvedContradictions.length} / {currentScenario.contradictions.length}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800">
                <button 
                  id="btn-close-intro"
                  onClick={() => { playStartSE(); setShowIntro(false); }}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-2xl text-xs tracking-wider transition-all duration-300 hover:scale-[1.01] shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <span>捜査を開始する</span>
                  <ArrowRight size={14} />
                </button>
                
                <button 
                  onClick={() => {
                    setShowCreatorModal(true);
                    setShowIntro(false);
                  }}
                  className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 px-6 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  <span>新しい事件を構築</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Portal: Selected by User */}
        {showWelcomePortal && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 py-4 animate-fade-in">
            {/* Header / Guide */}
            <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-center text-center md:text-left">
                <div className="space-y-3">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black tracking-widest uppercase rounded-full">
                    WELCOME TO DETECTIVE RECRUITMENT
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black text-neutral-100 flex items-center justify-center md:justify-start gap-2">
                    <ShieldAlert className="text-amber-500 animate-pulse" size={28} />
                    <span>矛盾を暴く、AI脱出ミステリー</span>
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-2xl font-semibold">
                    容疑者たちの証言を比較し、対立する「盾と矛（矛盾）」を告発せよ。すべての矛盾を解明すれば、扉のパスワードを暴く最終脱出問題へと進めます。まずは、挑戦する「事件の難易度」や「シナリオ」を選択してください。
                  </p>
                </div>
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl shrink-0 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-3xl mb-1 flex items-center justify-center">🕵️‍♂️</span>
                  <span className="text-[10px] font-mono text-neutral-500">PLAYER STATUS</span>
                  <span className="text-xs font-black text-amber-500 tracking-wider">特級論理捜査官</span>
                </div>
              </div>
            </div>

            {/* Difficulty Tabs / Filter Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Key size={18} className="text-amber-500" />
                  <h3 className="text-sm font-black tracking-widest text-neutral-300 uppercase">
                    難易度別に事件を選択
                  </h3>
                </div>
                
                {/* Difficulty Filters */}
                <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-850">
                  {([
                    { key: 'All', label: 'すべて 📁' },
                    { key: 'Easy', label: '初級 🟢' },
                    { key: 'Medium', label: '中級 🟡' },
                    { key: 'Hard', label: '上級 🔴' }
                  ] as const).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setWelcomeDifficultyFilter(opt.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        welcomeDifficultyFilter === opt.key
                          ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Available Scenarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios
                  .filter(s => welcomeDifficultyFilter === 'All' || s.difficulty === welcomeDifficultyFilter)
                  .map((s) => {
                    return (
                      <div
                        key={s.id}
                        onClick={() => selectScenario(s)}
                        className="group bg-neutral-900/30 border border-neutral-800 hover:border-amber-500/50 rounded-3xl p-5 md:p-6 cursor-pointer transition-all duration-300 hover:bg-neutral-900/60 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between gap-4 h-full relative overflow-hidden animate-fade-in"
                      >
                        {/* Decorative background light effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.01] rounded-full blur-2xl group-hover:bg-amber-500/[0.03] duration-500"></div>

                        <div className="space-y-3">
                          {/* Top Labels */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 bg-neutral-950 border border-neutral-850 rounded text-[9px] font-bold text-neutral-400">
                              {s.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              s.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                              s.difficulty === 'Medium' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/10' :
                              'bg-rose-950 text-rose-400 border border-rose-500/20'
                            }`}>
                              {s.difficulty === 'Easy' ? '🟢 初級' :
                               s.difficulty === 'Medium' ? '🟡 中級' :
                               '🔴 上級'}
                            </span>
                          </div>

                          {/* Title & Intro */}
                          <div className="space-y-1">
                            <h4 className="text-lg font-black text-neutral-100 group-hover:text-amber-400 transition-colors">
                              {s.title}
                            </h4>
                            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                              {s.intro}
                            </p>
                          </div>

                          {/* Characters avatars roll */}
                          <div className="pt-2 flex items-center gap-2">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase mr-1">容疑者一覧:</span>
                            <div className="flex -space-x-2">
                              {s.characters.map((char) => (
                                <div
                                  key={char.id}
                                  title={`${char.name} (${char.role})`}
                                  className="w-7 h-7 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs filter drop-shadow shadow-md"
                                >
                                  {char.avatar}
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-neutral-500 ml-1">
                              ({s.characters.length}名)
                            </span>
                          </div>
                        </div>

                        {/* Button Action */}
                        <div className="pt-2 border-t border-neutral-850/60 mt-auto flex justify-between items-center">
                          <span className="text-[10px] text-neutral-500 font-mono">
                            矛盾数: {s.contradictions.length}点
                          </span>
                          <span
                            className="bg-neutral-950 group-hover:bg-amber-500 text-neutral-400 group-hover:text-neutral-950 border border-neutral-800 group-hover:border-amber-400 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow"
                          >
                            <span>捜査を開始する</span>
                            <ArrowRight size={12} className="group-hover:translate-x-0.5 duration-300" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Quick Gemini Original Game Constructor card (bento grid layout) */}
            <div className="bg-gradient-to-b from-neutral-900/60 to-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div className="space-y-1">
                  <span className="text-amber-400 uppercase tracking-widest font-mono text-[9px] font-black">
                    INFINITY MYSTERY ENGINE
                  </span>
                  <h3 className="text-xl font-black text-neutral-100 flex items-center gap-2">
                    <Sparkles className="text-amber-400 animate-pulse" size={20} />
                    <span>無限AIミステリー・オリジナル事件クリエイター</span>
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-850">
                  Powered by Gemini 3.5 Flash
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
                    既定のシナリオをハックした後は、あなたの独自のテーマで事件を創りましょう。自由な設定やキーワード（例：『深夜のコンビニ強盗』『魔法学校の答案改ざん』など）を入力すると、Geminiが難解な論理パズル、オリジナル容疑者の証言群、そして追加される追加手がかりを完全にオートプロット生成します！
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-neutral-400 block">事件のシチュエーション・テーマ自由記入：</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="input-custom-theme-portal"
                        value={customTheme}
                        onChange={(e) => setCustomTheme(e.target.value)}
                        placeholder="例：『古代エジプトのミイラ盗難事件』『近未来の自動配送センターの不審火』など"
                        disabled={isGeneratingScenario}
                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-amber-500 transition-colors pr-12 font-semibold"
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500">
                        <Sparkles size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                    <span className="text-[10px] text-neutral-500 font-mono">おすすめテーマ案:</span>
                    {[
                      "サイバー病院のハッキング",
                      "深海探査基地 of 浸水嘘",
                      "深夜 of コンビニ強盗",
                      "魔法学校 of 答案改ざん"
                    ].map((idea) => (
                      <button
                        key={idea}
                        onClick={() => setCustomTheme(idea)}
                        disabled={isGeneratingScenario}
                        className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-neutral-200 text-[10px] px-2.5 py-1 rounded-lg transition-colors font-semibold"
                      >
                        + {idea}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 bg-neutral-950/40 p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                  <div className="space-y-3">
                    <label className="text-xs font-mono font-bold text-neutral-400 block">生成する難易度：</label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                        <button
                          key={diff}
                          id={`diff-btn-portal-${diff}`}
                          onClick={() => setCustomDifficulty(diff)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            customDifficulty === diff 
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 scale-[1.03]' 
                              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          {diff === 'Easy' ? '初級 🟢' : diff === 'Medium' ? '中級 🟡' : '上級 🔴'}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">
                      ※ 難易度を「Hard」にすると、Geminiは緻密で微小な時間や状況の矛盾ズレでミステリを設計します。高度なパズルになります。
                    </p>
                  </div>

                  <button
                    id="btn-generate-scenario-portal"
                    disabled={isGeneratingScenario}
                    onClick={generateCustomScenario}
                    className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 text-neutral-950 font-black tracking-widest text-xs py-3.5 rounded-2xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-rose-500/5 mt-2"
                  >
                    {isGeneratingScenario ? (
                      <>
                        <RefreshCw className="animate-spin text-neutral-950" size={14} />
                        <span>Geminiがミステリ創作中... (約10秒)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} className="text-neutral-950 animate-pulse" />
                        <span>オリジナル推理世界を構築する</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time AI Character Dialog Rail (Showcases what characters say and think) */}
        {currentScenario && !showWelcomePortal && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-4 items-center shrink-0">
            <div className="absolute top-0 right-0 flex items-center gap-1 px-4 py-1.5 bg-neutral-950 rounded-bl-2xl text-[10px] font-mono text-neutral-500 border-l border-b border-rose-950">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></div>
              <span>DETECTIVE DIALOGUE MONITOR</span>
            </div>

            {/* Character face block */}
            <div className="flex flex-col items-center justify-center text-center bg-neutral-950 border border-neutral-800 rounded-2xl p-4 w-full md:w-44 shrink-0 shadow-inner">
              <span className="text-5xl md:text-6xl mb-2 animate-pulse filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.15)]">
                {dialogSpeaker?.avatar || '🕵️'}
              </span>
              <h3 className="text-sm font-black text-neutral-100 tracking-wider">
                {dialogSpeaker?.name || '指示官'}
              </h3>
              <p className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full mt-1">
                {dialogSpeaker?.role || 'ゲームシステム'}
              </p>
            </div>

            {/* Message Speech bubble */}
            <div className="flex-1 w-full space-y-3">
              <div className="text-neutral-300 text-sm italic md:text-base leading-relaxed bg-neutral-950/40 p-4 rounded-2xl border border-neutral-850 min-h-[5rem] flex items-center">
                “ {unlockedEvidences.length === 0 ? "事件を選択してスタートしてください。 " : dialogText} ”
              </div>
              
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-mono">STATUS: ACTIVE INQUIRY</span>
                {selectedCharacterId && (
                  <button 
                    id="btn-unfocus-char"
                    onClick={() => {
                      setSelectedCharacterId(null);
                      setDialogSpeaker({ name: "システムAI指導員", role: "調査ナビゲーター", avatar: "🕵️" });
                      setDialogText("事件の関係者のイラストを選択して尋問を切り替えてください。");
                    }}
                    className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    <span>フォーカス解除</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Body Grid: Left side Characters, Right side Evidences */}
        {currentScenario && !showWelcomePortal && !showEscapePhase && (
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
            
            {/* LEFT COLUMN: Suspect Characters (4/12 width) */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:h-full lg:overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <MessageSquare size={16} className="text-amber-500" />
                  <span>重要関係者の尋問室</span>
                </h2>
                <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-1 rounded-lg">タップして発言を聞く</span>
              </div>

              <div id="character-list" className="grid grid-cols-1 gap-4">
                {currentScenario.characters.map((char) => {
                  const isFocused = selectedCharacterId === char.id;
                  
                  return (
                    <div
                      key={char.id}
                      id={`char-card-${char.id}`}
                      onClick={() => handleCharacterInterrogate(char)}
                      className={`group relative border rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden ${
                        isFocused 
                          ? 'bg-neutral-900 border-amber-500 shadow-lg shadow-amber-500/10 translate-x-1' 
                          : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                      }`}
                    >
                      {/* Character Color Accents */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-rose-600"></div>
                      
                      <div className="flex items-start gap-4 pl-2">
                        <span className="text-4xl filter drop-shadow-md group-hover:scale-110 duration-300">
                          {char.avatar}
                        </span>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-neutral-100 group-hover:text-amber-400 transition-colors">
                              {char.name}
                            </h4>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-850">
                              {char.role}
                            </span>
                          </div>
                          
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            {char.description}
                          </p>

                          <div className="pt-2 flex items-center text-[10px] text-amber-500/80 gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <RotateCcw size={10} className="animate-spin" />
                            <span>クリックして直接問い詰める</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips & Progress tracker */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2.5">
                  <Clipboard size={16} className="text-rose-500" />
                  <h4 className="text-xs font-black tracking-wider text-neutral-300 uppercase">
                    捜査進捗レポート
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-neutral-500 font-mono">入手した全言リスト:</span>
                    <span className="text-lg font-black text-neutral-200 mt-1">{unlockedEvidences.length} 枚</span>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-neutral-500 font-mono">暴き終えた嘘:</span>
                    <span className="text-lg font-black text-rose-500 mt-1">{solvedContradictions.length} 箇所</span>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 mb-1">
                    <HelpCircle size={13} />
                    <span>捜査官の心得</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    容疑者の発言は、もう一方の関係者の証言や、現場調査で得られた物理的な形跡と真っ向からぶつかり合っている。バインダーから「2枚」の矛盾する主張を選択せよ。
                  </p>
                </div>
              </div>

              {/* Progressive Hints Section */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-amber-500 animate-pulse" />
                    <h4 className="text-xs font-black tracking-wider text-neutral-300 uppercase">
                      💡 行き詰まった時のヒント
                    </h4>
                  </div>
                  {currentScenario?.hints && currentHintLevel < 3 && (
                    <button
                      onClick={() => setCurrentHintLevel(prev => Math.min(prev + 1, 3))}
                      className="text-[10px] font-bold text-amber-500 hover:text-amber-400 bg-amber-950/20 border border-amber-500/30 px-2 py-1 rounded-lg transition-all"
                    >
                      {currentHintLevel === 0 ? "ヒントを開く" : "次のヒントを解放"}
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {currentScenario?.hints ? (
                    currentScenario.hints.map((hintText, index) => {
                      const isRevealed = currentHintLevel > index;
                      return (
                        <div
                          key={index}
                          className={`rounded-xl p-3 border transition-all duration-300 ${
                            isRevealed
                              ? 'bg-neutral-950 border-neutral-850 shadow-inner'
                              : 'bg-neutral-950/20 border-neutral-900/30 opacity-45 select-none'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              isRevealed ? 'text-amber-500' : 'text-neutral-500'
                            }`}>
                              段階 {index + 1}: {index === 0 ? "調査ポイント" : index === 1 ? "矛盾の核心" : "告発の組み合わせ"}
                            </span>
                            {!isRevealed && (
                              <button
                                onClick={() => {
                                  if (currentHintLevel === index) {
                                    setCurrentHintLevel(index + 1);
                                  }
                                }}
                                disabled={currentHintLevel !== index}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${
                                  currentHintLevel === index
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 cursor-pointer'
                                    : 'bg-neutral-900 text-neutral-600 border border-neutral-850 cursor-not-allowed'
                                }`}
                              >
                                解放する
                              </button>
                            )}
                          </div>
                          {isRevealed ? (
                            <p className="text-[11px] text-neutral-300 leading-relaxed font-semibold transition-all duration-300 animate-fade-in whitespace-pre-wrap">
                              {hintText}
                            </p>
                          ) : (
                            <p className="text-[11px] leading-relaxed italic font-mono text-neutral-600">
                              (「解放する」を押すと表示されます)
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-xs text-neutral-500 italic">
                      このシナリオにはヒント情報が設定されていません。
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Evidence & Clues Binder (7/12 width) */}
            <div id="evidence-stage" className="lg:col-span-7 flex flex-col gap-4 lg:h-full lg:min-h-0">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-amber-500" />
                  <h3 className="text-base font-black tracking-widest text-neutral-300 uppercase">
                    捜査資料・調書バインダー
                  </h3>
                </div>
                
                <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-rose-500 rounded-full"></span>
                  <span>選択中: {selectedEvidenceIds.length} / 2</span>
                </span>
              </div>

              {/* Scrollable grid wrapper */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {unlockedEvidences.map((ev) => {
                    const isSelected = selectedEvidenceIds.includes(ev.id);
                    const isPartofResolved = currentScenario.contradictions.some(con => 
                      solvedContradictions.includes(con.id) && 
                      (con.evidenceIdA === ev.id || con.evidenceIdB === ev.id)
                    );
                    
                    return (
                      <div
                        key={ev.id}
                        id={`evidence-card-${ev.id}`}
                        onClick={() => handleToggleEvidence(ev.id)}
                        className={`group border rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected 
                            ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]' 
                            : isPartofResolved
                              ? 'bg-neutral-900/60 border-neutral-800/80 opacity-75'
                              : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                        }`}
                      >
                        {/* Solved Stamp */}
                        {isPartofResolved && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-950 border border-emerald-500 text-[9px] font-mono rounded text-emerald-400 scale-90 z-10 font-black">
                            <CheckCircle size={10} />
                            <span>矛盾立証済</span>
                          </div>
                        )}

                        <div className="text-xs space-y-2">
                          {/* Source Label */}
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-neutral-950 border border-neutral-850 rounded text-[10px] font-bold text-neutral-300">
                              {ev.source}
                            </span>
                            <span className="text-[10px] text-neutral-500">証言 ID: {ev.id}</span>
                          </div>

                          {/* Dialogue content */}
                          <p className="text-neutral-200 text-xs italic leading-relaxed pt-1">
                            {ev.content}
                          </p>
                        </div>

                        {/* Card Bottom status indicators */}
                        <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-500">
                            {isSelected ? "📍 矛盾検証対象として選択中" : "🔍 比較対象としてタップ"}
                          </span>
                          
                          <div className={`h-4 w-4 rounded-full border transition-all duration-300 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-amber-500 border-amber-400' 
                              : 'border-neutral-800 bg-neutral-950'
                          }`}>
                            {isSelected && <span className="block h-1.5 w-1.5 bg-neutral-950 rounded-full"></span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* If somehow no evidences displayed */}
                  {unlockedEvidences.length === 0 && (
                    <div className="col-span-2 text-center py-12 border border-dashed border-neutral-800 rounded-3xl text-neutral-500">
                      関係者に尋問を行い、証言データを集めてください。
                    </div>
                  )}
                </div>
              </div>

              {/* ACCUSATION DRAWER (Shows up when 2 evidences are active) */}
              {selectedEvidenceIds.length === 2 && (
                <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 mt-4 shadow-xl animate-bounce-short relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="text-amber-500 animate-pulse" size={20} />
                    <h4 className="text-sm font-black text-neutral-100 tracking-wider">
                      盾と矛の告発準備: 証言対決
                    </h4>
                  </div>

                  <div className="grid grid-cols-5 items-center gap-2 text-xs mb-4">
                    {/* Event A preview */}
                    <div className="col-span-2 bg-neutral-950 border border-neutral-850 p-3 rounded-xl">
                      <span className="font-extrabold text-amber-500 block mb-1">
                        {unlockedEvidences.find(e => e.id === selectedEvidenceIds[0])?.source}
                      </span>
                      <p className="text-neutral-400 line-clamp-2 italic">
                        {unlockedEvidences.find(e => e.id === selectedEvidenceIds[0])?.content}
                      </p>
                    </div>

                    {/* Centered VS node */}
                    <div className="col-span-1 text-center font-black text-neutral-500 text-lg flex flex-col items-center">
                      <span className="text-rose-500 font-mono text-xs scale-90 border border-rose-500/30 px-1 py-0.5 rounded bg-rose-500/5 mb-1 blink">CONFLICT</span>
                      <span>⚡</span>
                    </div>

                    {/* Event B preview */}
                    <div className="col-span-2 bg-neutral-950 border border-neutral-850 p-3 rounded-xl">
                      <span className="font-extrabold text-indigo-400 block mb-1">
                        {unlockedEvidences.find(e => e.id === selectedEvidenceIds[1])?.source}
                      </span>
                      <p className="text-neutral-400 line-clamp-2 italic">
                        {unlockedEvidences.find(e => e.id === selectedEvidenceIds[1])?.content}
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-trigger-accuse-modal"
                    onClick={() => {
                      setIsAccusing(true);
                      setUserExplanation('');
                      setAccusationResult(null);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 font-black tracking-widest text-xs py-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                  >
                    <span>「異議あり！」論理的に嘘を告発する</span>
                  </button>
                </div>
              )}

              {/* ESCAPE TRIGGER SECTION (Unlocks when ready) */}
              {isReadyToEscape && !showEscapePhase && (
                <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/10 to-teal-900/10 border border-emerald-500 rounded-3xl p-6 mt-4 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-3 bg-emerald-500 text-neutral-950 text-[10px] font-mono tracking-widest font-black rounded-bl-2xl">
                    SECURITY BYPASSED
                  </div>
                  
                  <div className="space-y-2 max-w-xl">
                    <h4 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                      <Unlock className="animate-bounce" size={20} />
                      <span>最終脱出ハッチが起動しました！</span>
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      おめでとう！ すべきすべての矛盾を暴きました。これにより、隠し部屋へのパスロックが作動中。最終的な犯人とその脱出手順を正しく告発すれば、この部屋から安全に脱出できます。
                    </p>
                    
                    <button
                      id="btn-go-escape"
                      onClick={() => setShowEscapePhase(true)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-md shadow-emerald-500/20 flex items-center gap-2 mt-4"
                    >
                      <span>真相を突きつけて脱出ゲートを開む</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ESCAPE PUZZLE INTERACTIVE VIEW (The Great Finale modal / section) */}
        {showEscapePhase && currentScenario && (
          <div className="bg-neutral-900 border-2 border-emerald-500 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 text-emerald-500/5 pointer-events-none">
              <Skull size={200} />
            </div>

            <div className="border-b border-neutral-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-500 uppercase tracking-widest font-mono text-[10px] font-black border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/5 block w-max mb-1.5">
                  FINAL ESCAPE VERIFICATION
                </span>
                <h3 className="text-2xl font-black text-neutral-100 flex items-center gap-2">
                  <span>最終調書報告：「真犯人は誰だ？」</span>
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-xl text-xs font-mono font-bold text-neutral-400">
                <span>セキュア・パルス（残ライフ）:</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        idx < escapeAttempts ? 'bg-rose-500 text-neutral-950' : 'bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* If resolved or failed */}
            {escapeResult ? (
              <div className={`p-6 rounded-2xl border ${
                escapeResult.success 
                  ? 'bg-emerald-950/30 border-emerald-500 text-neutral-100' 
                  : 'bg-rose-950/30 border-rose-500 text-neutral-100'
              } space-y-4`}>
                <div className="flex items-center gap-2.5 text-lg font-black">
                  {escapeResult.success ? (
                    <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-neutral-950 text-xl animate-pulse">✓</div>
                  ) : (
                    <div className="h-10 w-10 bg-rose-500 rounded-full flex items-center justify-center text-neutral-900 text-xl animate-shake">✗</div>
                  )}
                  <span>{escapeResult.success ? "ESCPE SUCCESS: 脱出に成功しました！" : "GAME OVER: 脱出に失敗しました"}</span>
                </div>
                
                <p className="text-sm leading-relaxed text-neutral-300">
                  {escapeResult.explanation}
                </p>

                <div className="pt-4 flex gap-3">
                  <button
                    id="btn-retry-scen"
                    onClick={() => selectScenario(currentScenario)}
                    className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-neutral-100 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw size={12} />
                    <span>もう一度挑戦する</span>
                  </button>
                  
                  <button
                    id="btn-back-to-preset"
                    onClick={handleGoToPortal}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 hover:scale-[1.02] shadow-md shadow-amber-500/10"
                  >
                    <span>捜査官バインダーに戻る</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-5 shadow-inner">
                  <h4 className="text-neutral-400 text-xs font-mono mb-2 uppercase">論理の最終審問</h4>
                  <p className="text-neutral-100 text-sm md:text-base font-bold leading-relaxed">
                    {currentScenario.finalQuestion.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {currentScenario.finalQuestion.choices.map((choice, index) => {
                    const isSelected = selectedFinalChoice === index;
                    return (
                      <div
                        key={index}
                        id={`final-choice-${index}`}
                        onClick={() => setSelectedFinalChoice(index)}
                        className={`border rounded-2xl p-4 transition-all duration-300 cursor-pointer flex gap-3 items-center ${
                          isSelected 
                            ? 'bg-emerald-950/20 border-emerald-500 text-neutral-100 scale-[1.01]' 
                            : 'bg-neutral-950/40 border-neutral-850 hover:border-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center font-bold text-xs ${
                          isSelected 
                            ? 'bg-emerald-500 border-emerald-400 text-neutral-950' 
                            : 'border-neutral-850 bg-neutral-950 text-neutral-500'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <p className="text-xs leading-relaxed">{choice}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-neutral-800">
                  <button
                    id="btn-abort-escape"
                    onClick={() => {
                      setShowEscapePhase(false);
                      setSelectedFinalChoice(null);
                    }}
                    className="bg-neutral-950 border border-neutral-800 text-neutral-400 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                  >
                    戻る
                  </button>
                  <button
                    id="btn-confirm-escape"
                    disabled={selectedFinalChoice === null}
                    onClick={handleFinalEscapeSubmit}
                    className={`font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md ${
                      selectedFinalChoice !== null 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/10' 
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    論理報告書を送信し、脱出ゲートをハックする
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* CREATIVE INFINITE DYNAMIC MIC-SCENARIO GENERATOR BOX OVERLAY MODAL */}
      {showCreatorModal && (
        <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-45 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 w-full max-w-4xl rounded-3xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            
            {/* Close button */}
            <button 
              onClick={() => setShowCreatorModal(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-850 p-2 rounded-full border border-neutral-850 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <span className="text-amber-500 uppercase tracking-widest font-mono text-[10px] font-black">
                  INFINITE GEMINI MYSTERY GENERATOR
                </span>
                <h3 className="text-xl font-black text-neutral-100 flex items-center gap-2">
                  <Sparkles className="text-amber-400 animate-pulse" size={20} />
                  <span>無限AIミステリー・オリジナル事件クリエイター</span>
                </h3>
              </div>
              <span className="text-xs text-neutral-500 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-850">
                Powered by Gemini 3.5 Flash
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="col-span-1 md:col-span-7 space-y-4">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  定まった既存のシナリオを解き明かしたあとは、あなたの自由な発想をAIに伝えましょう。「テーマ」や「シチュエーション」を詳細に書くことで、Geminiが<b>独自の登場人物、完全に構成された証言リスト（矛盾が2箇所隠されています）、そして最終質問</b>をその場で精密にプロット設計して出力します。
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-400 block">事件のシチュエーション・テーマ自由記入：</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-custom-theme-modal"
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      placeholder="例：『古代エジプトのミイラ盗難事件』『近未来の自動配送センターの不審火』など"
                      disabled={isGeneratingScenario}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition-colors pr-12 font-semibold"
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-600">
                      <Sparkles size={16} />
                    </div>
                  </div>
                </div>

                {/* Ideas / Presets triggers helper */}
                <div className="flex flex-wrap gap-2 pt-1 items-center">
                  <span className="text-[10px] text-neutral-500 font-mono">おすすめテーマ案:</span>
                  {[
                    "サイバー病院のハッキング",
                    "深海探査基地 of 浸水嘘",
                    "深夜のコンビニ強盗",
                    "魔法学校の答案改ざん"
                  ].map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setCustomTheme(idea)}
                      disabled={isGeneratingScenario}
                      className="bg-neutral-950 hover:bg-neutral-905 border border-neutral-850 text-neutral-400 hover:text-neutral-200 text-[10px] px-2.5 py-1 rounded-lg transition-colors font-semibold"
                    >
                      + {idea}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-5 space-y-4 bg-neutral-950/40 p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
                <div className="space-y-3">
                  <label className="text-xs font-mono font-bold text-neutral-400 block">難易度および論理パズルの堅牢度：</label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                      <button
                        key={diff}
                        id={`diff-btn-modal-${diff}`}
                        onClick={() => setCustomDifficulty(diff)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          customDifficulty === diff 
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 scale-[1.03]' 
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {diff === 'Easy' ? '初級 🟢' : diff === 'Medium' ? '中級 🟡' : '上級 🔴'}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">
                    ※ 難易度を「Hard」にすると、非常に複雑な証言ズレが発生し、高い推理力が必要になります。
                  </p>
                </div>

                <button
                  id="btn-generate-scenario-modal"
                  disabled={isGeneratingScenario}
                  onClick={generateCustomScenario}
                  className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 text-neutral-950 font-black tracking-widest text-xs py-3.5 rounded-2xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-rose-500/5 mt-2"
                >
                  {isGeneratingScenario ? (
                    <>
                      <RefreshCw className="animate-spin text-neutral-950" size={14} />
                      <span>Geminiがミステリ創作中... (約10秒)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-neutral-950 animate-pulse" />
                      <span>オリジナル推理世界を構築する</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCUSATION DIALOG / MODAL PANEL (When clicking 'Accuse' on selected 2 items) */}
      {isAccusing && selectedEvidenceIds.length === 2 && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            
            {/* Close button */}
            <button 
              id="btn-close-accuse"
              onClick={closeAccusationModal}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-850 p-2 rounded-full border border-neutral-850 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="border-b border-neutral-800 pb-3 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={22} />
              <div>
                <h3 className="text-lg font-black text-neutral-100 tracking-wider">
                  対抗尋問：「異議あり！」の主張
                </h3>
                <p className="text-xs text-neutral-500">2つの言における論理を告発します</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Compare section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl relative">
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-neutral-500">証言A</span>
                  <p className="text-xs font-bold text-amber-500 mb-1.5">
                    {unlockedEvidences.find(e => e.id === selectedEvidenceIds[0])?.source}
                  </p>
                  <p className="text-xs italic leading-relaxed text-neutral-300">
                    {unlockedEvidences.find(e => e.id === selectedEvidenceIds[0])?.content}
                  </p>
                </div>

                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl relative">
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-neutral-500">証言B</span>
                  <p className="text-xs font-bold text-indigo-400 mb-1.5">
                    {unlockedEvidences.find(e => e.id === selectedEvidenceIds[1])?.source}
                  </p>
                  <p className="text-xs italic leading-relaxed text-neutral-300">
                    {unlockedEvidences.find(e => e.id === selectedEvidenceIds[1])?.content}
                  </p>
                </div>
              </div>

              {/* Dynamic Verification output box */}
              {accusationResult ? (
                <div className={`p-5 rounded-2xl border ${
                  accusationResult.isAccepted 
                    ? 'bg-emerald-950/20 border-emerald-500/80 text-neutral-100' 
                    : 'bg-rose-950/20 border-rose-500/80 text-neutral-300'
                } space-y-3`}>
                  <div className="flex items-center gap-2 font-black text-sm">
                    {accusationResult.isAccepted ? (
                      <span className="h-5 w-5 rounded-full bg-emerald-500 text-neutral-900 flex items-center justify-center text-xs">✓</span>
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-rose-500 text-neutral-900 flex items-center justify-center text-xs">✗</span>
                    )}
                    <span>{accusationResult.isAccepted ? "論理的に正解です！矛盾を打破した！" : "却下！その指摘は妥当ではありません"}</span>
                  </div>
                  
                  {/* Character React block */}
                  <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-850">
                    <span className="text-[10px] text-neutral-500 font-mono block mb-1">相手の動揺的な反応:</span>
                    <p className="text-xs text-neutral-200 italic font-medium leading-relaxed">
                      “ {accusationResult.characterResponse} ”
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-neutral-400 font-mono">
                    <b>（論理解析解説）：</b> {accusationResult.logicExplanation}
                  </p>

                  {accusationResult.isAccepted && accusationResult.nextClue && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-neutral-100 space-y-1.5 mt-2">
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                        <Sparkles size={13} className="animate-pulse" />
                        <span>新たな言が解放されました！ : {accusationResult.nextClue.clueMessage}</span>
                      </span>
                      <p className="text-xs leading-relaxed italic text-neutral-300">
                        {accusationResult.nextClue.content}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      id="btn-dismiss-result"
                      onClick={closeAccusationModal}
                      className="bg-neutral-100 hover:bg-white text-neutral-950 font-bold text-xs px-5 py-2 rounded-xl transition-all"
                    >
                      捜査を続ける
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono font-bold text-neutral-400 block">
                        なぜこれらが矛盾しているのか、あなたのロジックを入力：
                      </label>
                      <button
                        onClick={() => {
                          const matched = currentScenario.contradictions.find(c => 
                            (c.evidenceIdA === selectedEvidenceIds[0] && c.evidenceIdB === selectedEvidenceIds[1]) ||
                            (c.evidenceIdA === selectedEvidenceIds[1] && c.evidenceIdB === selectedEvidenceIds[0])
                          );
                          if (matched) {
                            setUserExplanation(`【ヒントを活用】 ${matched.description}`);
                          } else {
                            setUserExplanation("恐らく主張されている内容、時間、場所やアリバイが一致していません。");
                          }
                        }}
                        className="text-[10px] text-amber-500 hover:text-amber-400 hover:underline"
                      >
                        💡 捜査のヒントを代入する
                      </button>
                    </div>
                    
                    <textarea
                      id="input-accuse-explanation"
                      rows={3}
                      value={userExplanation}
                      onChange={(e) => setUserExplanation(e.target.value)}
                      placeholder="例：『ハリスはシャワーを浴びていたと言うが、ジェイクは元栓を閉めて水は一滴も出なかったと言っており、時間帯が完全にバッティングしている。』など"
                      disabled={isVerifying}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-2xl p-4 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600 font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      id="btn-cancel-accuse"
                      type="button"
                      onClick={closeAccusationModal}
                      className="bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-neutral-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                    >
                      キャンセル
                    </button>
                    
                    <button
                      id="btn-submit-verify"
                      disabled={!userExplanation.trim() || isVerifying}
                      onClick={handleVerifyContradiction}
                      className={`font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md ${
                        userExplanation.trim() && !isVerifying
                          ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/15'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="animate-spin text-neutral-950" size={13} />
                          <span>AI判定中...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>告発（異議あり！）</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 text-center text-xs text-neutral-500 space-y-2 mt-12">
        <p className="font-mono">CRITICAL PATH METHOD // LOGICAL COMBAT RADAR SYSTEM</p>
        <p className="text-neutral-600">
          相手の発言の「盾と矛（矛盾）」を見抜く脱出ゲーム。AIがあなたの言葉の論理性そのものをリアルタイム診断します。
        </p>
      </footer>

    </div>
  );
}
