const { GraphQLScalarType } = require('graphql')

const Query = require('./Query')
const Mutation = require('./Mutation')
const Subscription = require('./Subscription')

const resolvers = {
  Query,
  // postPhotoミューテーションと対応するリゾルバ
  Mutation,
  Subscription,
  Photo: {
    id: parent => parent.id || parent._id,
    url: parent => `http://yoursite.com/img/${parent._id}.jpg`,
    postedBy: (parent, args, { db }) => 
      db.collection('users').findOne({ githubLogin: parent.userID }),
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

module.exports = resolvers