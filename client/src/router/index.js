import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Orders from '@/pages/Orders'
import Suppliers from '@/pages/Suppliers'
import SupplierDetail from '@/pages/SupplierDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/leveranciers/:slug',
      name: 'Leverancier',
      component: SupplierDetail
    },
    {
      path: '/leveranciers',
      name: 'Leveranciers',
      component: Suppliers
    },
    {
      path: '/',
      name: 'Bestellingen',
      component: Orders
    }
  ]
})
