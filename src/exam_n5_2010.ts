// src/exam_n5_2010.ts

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  section: string;
  script?: string; // 聽力稿
  note?: string;   // 簡易備註
  
  // ✨ 新增欄位
  textTranslation?: string;   // 題目翻譯
  optionTranslations?: string[]; // 選項的翻譯或對應漢字
  explanation?: string;       // 詳細解析
}

export interface ExamPaper {
  id: string;
  title: string;
  type: 'written' | 'listening';
  questions: ExamQuestion[];
}

// 1. 言語知識・讀解 (筆試) - 完整解析版
export const exam2010_written: ExamPaper = {
  id: "2010-n5-written",
  title: "2010-2011 N5 言語知識・読解",
  type: "written",
  questions: [
    // --- 文字語彙 問題1 (讀音) ---
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-1", 
      question: "__先週__ デパートにかいものにいきました。", 
      options: ["せんしゅ", "せんしゅう", "ぜんしゅ", "ぜんしゅう"], 
      answer: 2,
      textTranslation: "上週去了百貨公司買東西。",
      optionTranslations: ["X", "先週 (正解)", "X", "X"],
      explanation: "「先週（せんしゅう）」是長音。注意不要唸成短音。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-2", 
      question: "ごはんの __後__ でさんぽします。", 
      options: ["つぎ", "うしろ", "まえ", "あと"], 
      answer: 4,
      textTranslation: "吃完飯後去散步。",
      optionTranslations: ["次 (下一個)", "後ろ (後面 - 空間)", "前 (前面/之前)", "後 (後面 - 時間)"],
      explanation: "表示時間的「在...之後」唸作「あと」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-3", 
      question: "もういちど __言__ ってください。", 
      options: ["いって", "きって", "まって", "たって"], 
      answer: 1,
      textTranslation: "請再說一次。",
      optionTranslations: ["言って (說)", "切って (切/剪)", "待って (等)", "立って (站)"],
      explanation: "「言います」的て形是「言って（いって）」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-4", 
      question: "ちかくに __山__ があります。", 
      options: ["かわ", "やま", "いけ", "うみ"], 
      answer: 2,
      textTranslation: "附近有山。",
      optionTranslations: ["川 (河)", "山 (山)", "池 (池塘)", "海 (海)"],
      explanation: "基本的地理名詞。「山」唸作「やま」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-5", 
      question: "このホテルはへやが __多__ いです。", 
      options: ["すくない", "おおい", "せまい", "ひろい"], 
      answer: 2,
      textTranslation: "這間飯店房間很多。",
      optionTranslations: ["少ない (少)", "多い (多)", "狭い (窄)", "広い (寬)"],
      explanation: "「多い」唸作「おおい」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-6", 
      question: "ともだちといっしょに __学校__ にいきます。", 
      options: ["がこう", "がこお", "がっこう", "がっこお"], 
      answer: 3,
      textTranslation: "跟朋友一起去學校。",
      optionTranslations: ["X", "X", "学校 (正解)", "X"],
      explanation: "「学校」是促音+長音，唸作「がっこう」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-7", 
      question: "えんぴつが __六本__ あります。", 
      options: ["ろくぼん", "ろくぽん", "ろっぽん", "ろっぽん(重)"], 
      answer: 3,
      textTranslation: "有六枝鉛筆。",
      optionTranslations: ["X", "X", "六本 (正解)", "X"],
      explanation: "量詞「本（ほん）」接在 1, 6, 8, 10 後面會變成半濁音「ぽん」並伴隨促音。6本 = ろっぽん。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-8", 
      question: "この __新聞__ はいくらですか。", 
      options: ["しんむん", "しんぶん", "しむん", "しぶん"], 
      answer: 2,
      textTranslation: "這份報紙多少錢？",
      optionTranslations: ["X", "新聞 (正解)", "X", "X"],
      explanation: "「新聞」唸作「しんぶん」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-9", 
      question: "このカメラは __安__ いです。", 
      options: ["たかい", "やすい", "おもい", "かるい"], 
      answer: 2,
      textTranslation: "這台相機很便宜。",
      optionTranslations: ["高い (貴)", "安い (便宜)", "重い (重)", "軽い (輕)"],
      explanation: "「安い」唸作「やすい」。"
    },
    { 
      section: "文字・語彙 問題1 (讀音)", id: "v1-10", 
      question: "かさは __外__ にあります。", 
      options: ["いえ", "なか", "そと", "にわ"], 
      answer: 3,
      textTranslation: "傘在外面。",
      optionTranslations: ["家 (家)", "中 (裡面)", "外 (外面)", "庭 (庭院)"],
      explanation: "「外」唸作「そと」。"
    },

    // --- 文字語彙 問題2 (漢字) ---
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-11", 
      question: "けさ __しゃわー__ をあびました。", 
      options: ["シャワー", "シャウー", "ツァワー", "ツァウー"], 
      answer: 1,
      textTranslation: "今天早上淋浴(洗澡)了。",
      optionTranslations: ["Shower (正解)", "X", "X", "X"],
      explanation: "淋浴是外來語 Shower，片假名寫作「シャワー」。"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-12", 
      question: "コーヒーを __のみ__ ました。", 
      options: ["飯みました", "飲みました", "餃みました", "食みました"], 
      answer: 2,
      textTranslation: "喝了咖啡。",
      optionTranslations: ["X", "飲みました (正解)", "X", "X"],
      explanation: "「飲む（喝）」的漢字是「飲」。"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-13", 
      question: "__あたらしい くるま__ をかいました。", 
      options: ["卓", "早", "車", "真"], 
      answer: 3,
      textTranslation: "買了新車。",
      optionTranslations: ["卓 (桌)", "早 (早)", "車 (車 - 正解)", "真 (真)"],
      explanation: "題目問的是「くるま」的漢字。正確為「車」。(此題選項設計較特殊，僅考車的漢字)"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-14", 
      question: "このぼうしは __1000えん__ です。", 
      options: ["1000内", "1000用", "1000冊", "1000円"], 
      answer: 4,
      textTranslation: "這頂帽子1000日圓。",
      optionTranslations: ["內", "用", "冊 (書本量詞)", "円 (日圓 - 正解)"],
      explanation: "日幣單位的「えん」漢字寫作「円」。"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-15", 
      question: "しゅくだいが __はんぶん__ おわりました。", 
      options: ["羊分", "半分", "羊分(重)", "半分(重)"], 
      answer: 2,
      textTranslation: "作業做完一半了。",
      optionTranslations: ["X", "半分 (正解)", "X", "X"],
      explanation: "「はんぶん」漢字寫作「半分」。"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-16", 
      question: "わたしのうちに __き__ ませんか。", 
      options: ["来ませんか", "采ませんか", "木ませんか", "未ませんか"], 
      answer: 1,
      textTranslation: "要不要來我家？",
      optionTranslations: ["来ませんか (正解)", "X", "X", "X"],
      explanation: "「来ます（來）」的漢字是「来」。"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-17", 
      question: "きのうたなかさんと __あい__ ました。", 
      options: ["見いました", "書いました", "会いました", "話いました"], 
      answer: 3,
      textTranslation: "昨天跟田中先生見面了。",
      optionTranslations: ["看", "寫", "会いました (正解)", "說"],
      explanation: "「会います（見面）」的漢字是「会」。"
    },
    { 
      section: "文字・語彙 問題2 (漢字/寫法)", id: "v2-18", 
      question: "いもうとと __おなじ__ ふくをかいました。", 
      options: ["同じ", "回じ", "同じ(重)", "固じ"], 
      answer: 1,
      textTranslation: "買了跟妹妹一樣的衣服。",
      optionTranslations: ["同じ (正解)", "X", "X", "X"],
      explanation: "「おなじ」漢字寫作「同じ」。"
    },

    // --- 文字語彙 問題3 (填空) ---
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-19", 
      question: "わたしのへやはこの ______ の2かいです。", 
      options: ["エレベーター", "プール", "エアコン", "アパート"], 
      answer: 4,
      textTranslation: "我的房間在這棟公寓的2樓。",
      optionTranslations: ["電梯", "泳池", "冷氣", "公寓"],
      explanation: "根據語意，房間會在「公寓」裡。Apartment -> アパート。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-20", 
      question: "さとうさんはギターを じょうずに ______ 。", 
      options: ["うたいます", "ききます", "ひきます", "あそびます"], 
      answer: 3,
      textTranslation: "佐藤先生很會彈吉他。",
      optionTranslations: ["唱", "聽", "彈 (樂器)", "玩"],
      explanation: "演奏弦樂器（吉他、鋼琴、小提琴）動詞用「弾く（ひく）」。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-21", 
      question: "テーブルにおさらとはしを ______ ください。", 
      options: ["ならべて", "とって", "たべて", "あらって"], 
      answer: 1,
      textTranslation: "請把盤子和筷子排列在桌上。",
      optionTranslations: ["排列 (並べる)", "拿取 (取る)", "吃 (食べる)", "洗 (洗う)"],
      explanation: "準備吃飯時擺放餐具，動詞用「並べる（ならべる）」。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-22", 
      question: "けさそうじをしたからヘやは ______ です。", 
      options: ["きれい", "きたない", "あかるい", "くらい"], 
      answer: 1,
      textTranslation: "因為今早打掃過了，所以房間很乾淨。",
      optionTranslations: ["乾淨/漂亮", "髒", "亮", "暗"],
      explanation: "因為「打掃 (そうじ)」過了，結果當然是「乾淨 (きれい)」。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-23", 
      question: "きょうは 500 ______ およぎました。", 
      options: ["ど", "ばん", "メートル", "グラム"], 
      answer: 3,
      textTranslation: "今天游了500公尺。",
      optionTranslations: ["度 (溫度/次數)", "號 (號碼)", "公尺 (Meter)", "公克 (Gram)"],
      explanation: "游泳的單位是距離，用「メートル (公尺)」。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-24", 
      question: "えきからたいしかんまでの ______ をかいてください。", 
      options: ["しゃしん", "ちず", "てがみ", "きっぷ"], 
      answer: 2,
      textTranslation: "請畫出從車站到大使館的地圖。",
      optionTranslations: ["照片", "地圖", "信", "票"],
      explanation: "這裡動詞是「畫 (かいて)」，且描述從A地到B地的路徑，所以是畫「地圖 (ちず)」。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-25", 
      question: "うるさいからテレビを ______ ください。", 
      options: ["けして", "つけて", "しめて", "あけて"], 
      answer: 1,
      textTranslation: "因為很吵，請把電視關掉。",
      optionTranslations: ["關掉 (電器)", "打開 (電器)", "關閉 (門窗)", "打開 (門窗)"],
      explanation: "因為「很吵 (うるさい)」，所以要「關掉 (消す)」電視。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-26", 
      question: "きょうは ______ がふっています。", 
      options: ["くもり", "はれ", "かぜ", "ゆき"], 
      answer: 4,
      textTranslation: "今天正在下雪。",
      optionTranslations: ["陰天", "晴天", "風", "雪"],
      explanation: "動詞是「降っています (下著)」，對象通常是雨 (あめ) 或 雪 (ゆき)。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-27", 
      question: "はこにりんごが ______ あります。", 
      options: ["よっつ", "いつつ", "むっつ", "ななつ"], 
      answer: 2,
      textTranslation: "箱子裡有五個蘋果。",
      optionTranslations: ["4個", "5個", "6個", "7個"],
      explanation: "這是考量詞的讀音。需要根據上下文或單純選詞。N5考題通常是單純辨識數量詞。"
    },
    { 
      section: "文字・語彙 問題3 (填空)", id: "v3-28", 
      question: "めがねはつくえの ______ にあります。", 
      options: ["そば", "よこ", "した", "うえ"], 
      answer: 4,
      textTranslation: "眼鏡在桌子的上面。",
      optionTranslations: ["旁邊 (附近)", "旁邊 (橫向)", "下面", "上面"],
      explanation: "眼鏡通常是放在桌子的「上面 (うえ)」。"
    },

    // --- 文字語彙 問題4 (同義) ---
    { 
      section: "文字・語彙 問題4 (同義替換)", id: "v4-29", 
      question: "まいばんくにのかぞくにでんわします。", 
      options: ["よるはときどき...", "あさはときどき...", "よるはいつも...", "あさはいつも..."], 
      answer: 3,
      textTranslation: "每晚都打電話給國家的家人。",
      optionTranslations: ["晚上偶爾...", "早上偶爾...", "晚上總是...", "早上總是..."],
      explanation: "「毎晩（まいばん）」 = 「夜（よる）は いつも（總是）」。"
    },
    { 
      section: "文字・語彙 問題4 (同義替換)", id: "v4-30", 
      question: "このまちにはゆうめいな たてものがあります。", 
      options: ["...ビルがあります", "...おちゃがあります", "...ケーキがあります", "...こうえんがあります"], 
      answer: 1,
      textTranslation: "這座城市有有名的建築物。",
      optionTranslations: ["大樓", "茶", "蛋糕", "公園"],
      explanation: "「建物（たてもの）」是建築物的意思，選項中「ビル (Bill/Building)」最接近。"
    },
    { 
      section: "文字・語彙 問題4 (同義替換)", id: "v4-31", 
      question: "そのえいがは おもしろくなかったです。", 
      options: ["たのしかったです", "つまらなかったです", "みじかかったです", "ながかったです"], 
      answer: 2,
      textTranslation: "那部電影不有趣。",
      optionTranslations: ["很有趣 (楽しい)", "很無聊 (詰らない)", "很短 (短い)", "很長 (長い)"],
      explanation: "「面白くない（不有趣）」 = 「つまらない（無聊）」。"
    },
    { 
      section: "文字・語彙 問題4 (同義替換)", id: "v4-32", 
      question: "たんじょうびは6がつ15にちです。", 
      options: ["...けっこんしました", "...テストがはじまりました", "...うまれました", "...くにへかえりました"], 
      answer: 3,
      textTranslation: "生日是6月15日。",
      optionTranslations: ["結婚了", "考試開始了", "出生了", "回國了"],
      explanation: "「誕生日（生日）」 = 「生まれた日（出生的日子）」。"
    },
    { 
      section: "文字・語彙 問題4 (同義替換)", id: "v4-33", 
      question: "にねんまえに きょうとへいきました。", 
      options: ["きのう...", "おととい...", "きょねん...", "おととし..."], 
      answer: 4,
      textTranslation: "兩年前去了京都。",
      optionTranslations: ["昨天", "前天", "去年", "前年"],
      explanation: "「二年前（にねんまえ）」 = 「一昨年（おととし）」。"
    },

    // --- 文法 問題1 ---
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-1", 
      question: "日本 ______ ラーメンはおいしいです。", 
      options: ["に", "の", "と", "か"], 
      answer: 2, 
      textTranslation: "日本的拉麵很好吃。",
      explanation: "名詞修飾名詞用「の」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-2", 
      question: "わたしにはきょうだいが二人います。弟 ______ 妹です。", 
      options: ["は", "も", "と", "か"], 
      answer: 3, 
      textTranslation: "我有兩個兄弟姊妹。弟弟和妹妹。",
      explanation: "列舉事物「A和B」用「と」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-3", 
      question: "山下「田中さん ______ きのうどこかに出かけましたか。」", 
      options: ["で", "は", "を", "に"], 
      answer: 2, 
      textTranslation: "山下：「田中先生，昨天有去哪裡嗎？」",
      explanation: "提示主題用「は」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-4", 
      question: "A「つぎのかどを右 ______ まがってください。」", 
      options: ["が", "や", "か", "に"], 
      answer: 4, 
      textTranslation: "A：「請在下個轉角右轉。」",
      explanation: "「曲がります (轉彎)」的方向助詞用「に」或「へ」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-5", 
      question: "きのう、わたしはひとり ______ えいがを見に行きました。", 
      options: ["が", "を", "で", "は"], 
      answer: 3, 
      textTranslation: "昨天，我一個人去看了電影。",
      explanation: "表示狀態或人數限制用「で」。一人で (獨自一人)。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-6", 
      question: "田中さん ______ 来てください。", 
      options: ["に", "も", "や", "で"], 
      answer: 2, 
      textTranslation: "田中先生也請來。",
      explanation: "表示「也」用「も」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-7", 
      question: "このぼうしは山田さん ______ ですか。", 
      options: ["や", "は", "の", "か"], 
      answer: 3, 
      textTranslation: "這頂帽子是山田先生的嗎？",
      explanation: "表示所有格「山田先生的 (東西)」用「の」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-8", 
      question: "タクシーで 1000円 ______ です。", 
      options: ["ぐらい", "など", "ごろ", "も"], 
      answer: 1, 
      textTranslation: "搭計程車大約 1000 日圓。",
      explanation: "表示數量、金額的大約用「ぐらい」。(「ごろ」用於時間點)"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-9", 
      question: "さようなら。また ______ 。", 
      options: ["おととい", "今日", "来週", "今月"], 
      answer: 3, 
      textTranslation: "再見。下週見。",
      explanation: "道別時說「また～」，通常接未來的時間。選項中只有「来週」是未來且自然的搭配。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-10", 
      question: "母は父 ______ 5さい わかいです。", 
      options: ["から", "まで", "より", "のほうが"], 
      answer: 3, 
      textTranslation: "媽媽比爸爸年輕5歲。",
      explanation: "比較句型：A は B より (A比B...)。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-11", 
      question: "食べる ______ 手をあらいましょう。", 
      options: ["まえに", "のまえに", "あとに", "のあとに"], 
      answer: 1, 
      textTranslation: "吃之前先洗手吧。",
      explanation: "動詞辭書形 + まえに (在做...之前)。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-12", 
      question: "きょねんはあまり ______ 。", 
      options: ["ふりませんでした", "ふりません", "ふりました", "ふります"], 
      answer: 1, 
      textTranslation: "去年不太下(雪/雨)。",
      explanation: "「あまり」後面要接「否定」。因為是「去年」，所以用「過去否定 (ませんでした)」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-13", 
      question: "小さな魚がたくさん ______ よ。", 
      options: ["およぎます", "およぎません", "およぎました", "およんでいます"], 
      answer: 4, 
      textTranslation: "有很多小魚在游喔。",
      explanation: "描述眼前的狀態用「～ています」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-14", 
      question: "いえ、これは兄に ______ 。", 
      options: ["あげました", "もらいました", "うりました", "かいました"], 
      answer: 2, 
      textTranslation: "不，這是我從哥哥那裡得到的。",
      explanation: "助詞是「に」，表示來源，所以動詞用「もらいました (得到)」。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-15", 
      question: "たまごりょうりのじょうずな作りかたを ( ) 読みました。", 
      options: ["何に", "何も", "何かへ", "何かで"], 
      answer: 4, 
      textTranslation: "在某處(書/網路上)讀到了雞蛋料理的擅長作法。",
      explanation: "「何かで」表示在某個不確定的工具/媒介上。"
    },
    { 
      section: "文法 問題1 (助詞/形式)", id: "g1-16", 
      question: "北山「あ、北山花子です。すみません、 ______ 。」", 
      options: ["ひろこさんをおねがいします", "ひろこさんをください", "ひろこさんと話しますか", "ひろこさんと話しませんか"], 
      answer: 1, 
      textTranslation: "啊，我是北山花子。不好意思，麻煩請找宏子小姐。",
      explanation: "電話用語，請對方接聽用「～をお願いします」。"
    },

    // --- 文法 問題2 (重組 ★) ---
    { 
      section: "文法 問題2 (重組 ★)", id: "g2-17", 
      question: "田中「すみません。くだもの ( ) ( ) (★) ( )か」", 
      options: ["どこ", "あります", "は", "に"], 
      answer: 4, 
      textTranslation: "田中：不好意思，水果在哪裡呢？",
      explanation: "順序：くだもの [は] [どこ] [に] [あります] か。\n★的位置是「に」。"
    },
    { 
      section: "文法 問題2 (重組 ★)", id: "g2-18", 
      question: "となりのへやで ( ) ( ) (★) ( ) しています。", 
      options: ["れんしゅう", "の", "ギター", "を"], 
      answer: 1, 
      textTranslation: "在隔壁房間練習吉他。",
      explanation: "順序：[ギター] [の] [れんしゅう] [を] しています。\n★的位置是「れんしゅう」。"
    },
    { 
      section: "文法 問題2 (重組 ★)", id: "g2-19", 
      question: "会社 ( ) ( ) (★) ( ) 行っていますか。", 
      options: ["で", "は", "へ", "何"], 
      answer: 4, 
      textTranslation: "你是怎麼去公司的？",
      explanation: "順序：会社 [へ] [は] [何] [で] 行っていますか。\n★的位置是「何」。"
    },
    { 
      section: "文法 問題2 (重組 ★)", id: "g2-20", 
      question: "ここ ( ) ( ) (★) ( ) 、さいごのもんだいがむずかしいです。", 
      options: ["は", "かんたんでした", "が", "まで"], 
      answer: 2, 
      textTranslation: "雖然到這裡為止很簡單，但最後的問題很難。",
      explanation: "順序：ここ [まで] [は] [かんたんでした] [が]。\n★的位置是「かんたんでした」。"
    },
    { 
      section: "文法 問題2 (重組 ★)", id: "g2-21", 
      question: "わたしはもう少し ( ) ( ) (★) ( ) がいいです。", 
      options: ["本", "かんたんな", "が", "日本語"], 
      answer: 2, 
      textTranslation: "我想要稍微簡單一點的日文書。",
      explanation: "順序：もう少し [かんたんな] [日本語] [の] [本] がいいです。\n★的位置是「かんたんな」。"
    },

    // --- 讀解 ---
    { 
      section: "読解 問題3 (填空)", id: "r3-22", 
      question: "日本に [ 22 ] いろいろな店で食べました。", 
      options: ["行くから", "行ってから", "来るから", "来てから"], 
      answer: 4, 
      textTranslation: "來到日本之後，在各種店吃過。",
      explanation: "文章作者現在已經在日本了，所以用「来てから (來了之後)」。"
    },
    // ... (讀解部分略過翻譯，以保持篇幅，如需詳細可再補充)
  ]
};

