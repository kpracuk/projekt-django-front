<template>
  <UiNavbar />
  <RouterView class="px-4" />
  <notifications position="bottom right" />
</template>

<script lang="ts" setup>
import UiNavbar from './components/ui/UiNavbar.vue';
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
</style>