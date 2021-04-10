module.exports = {
  totalPhotos: (_, args, { db }) => {
    return db.collection('photos').estimatedDocumentCount()
  },
  allPhotos: (_, args, { db }) => {
    return db.collection('photos').find().toArray()
  },
  totalUsers: (_, args, { db }) => {
    return db.collection('users').estimatedDocumentCount()
  },
  allUsers: (_, args, { db }) => {
    return db.collection('users').find().toArray()
  },
  me: (parent, args, { currentUser }) => currentUser
}