<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import {ref, reactive, toRefs} from "vue";

const person1 = ref({name: 'jiye', age: 28})
const person2 = reactive({name: 'jiyoung', age: 25})
const person3 = ref(100)
const person4 = reactive(['클라이밍', '수영'])

const book = reactive({
  author: 'jiye',
  title: 'vue3'
})

let {author, title} = book

const book2 = reactive({
  author2: 'jiye',
  title2: 'vue3'
})

let {author2, title2} = book2

const book3 = reactive({
  author3: 'jiye',
  title3: 'vue3'
})

let {author3, title3} = toRefs(book3)

const handleClick = () => {
  person1.value.name = 'test1'
  person2.name = 'test2'
  person3.value = 1000
  person4.push('달리기')
  author = 'robot'
  title = 'run'
  author2 = 'robot2'
  title2 = 'run2'
  author3.value = 'robot3'
  title3.value = 'run3'
}
</script>

<template>
  <div>
    <button @click="handleClick">click</button>
    <div>name : {{ person1.name }}, age : {{ person1.age }}</div>
    <div>name : {{ person2.name }}, age : {{ person2.age }}</div>
    <div>age : {{ person3 }}</div>
    <div>hobby : {{ person4 }}</div>
    <div>book author : {{ author }}</div>
    <div>book title : {{ title }}</div>
    <div>book2 author : {{ author2 }}</div>
    <div>book2 title : {{ title2 }}</div>
    <div>book3 author : {{ author3 }}</div>
    <div>book3 title : {{ title3 }}</div>
    <img alt="Vue logo" src="./assets/logo.png"/>
    <HelloWorld msg="Hello Vue 3 + TypeScript + Vite"/>
   </div>
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
