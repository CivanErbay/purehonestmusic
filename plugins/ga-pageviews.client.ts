type GTag = (...args: any[]) => void
type WinWithGtag = Window & { gtag?: GTag }

let lastPath: string | null = null

export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router

  router.afterEach((to, from) => {
    if (typeof window === 'undefined') return
    const w = window as WinWithGtag
    if (!w.gtag) return

    // optional: doppelte Pageviews vermeiden
    if (to.path === lastPath) return
    lastPath = to.path

    w.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: location.href,
      page_path: to.path // <— nur Pfad, ohne Query/Hash
    })
  })
})