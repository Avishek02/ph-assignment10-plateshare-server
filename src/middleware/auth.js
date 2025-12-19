import admin from 'firebase-admin'
import fs from 'fs'

function loadServiceAccount() {
  const raw = process.env.FIREBASE_ADMIN
  if (raw && raw.trim()) return JSON.parse(raw)

  if (fs.existsSync('./firebase-admin.json')) {
    return JSON.parse(fs.readFileSync('./firebase-admin.json', 'utf8'))
  }

  throw new Error('Missing Firebase admin credentials')
}

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount()
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
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
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
