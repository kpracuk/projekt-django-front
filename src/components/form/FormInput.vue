<template>
  <div class="flex flex-col">
    <label :for="id" class="text-sm text-blue-500 font-bold" :class="{ 'text-red-500': errors.length > 0 }">
      <slot />
    </label>
    <input
        v-bind="$attrs"
        :id="id"
        class="p-2 border-2 border-gray-500 focus:border-blue-500 transition bg-gray-900 text-white rounded-md focus:outline-none"
        :class="{ 'border-red-500': errors.length > 0 }"
        :value="modelValue"
        @input="$emit('update:modelValue', eventTarget($event))"
    />
    <div class="flex flex-col text-red-500 font-bold text-xs" v-if="errors.length > 0">
      <span v-for="(error, key) in errors" :key="key">{{ error }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, watch} from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => ''
  },
  id: {
    type: String,
    required: true
  },
  errors: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits([
  'update:modelValue'
])

const eventTarget = (event: Event) => {
  return (event.target as HTMLInputElement).value
}
</script>