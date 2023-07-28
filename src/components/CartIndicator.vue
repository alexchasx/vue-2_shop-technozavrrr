<template>
  <div>
    <router-link class="header__cart" aria-label="Корзина с товарами" :to="{ name: 'cart' }">
      <svg width="30" height="21" fill="currentColor">
        <use xlink:href="#icon-cart"></use>
      </svg>

      <span class="header__count" aria-label="Количество товаров" v-if="productSending">
        <img
          class="spinner"
          width="8px"
          src="@/assets/Spinner-3.gif"
          alt="Загрузка количества товаров ..."
        />
      </span>
      <span class="header__count" aria-label="Количество товаров" v-else>
        {{ countProducts }}
      </span>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['productSending'],

  computed: {
    ...mapGetters({
      countProducts: 'cartCountProducts',
    }),
  },
};
</script>
