const jwt = require("jsonwebtoken");
APP_SECRET = "GraphQL-aw2some";

// トークンを複合する関数
function getTokenPayload(token) {
  // トークン化された者の前の情報(user.id)を複合する
  return jwt.verify(token, APP_SECRET);
}

// ゆーざーIDを取得するための関数
function getUserId(req, authToken) {
  if (req) {
    console.log("---------確認中");
    // ヘッダーを確認する。認証権限を確認する。
    const authHeader = req.headers.authorization; // authorization 承認
    // 権限があるなら
    if (authHeader) {
      const token = authHeader.replace("Bearer", "");
      if (!token) {
        throw new Error("トークンが見つかりませんでした。");
      }
      // トークンを複合する
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません。");
}

module.exports = {
  APP_SECRET,
  getUserId,
  getTokenPayload,
};
