import Vue from 'vue'
import Router from 'vue-router'

// Errors
import PageNotFound from '@/errors/PageNotFound'

// Pages
// import Orders from '@/pages/Orders'
const Orders = () => import('@/pages/Orders')
// import Suppliers from '@/pages/Suppliers'
const Suppliers = () => import('@/pages/Suppliers')
// import SupplierDetail from '@/pages/SupplierDetail'
const SupplierDetail = () => import('@/pages/SupplierDetail')
// import Kitchen from '@/pages/Kitchen'
const Kitchen = () => import('@/pages/Kitchen')
// import Fridge from '@/pages/Fridge'
const Fridge = () => import('@/pages/Fridge')

// Administration
const AdminUserModels = () => import('@/admin/UserModels')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/admin/aariXianen',
      name: 'AdminUserModels',
      component: AdminUserModels,
      meta: { requiresAdmin: true }
    },
    {
      path: '/leveranciers/:slug',
      name: 'SupplierDetail',
      component: SupplierDetail
    },
    {
      path: '/keuken/koelkast',
      name: 'Fridge',
      component: Fridge
    },
    {
      path: '/keuken',
      name: 'Kitchen',
      component: Kitchen
    },
    {
      path: '/leveranciers',
      name: 'Suppliers',
      component: Suppliers
    },
    {
      path: '/',
      name: 'Root',
      component: Orders
    },
    {
      path: '*',
      name: 'FourOhhFour',
      component: PageNotFound
    }
  ]
})
