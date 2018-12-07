# DelayedPromiseSquasher

An ES6 instanciable class that will resolve your last pushed callback after a small delay without new push


The push method returns a Promise


Typical use case is an input text making ajax queries onkeyup.

## Dependencies
 - none

## Install

```bash
npm install --save delayed-promise-squasher
```

## Usage
```javascript
const DelayedPromiseSquasher = require('delayed-promise-squasher')
const squasherInstance = new DelayedPromiseSquasher()

squasherInstance.push(() => {
    // ...
})
```

## Example:


```javascript
const delayMs = 300
const callbackFn1 = function () {
    console.warn('callbackFn1 just ran')
}
const callbackFn2 = function () {
    console.warn('callbackFn2 just ran')
}
const callbackFn3 = function () {
    console.warn('callbackFn3 just ran')
    return Promise.resolve(3)
}
const callbackFn4 = function () {
    console.warn('callbackFn4 just ran')
}

const DelayedPromiseSquasher = require('delayed-promise-squasher')
const squasher = new DelayedPromiseSquasher(delayMs)
const started = (new Date()).getTime()

console.log('Pushing callbackFn1')
squasher.push(callbackFn1)

console.log('Pushing callbackFn2, immediately after')
squasher.push(callbackFn2)

setTimeout(function () {
    console.log('Pushing callbackFn3, 100ms later')
    squasher.push(callbackFn3)
    .then(function (resp) {
        console.warn('at this point ' + ((new Date()).getTime() - started) + 'ms elapsed. Since callbackFn3 returns something, we can access it ', resp)
    })
}, 100)

setTimeout(function () {
    console.log('Pushing callbackFn4, 500ms later')
    squasher.push(callbackFn4)
    .then(function (resp) {
        console.warn('at this point ' + ((new Date()).getTime() - started) + 'ms elapsed')
    })
}, 500)
```
will display in the console: 

```text
Pushing callbackFn1
Pushing callbackFn2, immediately after
Pushing callbackFn3, 100ms later
callbackFn3 just ran
at this point 402ms elapsed. Since callbackFn3 returns something, we can access it  3
Pushing callbackFn4, 500ms later
callbackFn4 just ran
at this point 802ms elapsed
```
