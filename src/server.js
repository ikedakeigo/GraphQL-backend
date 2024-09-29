const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
// リゾルバ関係のファイル
const Query = require("./resolvers/Query");
const Link = require("./resolvers/Link");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");

const prisma = new PrismaClient();

// リゾルバ関数
const resolvers = {
  Query,
  Link,
  Mutation,
  User,
};

console.log("-------------うんこ-----------------")
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中・・・・`));