// 2. 聽解 (聽力)
export const exam2010_listening: ExamPaper = {
  id: "2010-n5-listening",
  title: "2010-2011 N5 聴解",
  type: "listening",
  questions: [
    { 
      section: "聴解 問題1", id: "l1-1", 
      question: "女の人は、どの靴下を買いますか。", 
      options: ["1 (長+果物)", "2 (長+動物)", "3 (短+果物)", "4 (短+動物)"], 
      answer: 2, 
      textTranslation: "女生要買哪雙襪子？",
      script: "女: 子供の靴下、ありますか。\n男: はい。長いのですか、短いのですか。\n女: 長いのです。\n男: はい。果物の絵と動物の絵があります、どちらがいいですか。\n女: そうですね。動物のをください。",
      explanation: "關鍵詞：長い (長的) + 動物 (動物)。所以選長且有動物圖案的。"
    },
    { 
      section: "聴解 問題1", id: "l1-2", 
      question: "女の人は、一日に何回くすりを飲みますか。", 
      options: ["1回", "2回", "3回", "4回"], 
      answer: 2, 
      textTranslation: "女生一天要吃幾次藥？",
      script: "男: このくすりは、朝と夜、ご飯を食べたあとで飲んでください。\n女: 昼ご飯のあとは?\n男: 昼は飲まないでください。\n女: はい。",
      explanation: "醫生說「朝と夜 (早和晚)」，並且說「昼は飲まない (中午不要吃)」。所以是 2 次。"
    },
    // ... 其他聽力題
  ]
};