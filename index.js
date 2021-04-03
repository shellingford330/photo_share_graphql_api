// appllo-serverモジュールを読み込む
const { ApolloServer } = require('apollo-server')
const { GraphQLScalarType } = require('graphql')

const typeDefs = `
  scalar DateTime
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
    created: DateTime!
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
    "githubUser": "gPlake",
    "created": "3-28-1977"
  },
  {
    "id": "2",
    "name": "Dropping the Heeart Chete2",
    "description": "The heart chete is one of my favorite chetes2",
    "category": "PORTRAIT",
    "githubUser": "sHattrup",
    "created": "1-2-1985"
  },
  {
    "id": "3",
    "name": "Dropping the Heeart Chete3",
    "description": "The heart chete is one of my favorite chetes3",
    "category": "SELECT",
    "githubUser": "sHattrup",
    "created": "2018-04-15T19:09:57.308Z"
  }
]

var tags = [
  { "photoID": "1", "userID": "gPlake" },
  { "photoID": "2", "userID": "sHattrup" },
  { "photoID": "2", "userID": "mHattrup" },
  { "photoID": "2", "userID": "gPlake" },
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
        ...args.input,
        created: new Date()
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => {
      return tags.filter(tag => tag.photoID === parent.id)
        .map(tag => tag.userID)
        .map(userID => users.find(user => user.githubLogin === userID))
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => {
      return tags.filter(tag => tag.userID === parent.githubLogin)
        .map(tag => tag.photoID)
        .map(photoID => photos.find(photo => photo.id === photoID))
    }
  },
  DateTime: new GraphQLScalarType({
    name: `DateTime`,
    description: `A valid date time value.`,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
}

// サーバーのインスタンスを作成
// その際、typeDefs(スキーマ)とリゾルバを引数に取る
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Webサーバーを起動
server.listen().then(({url}) => console.log(`GrapgQL Service running on ${url}`))