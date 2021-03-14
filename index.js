// appllo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server')

const typeDefs = `
  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  enum PhotoCategory {
    SELECT
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`

// 写真を格納するための配列を定義する
var users = [
  { "githubLogin": "mHattrup", "name": "Mike Hattrrup" },
  { "githubLogin": "gPlake", "name": "Glen Plake" },
  { "githubLogin": "sHattrup", "name": "Scot Hattrrup" },
]

var _id = 4
var photos = [
  {
    "id": "1",
    "name": "Dropping the Heeart Chete",
    "description": "The heart chete is one of my favorite chetes",
    "category": "ACTION",
    "githubUser": "gPlake"
  },
  {
    "id": "2",
    "name": "Dropping the Heeart Chete2",
    "description": "The heart chete is one of my favorite chetes2",
    "category": "PORTRAIT",
    "githubUser": "sHattrup"
  },
  {
    "id": "3",
    "name": "Dropping the Heeart Chete3",
    "description": "The heart chete is one of my favorite chetes3",
    "category": "SELECT",
    "githubUser": "sHattrup"
  }
]

var tags = [
  
]

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },
  // postPhotoミューテーションと対応するリゾルバ
  Mutation: {
    postPhoto(_, args) {
      var newPhoto = {
        id: _id++,
        ...args.input
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    }
  }
}

// サーバーのインスタンスを作成
// その際、typeDefs(スキーマ)とリゾルバを引数に取る
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Webサーバーを起動
server.listen().then(({url}) => console.log(`GrapgQL Service running on ${url}`))