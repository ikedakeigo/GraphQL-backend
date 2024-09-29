const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils");

// userの新規登録のリゾルバ
async function signup(parent, args, context) {
  // パスワードの設定
  const password = await bcrypt.hash(args.password, 10);

  // ユーザーの新規登録
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  // 作成したユーザーをさらに暗号化する
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 戻り値はschema.graphqlで定義したsignupの値 AuthPayloadで定義したuser,tokenとする。
  return {
    token,
    user,
  };
}

// ユーザー ログイン
async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("そのようなユーザーは存在しません。");
  }

  // パスワードの比較
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("無効なパスワードです。");
  }

  //パスワードが正しい場合
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

module.exports = {
  signup,
  login,
  post,
};
