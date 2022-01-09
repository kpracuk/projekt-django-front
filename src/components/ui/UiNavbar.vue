<template>
<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="relative flex items-center justify-between h-16">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button type="button" class="transition inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-900" @click="data.navbarOpen = !data.navbarOpen">
          <span class="sr-only">Open main menu</span>
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <RouterLink to="/" class="flex items-center text-2xl font-bold text-blue-500">
          JG
        </RouterLink>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex space-x-4">
            <router-link to="/products" class="transition text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" v-if="authStore.isLoggedIn">Produkty</router-link>
            <router-link to="/orders" class="transition text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" v-if="authStore.isLoggedIn">Zamówienia</router-link>
            <router-link to="/about" class="transition text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">O nas</router-link>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0" v-if="authStore.isLoggedIn">
        <div class="ml-3 relative">
          <div>
            <button class="flex items-center gap-x-1 transition text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white px-3 py-2 rounded-md text-sm font-medium" @click="data.isUserDropdownActive = !data.isUserDropdownActive">
              {{ authStore.getUser?.name || '' }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition" viewBox="0 0 20 20" fill="currentColor" :class="{ 'rotate-180': data.isUserDropdownActive }">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none" v-if="data.isUserDropdownActive">
            <router-link to="/profile" class="block px-4 py-2 text-sm font-bold text-white" @click="data.isUserDropdownActive = false">Profil</router-link>
            <hr class="border-gray-800">
            <button href="#" class="w-full text-left block px-4 py-2 text-sm font-bold text-red-400" @click="attemptLogout()">Wyloguj</button>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0" v-else>
        <div class="ml-3 relative">
          <div>
            <RouterLink to="/login" class="transition text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Zaloguj się
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="sm:hidden" v-if="data.navbarOpen">
    <div class="px-2 pt-2 pb-3 space-y-1">
      <router-link v-if="authStore.isLoggedIn" to="/products" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" @click="data.navbarOpen = false">Produkty</router-link>
      <router-link v-if="authStore.isLoggedIn" to="/orders" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" @click="data.navbarOpen = false">Zamówienia</router-link>
      <router-link to="/about" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" @click="data.navbarOpen = false">O nas</router-link>
    </div>
  </div>
</nav>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useAuthStore } from "../../store/modules/auth";
import { useRouter } from "vue-router";
import { logoutUser } from "../../api/endpoints/auth";
import { notify } from "@kyvg/vue3-notification";

const authStore = useAuthStore()
const router = useRouter()

const data = reactive({
  isUserDropdownActive: false,
  navbarOpen: false
})

const attemptLogout = () => {
  logoutUser()
    .then(() => {
      data.isUserDropdownActive = false
      authStore.setUser(null)
      notify({
        type: 'success',
        title: "Wylogowano pomyślnie",
        text: 'Mamy nadzieję, że jeszcze nas odwiedzisz',
      });
      if(router.currentRoute.value.path !== '/') {
        router.push('/')
      }
    })
    .catch((error) => {
      notify({
        type: 'error',
        title: "Wystąpił błąd",
        text: error.response?.data?.message || 'Przepraszamy za problemy techniczne',
      });
    })
}
</script>
