// Route table. Kept free of vue-router imports so it can be tested in plain Node.
// Page components are lazy-loaded so each screen becomes its own bundle.

export const ROUTE_NAMES = {
  HOME: 'home',
  SHOP: 'shop',
  PRODUCT: 'product',
  CART: 'cart',
  CHECKOUT: 'checkout',
  NOT_FOUND: 'not-found'
}

export const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: () => import('../views/HomeView.vue'),
    meta: { title: null } // home uses the plain brand title
  },
  {
    path: '/shop',
    name: ROUTE_NAMES.SHOP,
    component: () => import('../views/ShopView.vue'),
    meta: { title: 'Shop' }
  },
  {
    path: '/product/:slug',
    name: ROUTE_NAMES.PRODUCT,
    component: () => import('../views/ProductView.vue'),
    props: true, // the slug is passed to ProductView as a prop
    meta: { title: 'Product' }
  },
  {
    path: '/cart',
    name: ROUTE_NAMES.CART,
    component: () => import('../components/Cart.vue'),
    meta: { title: 'Cart' }
  },
  {
    path: '/checkout',
    name: ROUTE_NAMES.CHECKOUT,
    component: () => import('../components/Checkout.vue'),
    meta: { title: 'Checkout', requiresItems: true }
  },
  {
    // Anything that does not match above. Must stay last.
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page not found' }
  }
]
