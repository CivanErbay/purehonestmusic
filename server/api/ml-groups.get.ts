// server/api/ml-groups.get.ts
import { defineEventHandler, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  if (!process.env.MAILERLITE_API_KEY) {
    setResponseStatus(event, 500)
    return { ok: false, message: 'MAILERLITE_API_KEY fehlt' }
  }

  try {
    const res: any = await $fetch('https://connect.mailerlite.com/api/groups?limit=200', {
      headers: {
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        Accept: 'application/json',
      },
    })

    const groups = Array.isArray(res?.data)
      ? res.data.map((g: any) => ({ id: String(g?.id), name: String(g?.name || '') }))
      : []

    return { ok: true, groups }
  } catch (e: any) {
    const status = e?.response?.status || 500
    setResponseStatus(event, status)
    return { ok: false, message: e?.data?.message || 'Lookup fehlgeschlagen', status }
  }
})
