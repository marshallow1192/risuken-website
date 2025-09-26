const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer'); // multerを読み込む

const app = express();
const port = 3000;

app.use(cors());
// JSONデータとURLエンコードされたデータを受け取る設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ▼▼▼ multerの設定 ▼▼▼
const storage = multer.diskStorage({
  // ファイルの保存先を指定
  destination: function (req, file, cb) {
    cb(null, '../img/'); // ルートのuploadsフォルダを指定
  },
  // ファイル名を指定 (ファイル名の重複を防ぐため、タイムスタンプを付与)
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
// ▲▲▲ multerの設定 ▲▲▲

// ▼▼▼ uploadsフォルダを静的ファイルとして配信する設定 ▼▼▼
// これにより http://localhost:3000/uploads/画像ファイル名 でアクセスできる
app.use('/img', express.static(path.join(__dirname, '..', 'img')));


// ▼▼▼ POSTリクエストのルートを修正 ▼▼▼
// upload.single('image') ミドルウェアを追加
app.post('/api/posts', upload.single('image'), (req, res) => {
  console.log('受け取ったテキストデータ:', req.body);
  console.log('受け取ったファイル:', req.file);

  // 1. 新しい投稿データをテキスト部分から取得
  const newPost = req.body;
  
  // 2. アップロードされた画像のパスを追加
  if (req.file) {
    newPost.image = `/img/${req.file.filename}`;
  } else {
    newPost.image = 'activity-default.jpg'; // 画像がない場合のデフォルト
  }
  
  const dataPath = path.join(__dirname, '..', 'info.json');

  try {
    const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    currentData.unshift(newPost); // 新しい投稿を配列の先頭に追加
    const newJsonData = JSON.stringify(currentData, null, 2);
    fs.writeFileSync(dataPath, newJsonData, 'utf8');

    res.status(200).json({ message: '投稿が成功しました！' });
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ message: 'サーバーでエラーが発生しました。' });
  }
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});