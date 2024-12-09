<template>
  <div class="w-[28%]">
    <VueDatePicker style="color: white !important;" locale="de" cancelText="abbrechen" selectText="auswählen"
      :enable-time-picker="false" :dark="true" :format="format" v-model="date" @update:modelValue="emitDate"
      placeholder="Date">
    </VueDatePicker>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

const props = defineProps({
  open: Boolean,
  selectedDate: String,
});

const emit = defineEmits(['update:date', 'update:toggle']);

const date = ref();

const emitDate = (newDate) => {
  emit('update:date', newDate); // Emit the selected date
};
</script>

<style scoped>
.dp__theme_dark {
  --dp-background-color: rgb(47, 47, 47);
  --dp-cell-padding: 1.5rem;
  --dp-input-padding: 1.1rem;
  --dp-border-radius: 0.5rem;
  --dp-font-family: 'Josefin Sans', sans-serif;
  --dp-font-size: 18px;
  --dp-primary-color: #fff;
  --dp-primary-text-color: #fff;
}

:deep(.dp__input) {
  color: white !important;
}

:deep(.dp__input_placeholder) {
  color: white !important;
}
</style>
