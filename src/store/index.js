import Vue from 'vue';
import Vuex from 'vuex';
import normalizePrice from '@/helpers/normalizePrice';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // формат: [{productId: 1, amont: 2}, {productId: 2, amont: 2}]
    cartProducts: [],

    userAccessKey: null,

    cartProductsData: [],

    orderInfo: null,
  },

  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },

    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },

    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((item) => item.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },

    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },

    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },

    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },

    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => {
        return {
          productId: item.product.id,
          amount: item.quantity,
        };
      });
    },
  },

  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find((p) => p.product.id === item.productId).product;
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },

    cartTotalPrice(state, getters) {
      const price = getters.cartDetailProducts.reduce(
        (acc, item) => item.product.price * item.amount + acc,
        0
      );
      return normalizePrice(price);
    },

    cartCountProducts(state) {
      return state.cartProducts.length;
    },
  },

  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(API_BASE_URL + '/api/orders/' + orderId, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((res) => {
          context.commit('updateOrderInfo', res.data);
        });
    },

    loadCart(context) {
      return axios
        .get(API_BASE_URL + '/api/baskets', {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((res) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', res.data.user.accessKey);
            context.commit('updateUserAccessKey', res.data.user.accessKey);
          }
          context.commit('updateCartProductsData', res.data.items);
          context.commit('syncCartProducts');
        });
    },

    addProductToCart(context, { productId, amount }) {
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        return axios
          .post(
            API_BASE_URL + '/api/baskets/products',
            {
              productId: productId,
              quantity: amount,
            },
            {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            }
          )
          .then((res) => {
            context.commit('updateCartProductsData', res.data.items);
            context.commit('syncCartProducts');
          });
      });
    },

    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });

      if (amount < 1) {
        return;
      }

      return axios
        .put(
          API_BASE_URL + '/api/baskets/products',
          {
            productId: productId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((res) => {
          context.commit('updateCartProductsData', res.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },

    deleteProductFromCart(context, productId) {
      return axios
        .delete(API_BASE_URL + '/api/baskets/products', {
          params: { userAccessKey: context.state.userAccessKey },
          data: { productId },
        })
        .then((res) => {
          context.commit('deleteCartProduct', productId);
        });
    },
  },
});
