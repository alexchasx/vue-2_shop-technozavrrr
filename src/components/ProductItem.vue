<template>
  <article class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :src="product.image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat }} ₽ </span>

    <ul class="colors colors--black" v-if="product.colors.length">
      <li class="colors__item" v-for="color in product.colors" :key="color.id">
        <label class="colors__label" :title="color.title">
          <input class="colors__radio sr-only" type="radio" :value="color.code" />
          <span class="colors__value" :style="{ backgroundColor: color.code }"> </span>
        </label>
      </li>
    </ul>
  </article>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';

export default {
  filters: { numberFormat },

  props: ['product'],

  methods: {
    gotoPage,
  },
};
</script>
