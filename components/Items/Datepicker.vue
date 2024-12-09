<template>
  <div class="w-[26.5%]">
    <VueDatePicker style="color: white !important;" locale="de" @clear="isSelected = false"
      @open="openDatePicker = true" @closed="openDatePicker = false" cancelText="Abbrechen" selectText="Auswählen"
      :enable-time-picker="false" :dark="true" :format="format" v-model="date" @update:modelValue="emitDate"
      placeholder="Date">
      <template #input-icon>
        <svg v-if="!isSelected" :class="{ 'rotate-180': openDatePicker, 'rotate-0': !openDatePicker }"
          class="inline-block w-4 h-4 sm:ml-2 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </template>
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
const openDatePicker = ref(false);
const isSelected = ref(false);

const emitDate = (newDate) => {

  if (newDate === null) {
    isSelected.value = false;
    emit('update:date', '');
    return;
  }
  isSelected.value = true;
  emit('update:date', newDate);
};
</script>

<style>
.dp__theme_dark {
  --dp-background-color: rgb(47, 47, 47);
  --dp-cell-padding: 1rem;
  --dp-input-padding: 1.1rem;
  --dp-border-radius: 0.5rem;
  --dp-font-family: 'Josefin Sans', sans-serif;
  --dp-font-size: 18px;
  --dp-primary-color: #fff;
  --dp-primary-text-color: #fff;
  --dp-icon-color: #fff;
  --dp-input-icon-padding: 25px;
  --dp-primary-color: #e77000 !important;
  --dp-action-buttons-padding: 17px 10px;
  --dp-menu-padding: 12px;
}


.dp__input_icon {
  right: 0;
  transform: translateX(72%) translateY(-50%) !important;
}

.dp__input {
  color: white !important;

}

.dp__input::placeholder {
  color: white !important;
}

.dp__input_placeholder) {
  color: white !important;
}
</style>
