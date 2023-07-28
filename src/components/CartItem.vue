<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" alt="item.product.title" />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <span class="product__code"> Артикул: {{ item.productId }} </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click="--amount">
        <svg width="12" height="12" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" name="count" v-model="amount" />

      <button type="button" aria-label="Добавить один товар" @click="++amount">
        <svg width="12" height="12" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price"> {{ itemPrice | numberFormat }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click="deleteProduct(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import normalizePrice from '@/helpers/normalizePrice';
import { mapActions } from 'vuex';

export default {
  filters: { numberFormat },

  props: ['item'],

  computed: {
    itemPrice() {
      return normalizePrice(this.item.amount * this.item.product.price);
    },

    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {
          productId: this.item.productId,
          amount: value,
        });
      },
    },
  },

  methods: {
    ...mapActions({
      deleteProduct: 'deleteProductFromCart',
    }),
  },
};
</script>
