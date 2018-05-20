import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Orders from '@/pages/Orders'
import Suppliers from '@/pages/Suppliers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Bestellingen',
      component: Orders
    },
    {
      path: '/suppliers',
      name: 'Leveranciers',
      component: Suppliers
    }
  ]
})
