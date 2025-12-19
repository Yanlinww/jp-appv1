// src/basicNumbers.ts

export interface NumberItem {
  label: string; 
  reading: string; 
}

export interface NumberCategory {
  title: string; 
  items: NumberItem[];
}

export const basicNumberList: NumberCategory[] = [
  // --- 1. 數字基礎 (最優先) ---
  {
    title: "基礎數字 (0-10)",
    items: [
      { label: "0", reading: "ゼロ、れい" },
      { label: "1", reading: "いち" },
      { label: "2", reading: "に" },
      { label: "3", reading: "さん" },
      { label: "4", reading: "よん、し" },
      { label: "5", reading: "ご" },
      { label: "6", reading: "ろく" },
      { label: "7", reading: "なな、しち" },
      { label: "8", reading: "はち" },
      { label: "9", reading: "きゅう、く" },
      { label: "10", reading: "じゅう" },
    ]
  },
  {
    title: "基礎數字 (11-90)",
    items: [
      { label: "11", reading: "じゅういち" },
      { label: "12", reading: "じゅうに" },
      { label: "20", reading: "にじゅう" },
      { label: "30", reading: "さんじゅう" },
      { label: "40", reading: "よんじゅう" },
      { label: "50", reading: "ごじゅう" },
      { label: "60", reading: "ろくじゅう" },
      { label: "70", reading: "ななじゅう" },
      { label: "80", reading: "はちじゅう" },
      { label: "90", reading: "きゅうじゅう" },
    ]
  },
  {
    title: "百位數",
    items: [
      { label: "100", reading: "ひゃく" },
      { label: "200", reading: "にひゃく" },
      { label: "300", reading: "さんびゃく" },
      { label: "400", reading: "よんひゃく" },
      { label: "500", reading: "ごひゃく" },
      { label: "600", reading: "ろっぴゃく" },
      { label: "700", reading: "ななひゃく" },
      { label: "800", reading: "はっぴゃく" },
      { label: "900", reading: "きゅうひゃく" },
    ]
  },
  {
    title: "千 / 萬 / 億",
    items: [
      { label: "1000", reading: "せん" },
      { label: "3000", reading: "さんぜん" },
      { label: "8000", reading: "はっせん" },
      { label: "1萬", reading: "いちまん" },
      { label: "10萬", reading: "じゅうまん" },
      { label: "100萬", reading: "ひゃくまん" },
      { label: "1000萬", reading: "せんまん" },
      { label: "1億", reading: "いちおく" },
    ]
  },

  // --- 2. 生活必備：金錢 ---
  {
    title: "金錢 (円)",
    items: [
      { label: "1円", reading: "いちえん" },
      { label: "5円", reading: "ごえん" },
      { label: "10円", reading: "じゅうえん" },
      { label: "50円", reading: "ごじゅうえん" },
      { label: "100円", reading: "ひゃくえん" },
      { label: "500円", reading: "ごひゃくえん" },
      { label: "1000円", reading: "せんえん" },
      { label: "5000円", reading: "ごせんえん" },
      { label: "10000円", reading: "いちまんえん" },
      { label: "いくら", reading: "いくら (多少錢)" },
    ]
  },

  // --- 3. 生活必備：時間與日期 ---
  {
    title: "時間 (時)",
    items: [
      { label: "1時", reading: "いちじ" },
      { label: "2時", reading: "にじ" },
      { label: "3時", reading: "さんじ" },
      { label: "4時", reading: "よじ (注意)" },
      { label: "5時", reading: "ごじ" },
      { label: "6時", reading: "ろくじ" },
      { label: "7時", reading: "しちじ (注意)" },
      { label: "8時", reading: "はちじ" },
      { label: "9時", reading: "くじ (注意)" },
      { label: "10時", reading: "じゅうじ" },
      { label: "11時", reading: "じゅういちじ" },
      { label: "12時", reading: "じゅうにじ" },
      { label: "何時", reading: "なんじ" },
    ]
  },
  {
    title: "時間 (分)",
    items: [
      { label: "1分", reading: "いっぷん" },
      { label: "2分", reading: "にふん" },
      { label: "3分", reading: "さんぷん" },
      { label: "4分", reading: "よんぷん" },
      { label: "5分", reading: "ごふん" },
      { label: "6分", reading: "ろっぷん" },
      { label: "7分", reading: "ななふん" },
      { label: "8分", reading: "はっぷん" },
      { label: "9分", reading: "きゅうふん" },
      { label: "10分", reading: "じゅっぷん" },
      { label: "15分", reading: "じゅうごふん" },
      { label: "30分", reading: "はん (半)" },
      { label: "何分", reading: "なんぷん" },
    ]
  },
  {
    title: "星期 (曜日)",
    items: [
      { label: "星期一", reading: "げつようび" },
      { label: "星期二", reading: "かようび" },
      { label: "星期三", reading: "すいようび" },
      { label: "星期四", reading: "もくようび" },
      { label: "星期五", reading: "きんようび" },
      { label: "星期六", reading: "どようび" },
      { label: "星期日", reading: "にちようび" },
      { label: "星期幾", reading: "なんようび" },
    ]
  },
  {
    title: "月份 (月)",
    items: [
      { label: "1月", reading: "いちがつ" },
      { label: "2月", reading: "にがつ" },
      { label: "3月", reading: "さんがつ" },
      { label: "4月", reading: "しがつ (注意)" },
      { label: "5月", reading: "ごがつ" },
      { label: "6月", reading: "ろくがつ" },
      { label: "7月", reading: "しちがつ (注意)" },
      { label: "8月", reading: "はちがつ" },
      { label: "9月", reading: "くがつ (注意)" },
      { label: "10月", reading: "じゅうがつ" },
      { label: "11月", reading: "じゅういちがつ" },
      { label: "12月", reading: "じゅうにがつ" },
      { label: "何月", reading: "なんがつ" },
    ]
  },
  {
    title: "日期 (日)",
    items: [
      { label: "1日", reading: "ついたち" },
      { label: "2日", reading: "ふつか" },
      { label: "3日", reading: "みっか" },
      { label: "4日", reading: "よっか" },
      { label: "5日", reading: "いつか" },
      { label: "6日", reading: "むいか" },
      { label: "7日", reading: "なのか" },
      { label: "8日", reading: "ようか" },
      { label: "9日", reading: "ここのか" },
      { label: "10日", reading: "とおか" },
      { label: "14日", reading: "じゅうよっか" },
      { label: "20日", reading: "はつか" },
      { label: "24日", reading: "にじゅうよっか" },
      { label: "何日", reading: "なんにち" },
    ]
  },
  {
    title: "期間 (週間)",
    items: [
      { label: "1週間", reading: "いっしゅうかん" },
      { label: "2週間", reading: "にしゅうかん" },
      { label: "3週間", reading: "さんしゅうかん" },
      { label: "4週間", reading: "よんしゅうかん" },
      { label: "8週間", reading: "はっしゅうかん" },
      { label: "10週間", reading: "じゅっしゅうかん" },
      { label: "何週間", reading: "なんしゅうかん" },
    ]
  },

  // --- 4. 常用量詞 (人、個、歲、回) ---
  {
    title: "人 (人)",
    items: [
      { label: "1人", reading: "ひとり" },
      { label: "2人", reading: "ふたり" },
      { label: "3人", reading: "さんにん" },
      { label: "4人", reading: "よにん (注意)" },
      { label: "5人", reading: "ごにん" },
      { label: "6人", reading: "ろくにん" },
      { label: "7人", reading: "ななにん、しちにん" },
      { label: "8人", reading: "はちにん" },
      { label: "9人", reading: "きゅうにん" },
      { label: "10人", reading: "じゅうにん" },
      { label: "何人", reading: "なんにん" },
    ]
  },
  {
    title: "通用物品 (つ)",
    items: [
      { label: "1つ", reading: "ひとつ" },
      { label: "2つ", reading: "ふたつ" },
      { label: "3つ", reading: "みっつ" },
      { label: "4つ", reading: "よっつ" },
      { label: "5つ", reading: "いつつ" },
      { label: "6つ", reading: "むっつ" },
      { label: "7つ", reading: "ななつ" },
      { label: "8つ", reading: "やっつ" },
      { label: "9つ", reading: "ここのつ" },
      { label: "10", reading: "とお" },
      { label: "いくつ", reading: "いくつ (多少個)" },
    ]
  },
  {
    title: "小物 (個)",
    items: [
      { label: "1個", reading: "いっこ" },
      { label: "6個", reading: "ろっこ" },
      { label: "8個", reading: "はっこ" },
      { label: "10個", reading: "じゅっこ" },
      { label: "何個", reading: "なんこ" },
    ]
  },
  {
    title: "年齡 (歲)",
    items: [
      { label: "1歲", reading: "いっさい" },
      { label: "8歲", reading: "はっさい" },
      { label: "10歲", reading: "じゅっさい" },
      { label: "20歲", reading: "はたち (注意)" },
      { label: "何歲", reading: "なんさい" },
    ]
  },
  {
    title: "頻率/次數 (回)",
    items: [
      { label: "1回", reading: "いっかい" },
      { label: "6回", reading: "ろっかい" },
      { label: "8回", reading: "はっかい" },
      { label: "10回", reading: "じゅっかい" },
      { label: "何回", reading: "なんかい" },
    ]
  },

  // --- 5. 特定物品量詞 ---
  {
    title: "細長物 (本)",
    items: [
      { label: "1本", reading: "いっぽん" },
      { label: "2本", reading: "にほん" },
      { label: "3本", reading: "さんぼん (濁音)" },
      { label: "6本", reading: "ろっぽん" },
      { label: "8本", reading: "はっぽん" },
      { label: "10本", reading: "じゅっぽん" },
      { label: "何本", reading: "なんぼん" },
    ]
  },
  {
    title: "扁平物 (枚)",
    items: [
      { label: "1枚", reading: "いちまい" },
      { label: "2枚", reading: "にまい" },
      { label: "何枚", reading: "なんまい" },
    ]
  },
  {
    title: "書本 (冊)",
    items: [
      { label: "1冊", reading: "いっさつ" },
      { label: "8冊", reading: "はっさつ" },
      { label: "10冊", reading: "じゅっさつ" },
      { label: "何冊", reading: "なんさつ" },
    ]
  },
  {
    title: "機器車輛 (台)",
    items: [
      { label: "1台", reading: "いちだい" },
      { label: "2台", reading: "にだい" },
      { label: "何台", reading: "なんだい" },
    ]
  },
  {
    title: "動物 (匹)",
    items: [
      { label: "1匹", reading: "いっぴき" },
      { label: "3匹", reading: "さんびき" },
      { label: "6匹", reading: "ろっぴき" },
      { label: "8匹", reading: "はっぴき" },
      { label: "10匹", reading: "じゅっぴき" },
      { label: "何匹", reading: "なんびき" },
    ]
  },
  {
    title: "杯裝飲料 (杯)",
    items: [
      { label: "1杯", reading: "いっぱい" },
      { label: "3杯", reading: "さんばい" },
      { label: "6杯", reading: "ろっぱい" },
      { label: "8杯", reading: "はっぱい" },
      { label: "10杯", reading: "じゅっぱい" },
      { label: "何杯", reading: "なんばい" },
    ]
  },
  {
    title: "服裝 (着)",
    items: [
      { label: "1着", reading: "いっちゃく" },
      { label: "8着", reading: "はっちゃく" },
      { label: "10着", reading: "じゅっちゃく" },
      { label: "何着", reading: "なんちゃく" },
    ]
  },
  {
    title: "鞋襪 (足)",
    items: [
      { label: "1足", reading: "いっそく" },
      { label: "3足", reading: "さんぞく" },
      { label: "8足", reading: "はっそく" },
      { label: "10足", reading: "じゅっそく" },
      { label: "何足", reading: "なんぞく" },
    ]
  },
  {
    title: "樓層 (階)",
    items: [
      { label: "1階", reading: "いっかい" },
      { label: "3階", reading: "さんがい" },
      { label: "6階", reading: "ろっかい" },
      { label: "8階", reading: "はっかい" },
      { label: "10階", reading: "じゅっかい" },
      { label: "何階", reading: "なんがい" },
    ]
  },
  {
    title: "房屋 (軒)",
    items: [
      { label: "1軒", reading: "いっけん" },
      { label: "3軒", reading: "さんげん" },
      { label: "6軒", reading: "ろっけん" },
      { label: "8軒", reading: "はっけん" },
      { label: "10軒", reading: "じゅっけん" },
      { label: "何軒", reading: "なんげん" },
    ]
  },
  {
    title: "順序 (番)",
    items: [
      { label: "1番", reading: "いちばん" },
      { label: "何番", reading: "なんばん" },
    ]
  },
  {
    title: "小數與分數",
    items: [
      { label: "17.5", reading: "じゅうななてんご" },
      { label: "0.83", reading: "れいてんはちさん" },
      { label: "1/2", reading: "にぶんのいち" },
      { label: "3/4", reading: "よんぶんのさん" },
    ]
  },
];