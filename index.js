// appllo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')

const { MongoClient } = require('mongodb')
require('dotenv').config()

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers')

async function start() {
  // Express アプリケエーションを作成する
  var app = express()

  const MONGO_DB = process.env.DB_HOST

  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true }
  )
  const db = client.db()

  const context = { db }

  // サーバーのインスタンスを作成
  // その際、typeDefs(スキーマ)とリゾルバを引数に取る
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  })

  // Express にミドルウェアを追加する
  server.applyMiddleware({ app })

  // ホームルートを作成する
  app.get('/', (_, res) => res.end('Welcome to the PhotoShare API'))
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  // 特定のポートでリッスンする
  app.listen({ port: 4000 }, () => console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`))
}

start()
