<template>
  <div>
    <h1>Pinia</h1>
    <h2>
      <img src="src/assets/logo.svg" width="100"/>
    </h2>
    <h3>
      <button @click="counter.increment">먹이구매</button>
    </h3>
    <h4>{{ counter.count }}개</h4>
    <h3>{{ counter.calcMoney }}원</h3>
  </div>
</template>
<script>
import {defineComponent} from "vue";
import {useCounterStore} from "./stores/counter";

export default defineComponent({
  name: "App",
  setup() {
    const counter = useCounterStore();
    return {
      counter
    }

  }
})

</script>

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
