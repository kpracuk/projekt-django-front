<template>
  <div class="flex flex-col sm:flex-row justify-between w-full p-4 bg-gray-900 rounded-md">
    <div class="flex sm:flex-col justify-between">
      <span class="text-xl font-bold">
        {{ productName }} <span class="text-gray-500 font-normal text-lg">x{{ quantity }}</span>
      </span>
      <span class="text-gray-400 font-bold">
        {{ email }}
      </span>
      <div class="flex flex-col items-end sm:hidden">
        <span>
          {{ (getFullPrice() / 100).toFixed(2) }} PLN
        </span>
        <span class="text-gray-500 text-sm font-bold">
          {{ (price / 100).toFixed(2) }} PLN x {{ quantity }}
        </span>
      </div>
    </div>
    <div class="flex justify-between sm:justify-start items-center gap-x-4">
      <div class="flex flex-col items-end hidden sm:visible">
        <span>
          {{ (getFullPrice() / 100).toFixed(2) }} PLN
        </span>
        <span class="text-gray-500 text-sm font-bold">
          {{ (price / 100).toFixed(2) }} PLN x {{ quantity }}
        </span>
      </div>
      <div class="flex flex-col items-start sm:items-end">
        <span>
          {{ getFormattedDate() }}
        </span>
        <span :class="getStatusColor()">
          {{ getTranslatedStatus() }}
        </span>
      </div>
      <FormSelect id="status" :options="translations" v-model="status.status" v-if="userCanChangeStatus" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import FormSelect from "../form/FormSelect.vue";
  import { reactive, watch } from "vue";

  const emits = defineEmits(['status_change'])

  const props = defineProps({
    orderId: Number,
    productName: String,
    price: {
      type: Number,
      default: () => 0
    },
    quantity: Number,
    date: String,
    status: String,
    email: String,
    userCanChangeStatus: {
      type: Boolean,
      default: () => false
    }
  })

  const status = reactive({
    status: props.status,
    id: props.orderId
  })

  watch(status, (value) => {
    emits('status_change', value)
  })

  const getFormattedDate = () => {
    if(props.date) {
      const date = (new Date(props.date)).toISOString().split('T')
      return date[0] + ' ' + date[1].slice(0, -5)
    }
    return null
  }

  const getFullPrice = () => {
    if(props.price && props.quantity) {
      return props.price * props.quantity
    }
    return 0
  }

  const translations = {
    placed: 'Złożone',
    confirmed: 'Potwierdzone',
    in_progress: 'W realizacji',
    waiting_for_transport: 'Czeka na transport',
    sent: 'Wysłane',
    delivered: 'Dostarczone'
  }

  const getTranslatedStatus = () => {
    // @ts-ignore
    return translations[props.status]
  }

  const getStatusColor = () => {
    const colors = {
      placed: 'text-white',
      confirmed: 'text-violet-500',
      in_progress: 'text-yellow-500',
      waiting_for_transport: 'text-cyan-500',
      sent: 'text-lime-500',
      delivered: 'text-green-500'
    }

    // @ts-ignore
    return colors[props.status]
  }
</script>