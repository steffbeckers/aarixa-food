import Vue from 'vue'
import Router from 'vue-router'

// Administration
import AdminUserModels from '@/admin/UserModels'

// Pages
import Orders from '@/pages/Orders'
import Suppliers from '@/pages/Suppliers'
import SupplierDetail from '@/pages/SupplierDetail'

// Errors
import PageNotFound from '@/errors/PageNotFound'

Vue.use(Router)

export default new Router({
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
