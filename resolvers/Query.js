module.exports = {
  totalPhotos: (_, _, { db }) => {
    return db.collection('photos').estimatedDocumentCount()
  },
  allPhotos: (_, _, { db }) => {
    return db.collection('photos').find().toArray()
  },
  totalUsers: (_, _, { db }) => {
    return db.collection('users').estimatedDocumentCount()
  },
  allUsers: (_, _, { db }) => {
    return db.collection('users').find().toArray()
  },
}