export default async function r2d2Auth({ next, store }) {
  if (!store.getters['user/r2d2Token']) {
    await store.dispatch('user/authInR2D2')
  }

  if (!store.getters['user/r2d2Token']) {
    return next({ name: 'error-unexpected' })
  }

  return next()
}
