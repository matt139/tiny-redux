#writing/2022 #web-dev #javascript 

up:: [[web-dev]]

We can use the redux pattern for state management without importing any libraries.
The redux pattern itself is very straightforward and can be easily implemented
in plain javascript. All we need is store, some actions, some reducers, and a
way to handle side effects.

the store is just a plain object. we can set a default state if we want to

```javascript
const store = {
  name: 'alice',
  isOpen: true,
}
```

actions are just plain objects that have a `type` property that is some string. They can have any other data.

```javascript
const openThingAction = {
  type: 'openThingAction',
}
const closeThingAction = {
  type: 'closeThingAction',
}
const setNameAction = {
  type: 'setNameAction',
  newName: 'bob',
}
```

reducers are functions that take the store and an action as arguments, and
return a new store. If the action is not relevnt to the reducer, the reducer
returns the input store

```javascript
function openThingReducer(store, action) {
  if (action.type !== 'openThingAction') return store
  return {
    ...store,
    isOpen: true,
  }
}
function closeThingReducer(store, action) {
  if (action.type !== 'closeThingAction') return store
  return {
    ...store,
    isOpen: false,
  }
}
function setNameReducer(store, action) {
  if (action.type !== 'setNameAction') return store
  return {
    ...store,
    name: action.newName,
  }
}
```

create an array of all reducers. when each action is dispatched it is piped
through all of the reducers, returning a new store

```javascript
const reducers = [openThingReducer, closeThingReducer, setNameReducer]
const dispatchAction = (action) =>
  reducers.reduce((nextStore, reducer) => reducer(nextStore, action), store)
const newStore = dispatchAction({ type: 'openThingAction' })
```

effects are functions that take a store and an action as an argument and create
some side effect. if the action is not relevant to the effect, the effect
returns. any return values are discarded. effects can optionally dispatch more
actions

```javascript
function closeThingEffect(store, action) {
  if (action.type !== 'openThingAction') return
  console.log(store)
  setTimeout(() => {
    dispatchAction({ type: 'closeThingAction' })
    console.log(store)
  }, 1000)
}
```

for each dispatched action, execure each of the effects before running the
reducers

```javascript
const effects = [closeThingEffect]
const dispatchAction = (action) => {
  effects.forEach((effect) => effect(store, action))
  reducers.reduce((nextStore, reducer) => reducer(nextStore, action), store)
}
```

we don't want our store being updated except through dispatched actions, so we
create a closure that returns the necessary methods

```javascript
function createRedux(initialState) {
  let state = initialState
  let reducers = []
  let effects = []
  return {
    dispatchAction: (action) => {
      effects.forEach((effect) => effect(state, action))
      state = reducers.reduce(
        (nextState, reducer) => reducer(nextState, action),
        state
      )
      return state
    },
    getState: () => state,
    registerReducer: (reducer) => {
      reducers = [...reducers, reducer]
    },
    registerEffect: (effect) => {
      effects = [...effects, effect]
    },
  }
}

const { dispatchAction, getState, registerReducer, registerEffect } =
  createRedux({ isOpen: false, name: 'alice' })
```

wrap it up in an IIFE and stick it in a script tag to make basic redux
available in just 22 line of vanilla javascript with no dependencies

```html
<script>
  const { registerEffect, dispatchAction, getState, registerReducer } = (() => {
    let state = {}
    let reducers = []
    let effects = []
    return {
      dispatchAction: (action) => {
        effects.forEach((effect) => effect(state, action))
        state = reducers.reduce(
          (nextState, reducer) => reducer(nextState, action),
          state
        )
        return state
      },
      getState: () => state,
      registerReducer: (reducer) => {
        reducers = [...reducers, reducer]
      },
      registerEffect: (effect) => {
        effects = [...effects, effect]
      },
    }
  })()
</script>
```

