// 必要なライブラリを読み込む
const fs = require('fs'); // ファイル操作のためのライブラリ
const ejs = require('ejs'); // EJSライブラリ

console.log('HTMLファイルの生成を開始します...');

// 1. データのJSONファイルを読み込む
const data = JSON.parse(fs.readFileSync('info.json', 'utf8'));

// 2. テンプレートファイルを読み込む
const template = fs.readFileSync('articleTemplate.ejs', 'utf8');

// 3. データをもとにループ処理でHTMLファイルを一枚ずつ生成
data.forEach(item => {
  // EJSを使ってテンプレートにデータを流し込む
  const renderedHtml = ejs.render(template, item);

  // 出力するファイルパスを指定 (例: report1.html)
  const outputFilePath = item.link;

  // HTMLファイルとして書き出す
  fs.writeFileSync(outputFilePath, renderedHtml, 'utf8');

  console.log(`${outputFilePath} を生成しました。`);
});

console.log('HTMLファイルの生成が完了しました！');