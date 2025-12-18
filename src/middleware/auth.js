import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  })
}

export async function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    if (!token) return res.status(401).json({ message: 'Missing token' })

    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    next()
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
