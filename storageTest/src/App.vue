<script setup lang="ts">
import {ref} from "vue"

const testText = ref('')
const count = ref(1)

const setLocal = () => {
  count.value++
  localStorage.setItem(`name${count.value}`,testText.value)
}

const removeLocal = () => {
  localStorage.clear()
}

const setSession = () => {
  count.value++
  sessionStorage.setItem(`name${count.value}`,testText.value)
}

const removeSession = () => {
  sessionStorage.clear()
}

const setCookie = () => {
  document.cookie = "myCookie=PB"
}

</script>

<template>
  <input v-model="testText"/>
  <button @click="setLocal" >localStorage add</button>
  <button @click="setSession" >sessionStorage add</button>
  <button @click="removeLocal">localStorage remove</button>
  <button @click="removeSession">sessionStorage remove</button>
  <button @click="setCookie">cookie</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
