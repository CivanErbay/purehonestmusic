// server/api/subscribe.post.ts
import { defineEventHandler, readBody, setResponseStatus } from 'h3'

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const toNumericString = (v?: string | null) => (v && /^\d+$/.test(v) ? v : null)

const rl = new Map<string, { count: number; ts: number }>()
function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now()
  const e = rl.get(key) ?? { count: 0, ts: now }
  if (now - e.ts > windowMs) { e.count = 0; e.ts = now }
  e.count++
  rl.set(key, e)
  return e.count <= limit
}

type Body = {
  email: string
  firstName?: string
  interests?: string[]
  giveawayOptIn?: boolean
  hp?: string
}

export default defineEventHandler(async (event) => {
  const isProd = process.env.NODE_ENV === 'production'

  // CSRF / Origin-Whitelist
  const origin = String(event.node.req.headers.origin || '')
  const referer = String(event.node.req.headers.referer || '')
  const ALLOWED = isProd
    ? ['https://www.purehonestmusic.com']
    : ['https://www.purehonestmusic.com','http://localhost:3000','http://localhost:3001']
  if (!ALLOWED.some(a => origin.startsWith(a) || referer.startsWith(a))) {
    setResponseStatus(event, 403)
    return { ok: false, message: isProd ? 'Forbidden' : `Origin not allowed (${origin || referer})` }
  }

  // Rate limit
  const ip =
    event.node.req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
    event.node.req.socket.remoteAddress || '0.0.0.0'
  if (!rateLimit(ip)) {
    setResponseStatus(event, 429)
    return { ok: false, message: 'Too Many Requests' }
  }

  const body = (await readBody(event)) as Body
  if (body?.hp) return { ok: true, skipped: true }

  const email = (body?.email || '').trim().toLowerCase()
  if (!isEmail(email)) { setResponseStatus(event, 422); return { ok: false, message: isProd ? 'Validation failed' : 'Ungültige E-Mail' } }

  const interests = Array.isArray(body?.interests) ? body!.interests!.filter(Boolean) : []
  if (interests.length === 0) { setResponseStatus(event, 422); return { ok: false, message: isProd ? 'Validation failed' : 'Mindestens ein Genre auswählen' } }

  // Slug -> ENV Group-ID
  const map: Record<string, string | undefined> = {
    all_genres:            process.env.MAILERLITE_GROUP_ALL_GENRES,     // ← NEU
    pop:                   process.env.MAILERLITE_GROUP_POP,
    rock:                  process.env.MAILERLITE_GROUP_ROCK,
    metal:                 process.env.MAILERLITE_GROUP_METAL,
    post_punk_hardcore:    process.env.MAILERLITE_GROUP_POST_PUNK_HARDCORE,
    alternative_indie:     process.env.MAILERLITE_GROUP_ALTERNATIVE_INDIE,
    singer_folk_acoustic:  process.env.MAILERLITE_GROUP_SINGER_FOLK_ACOUSTIC,
    hiphop_rap:            process.env.MAILERLITE_GROUP_HIPHOP_RAP,
    rnb_soul_funk:         process.env.MAILERLITE_GROUP_RNB_SOUL_FUNK,
    electronic_dance:      process.env.MAILERLITE_GROUP_ELECTRONIC_DANCE,
    jazz_blues:            process.env.MAILERLITE_GROUP_JAZZ_BLUES,
  }

  // Gruppen wählen:
  let groups: string[] = []
  if (interests.includes('all_genres')) {
    const g = toNumericString(map['all_genres'])
    if (g) groups = [g]
  } else {
    groups = interests
      .map((k) => toNumericString(map[k]))
      .filter((v): v is string => !!v)
  }

  // Gewinnspiel-Gruppe (optional) immer zusätzlich
  if (body?.giveawayOptIn && process.env.MAILERLITE_GROUP_GIVEAWAY) {
    const g = toNumericString(process.env.MAILERLITE_GROUP_GIVEAWAY)
    if (g) groups.push(g)
  }

  if (!process.env.MAILERLITE_API_KEY) { setResponseStatus(event, 500); return { ok: false, message: isProd ? 'Server error' : 'MAILERLITE_API_KEY fehlt' } }

  // Optional: vorhandene Gruppen gegen ML verifizieren (best effort)
  try {
    const grpRes = await $fetch('https://connect.mailerlite.com/api/groups?limit=200', {
      headers: { Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`, Accept: 'application/json' }
    })
    const data = (grpRes as any)?.data ?? grpRes ?? []
    const existing = new Set((Array.isArray(data) ? data : []).map((g: any) => String(g?.id)).filter(Boolean))
    groups = groups.filter((gid) => existing.has(String(gid)))
  } catch { /* ignore */ }

  const payload: any = {
    email,
    fields: { name: (body?.firstName || '').trim() },
    groups,
    ip_address: ip,
    status: 'unconfirmed'
  }

  try {
    await $fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: payload,
    })
    return { ok: true }
  } catch (e: any) {
    const status = e?.response?.status || 500
    const devMsg = e?.data?.message || e?.response?.statusText || 'MailerLite error'
    setResponseStatus(event, status)
    return isProd ? { ok: false, message: 'Subscription failed' } : { ok: false, message: devMsg, errors: e?.data?.errors, status }
  }
})
