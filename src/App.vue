<script setup lang="ts">
import TaxCalculator from './components/TaxCalculator.vue';
</script>

<template>
  <div id="app">
    <TaxCalculator />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #e5e2ec 0%, #ac8de9 100%);
  min-height: 100vh;
  padding: 20px;
}

#app {
  min-height: 100vh;
}
</style>