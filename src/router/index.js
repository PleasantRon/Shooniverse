import { createRouter, createWebHistory } from 'vue-router'
import { cart } from '../store.js'
import { routes as defaultRoutes } from './routes.js'
import { checkoutGuard, routeTitle, scrollBehavior } from './guards.js'

// Factory so tests can pass a memory history and stub components.
export function createAppRouter({
  history = createWebHistory(),
  routes = defaultRoutes,
  cartStore = cart
} = {}) {
  const router = createRouter({
    history,
    routes,
    // Restore position on back/forward, scroll to #sections, otherwise start at the top.
    scrollBehavior
  })

  router.beforeEach((to) => checkoutGuard(to, cartStore))

  router.afterEach((to) => {
    if (typeof document !== 'undefined') document.title = routeTitle(to)
  })

  return router
}
