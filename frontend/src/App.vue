<template>
  <div id="app">
    <header>
      <h1>FletesPro 🚛</h1>
      <!-- Aquí podrías poner navegación si lo deseas -->
    </header>
    <router-view />
  </div>
</template>

<script setup>
// Por ahora no hay lógica aquí
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', sans-serif;
  background-color: #fdfdfd;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
