<template>
  <div class="product__counter form__counter">
    <button type="button" aria-label="Убрать один товар" @click="deleteOne">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" name="count" :value="amount" @input="updateInput($event.target.value)" />

    <button type="button" aria-label="Добавить один товар" @click="addOne">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ['product'],

  data() {
    return {
      amount: 1,
    };
  },

  methods: {
    updateInput(value) {
      this.$emit('updateInput', value);
    },

    deleteOne() {
      this.updateInput(--this.amount);
    },

    addOne() {
      this.updateInput(++this.amount);
    },
  },
};
</script>
