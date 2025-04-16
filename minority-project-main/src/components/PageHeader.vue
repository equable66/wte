<template>
    <header>
      <h1>{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </header>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    subtitle: String
  })
  </script>
  
  <style scoped>
  header {
    text-align: center;
    padding: 30px 0;
  }
  
  h1 {
    font-family: 'Ma Shan Zheng', cursive;
    font-size: 3rem;
    color: #8B5A2B;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-top: 10px;
  }
  </style>