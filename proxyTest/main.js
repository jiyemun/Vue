import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

let target = {}
let proxy = new Proxy(target, {})
proxy.test = 5

console.log(target.test,'test')
console.log(target,'target')
console.log(proxy,'proxy')

const t = {
  msg1 : 'hello',
  msg2 : 'jiye'
}

const handler1 = {}

const proxy1 = new Proxy(t, handler1)

console.log(proxy1.msg1)
console.log(proxy1.msg2)

const handler2 = {
  get: function(target, prop, receiver){
    return "world"
  }
}

const proxy2 =  new Proxy(t, handler2)

console.log(proxy2.msg1)
console.log(proxy2.msg2)

const handler3 = {
  get: function (target, prop, receiver){
    console.log(target, prop, receiver,'target,prop,receiver')
    if(prop === 'msg2'){
      return '글씨 변경'
    }
    console.log(arguments,"argument")
    return Reflect.get(...arguments)
  }
}

const proxy3 = new Proxy(t, handler3)

console.log(proxy3.msg1)
console.log(proxy3.msg2)



