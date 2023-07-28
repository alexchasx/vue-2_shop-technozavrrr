import Vue from 'vue';
import VueRouter from 'vue-router';

import MainPage from '@/pages/MainPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import OrderPage from '@/pages/OrderPage';
import OrderInfoPage from '@/pages/OrderInfoPage';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductPage,
    },
    {
      path: '/cart/',
      name: 'cart',
      component: CartPage,
    },
    {
      path: '/order/',
      name: 'order',
      component: OrderPage,
    },
    {
      path: '/order/:id',
      name: 'orderInfo',
      component: OrderInfoPage,
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFoundPage,
    },
  ],
});
