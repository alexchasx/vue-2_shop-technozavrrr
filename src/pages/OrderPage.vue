<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html"> Корзина </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> {{ countProducts }} товара </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              :error="formError.name"
              title="ФИО"
              placeholder="Введите ваше полное имя"
            ></BaseFormText>

            <BaseFormText
              v-model="formData.address"
              :error="formError.address"
              title="Адрес доставки"
              placeholder="Введите ваш адрес"
            ></BaseFormText>

            <BaseFormText
              v-model="formData.phone"
              :error="formError.phone"
              title="Телефон"
              type="tel"
              placeholder="Введите ваш телефон"
            ></BaseFormText>

            <BaseFormText
              v-model="formData.email"
              :error="formError.email"
              title="Email"
              type="email"
              placeholder="Введите ваш Email"
            ></BaseFormText>

            <BaseFormTextarea
              v-model="formData.comment"
              :error="formError.comment"
              title="Комментарий к заказу"
              placeholder="Ваши пожелания"
            ></BaseFormTextarea>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="0"
                    checked=""
                  />
                  <span class="options__value"> Самовывоз <b>бесплатно</b> </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="500" />
                  <span class="options__value"> Курьером <b>500 ₽</b> </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="card" />
                  <span class="options__value"> Картой при получении </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="cash" />
                  <span class="options__value"> Наличными при получении </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li v-for="item in items" :key="item.productId" class="cart__order">
              <h3>{{ item.product.title }}</h3>
              <b>{{ itemPrice(item.amount * item.product.price) | numberFormat }} ₽</b>
              <span>Артикул: {{ item.productId }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>
              Итого: <b>{{ countProducts }}</b> товара на сумму
              <b>{{ totalPrice | numberFormat }} ₽</b>
            </p>
          </div>

          <button class="cart__button button button--primery" type="submit">Оформить заказ</button>
        </div>

        <img
          class="spinner"
          src="@/assets/Spinner-3.gif"
          alt="Загрузка количества товаров ..."
          v-show="orderSending"
        />

        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>{{ formErrorMessage }}</p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import { mapGetters } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import normalizePrice from '@/helpers/normalizePrice';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  components: {
    BaseFormText,
    BaseFormTextarea,
  },

  filters: { numberFormat },

  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      orderSending: false,
    };
  },

  computed: {
    ...mapGetters({
      items: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      countProducts: 'cartCountProducts',
    }),
  },

  methods: {
    itemPrice(value) {
      return normalizePrice(value);
    },

    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.orderSending = true;

      axios
        .post(
          API_BASE_URL + '/api/orders',
          {
            ...this.formData,
          },
          {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          }
        )
        .then((res) => {
          this.orderSending = false;
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', res.data);
          this.$router.push({ name: 'orderInfo', params: { id: res.data.id } });
        })
        .catch((error) => {
          this.orderSending = false;
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        });
    },
  },
};
</script>
