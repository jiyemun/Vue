import {defineStore} from 'pinia'

export const useCounterStore = defineStore("counterTest", {
    state: () => ({count: 0}),
    actions: {
        increment() {
            this.count++
        }
    },
    getters: {
        calcMoney(state) {
            return state.count * 1000
        }
    }
})