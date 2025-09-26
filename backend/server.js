const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

//jsonデータを受け取るための設定
app.use(express.json())