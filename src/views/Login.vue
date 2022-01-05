<template>
  <div class="w-full flex justify-center pt-8">
    <div class="p-4 bg-gray-800 rounded-md w-96 max-w-full flex flex-col gap-y-2">
      <FormInput id="email" type="email" v-model="data.email" :errors="data.errors.email">Email</FormInput>
      <FormInput id="password" type="password" v-model="data.password" :errors="data.errors.password">Hasło</FormInput>
      <RouterLink to="/register" class="mt-2 text-gray-100 hover:underline hover:text-gray-300 text-sm font-bold">
        Nie masz konta? Zarejestruj się!
      </RouterLink>
      <UiButton @click="attemptLogin()" :disabled="data.isLoading">{{ data.isLoading ? 'Daj nam chwilę...' : 'Zaloguj się' }}</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { getUser, loginUser } from "../api/endpoints/auth";
import { useAuthStore } from "../store/modules/auth";
import { notify } from "@kyvg/vue3-notification";

import FormInput from '../components/form/FormInput.vue'
import UiButton from '../components/ui/UiButton.vue'
import { useRouter } from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

const data = reactive({
  email: '',
  password: '',
  isLoading: false,
  errors: {} as {[key: string]: string[]},
  errorMessage: null
})

const attemptLogin = () => {
  data.errors = Object.assign({})
  data.errorMessage = null
  data.isLoading = true
  loginUser(data)
    .then((response) => {
      getUser()
        .then(response => {
          authStore.setUser(response.data)
          const user = authStore.getUser
          notify({
            type: 'success',
            title: user?.name ? `Witaj, ${user.name}` : 'Witaj!',
            text: 'Dziękujemy za korzystanie z naszego serwisu',
          });
          router.push('/')
        })
    })
    .catch((error) => {
      data.errors = Object.assign({}, error.response?.data?.errors || {})
      data.errorMessage = error.response?.data?.message || null
      notify({
        type: 'error',
        title: "Wystąpił błąd",
        text: data.errorMessage || 'Przepraszamy za problemy techniczne',
      });
    })
    .finally(() => {
      data.isLoading = false
    })
}
</script>