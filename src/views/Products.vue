<template>
  <div class="w-full flex justify-center pt-8">
    <div class="p-4 bg-gray-800 rounded-md w-full max-w-3xl flex flex-col gap-y-2">
      <div class="flex rounded-md bg-gray-900 p-4 mb-4 gap-x-4">
        <button
          class="flex gap-x-1 bg-gray-800 rounded-md px-2 py-1"
          :class="{ 'text-blue-500': data.sorting.property === property }"
          @click="setSorting(property)"
          v-for="(title, property) in data.sorting.properties"
          :key="property"
        >
          <span class="font-bold">{{ title }}</span>
          <span v-if="data.sorting.property === property">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-if="data.sorting.mode === 'desc'">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-if="data.sorting.mode === 'asc'">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </span>
        </button>
      </div>
      <div class="flex justify-center mb-2" v-if="data.loading">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 animate-spin" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      </div>
      <UiProduct
        v-for="(product, key) in sortedProducts"
        :key="key"
        :name="product.name"
        :description="product.description"
        :quantity="product.quantity"
        :price="product.price"
        :buyable="userCanBuy"
        :product-id="product.id"
        :disabled="data.buttonsDisabled"
        v-else-if="sortedProducts.length"
        @item_buy="attemptOrderCreate($event)"
      />
      <div class="flex justify-center mb-2 text-gray-500 font-bold" v-else>
        Brak dostępnych produktów
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive } from 'vue';
  import { getProducts } from "../api/endpoints/products";
  import { createOrder } from "../api/endpoints/orders";
  import UiProduct from "../components/ui/UiProduct.vue";
  import { Product } from "../api/interfaces/products";
  import { notify } from "@kyvg/vue3-notification";
  import { useAuthStore } from "../store/modules/auth";
  import { CreateOrderRequest } from "../api/interfaces/orders";
  import { useRouter } from "vue-router";

  const authStore = useAuthStore();
  const router = useRouter();

  const data = reactive({
    buttonsDisabled: false,
    loading: true,
    sorting: {
      property: '',
      mode: '',
      properties: {
        name: 'Nazwa',
        quantity: 'Ilość dostępnych',
        price: 'Cena'
      }
    },
    products: [] as Product[]
  })

  const attemptOrderCreate = (event: CreateOrderRequest) => {
    data.buttonsDisabled = true
    createOrder(event)
      .then(response => {
        notify({
          type: 'success',
          title: 'Zamówienie zostało złożone!',
          text: 'Dziękujemy za korzystanie z naszych usług'
        })
        router.push('/orders')
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Wystąpił błąd',
          text: 'Nie udało się złożyć zamówienia'
        })
        data.buttonsDisabled = false
      })
  }

  onMounted(() => {
    getProducts()
      .then(response => {
        data.products = response.data
      })
      .catch(error => {
        data.products = []
        notify({
          type: 'error',
          title: 'Wystąpił błąd',
          text: 'Nie udało się pobrać produktów'
        })
      })
    .finally(() => {
      data.loading = false
    })
  })

  const userCanBuy = computed((): boolean => {
    return authStore.hasRole('user')
  })

  const sortedProducts = computed((): Product[] => {
    const property = data.sorting.property
    const mode = data.sorting.mode
    const products = [...data.products]

    if(!property) {
      return products
    }

    if(mode === 'asc') {
      return products.sort((a, b) => {
        if(a[property] > b[property]) {
          return 1
        } else if (b[property] > a[property]) {
          return -1
        } else {
          return 0
        }
      })
    }

    if(mode === 'desc') {
      return products.sort((a, b) => {
        if(a[property] > b[property]) {
          return -1
        } else if (b[property] > a[property]) {
          return 1
        } else {
          return 0
        }
      })
    }
    return products
  })

  const setSorting = (parameter: string) => {
    const currentProperty = data.sorting.property
    const currentMode = data.sorting.mode

    if(currentProperty !== parameter) {
      data.sorting.property = parameter
      data.sorting.mode = 'asc'
      return
    }

    switch (currentMode) {
      case '':
        data.sorting.mode = 'asc'
        break;
      case 'asc':
        data.sorting.mode = 'desc'
        break;
      default:
        data.sorting.property = ''
        data.sorting.mode = ''
        break;
    }
  }
</script>