const admin = require('firebase-admin')
const { connectToFirestore } = require('./firestore')

exports.getAffirmations = (req, res) => {
  const db = connectToFirestore()
  db.collection('affirmations').get()
    .then(collection => {
      const affirmationList = collection.docs.map(doc => doc.data())
      res.send(affirmationList)
    })
    .catch(err => res.status(500).send('Error getting affirmations' + err.message))
}

// if we're missing any of them it will say 'Invalid request' 
exports.postAffirmations = (req, res) => {
  if (!req.body || !req.body.text || !req.body.displayName || !req.body.photoUrl) {
    res.status(400).send('Invalid request')
  }
  const db = connectToFirestore()
  const { uid, text, displayName, photoUrl } = req.body
  const now = admin.firestore.FieldValue.serverTimestamp()
  const newAffirmation = {
    uid,
    created_at: now,
    text,
    displayName,
    photoUrl
  }
  db.collection('affirmations').add(newAffirmation)
    .then(() => {
      this.getAffirmations(req, res) // pass response to get all affirmations
    })
    .catch(err => res.status(500).send('Error posting affrimation' + err.message))
}