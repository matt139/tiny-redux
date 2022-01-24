export type Type = string
export type Data<D extends Record<string, any> = Record<string, any>> = D
export type Action<D extends Data = Data> = { type: Type; data?: D }
export type State<S extends Record<string, any> = Record<string, any>> = S
export type Reducer<S, A extends Action = Action> = (
  state: State<S>,
  action: A
) => State<S>
export type Effect<S, A extends Action = Action> = (
  state: State<S>,
  action: A
) => void

export function tinyRedux<T extends State>(state: T) {
  let reducers: Reducer<T>[] = []
  let effects: Effect<T>[] = []
  return {
    dispatchAction: <T extends Data = Data>(type: Type, data?: T) => {
      const action = { type, data }
      effects.forEach((effect) => effect(state, action))
      state = reducers.reduce(
        (nextState, reducer) => reducer(nextState, action),
        state
      )
      return state
    },
    getState: () => state,
    registerReducer: (reducer: Reducer<T>) => reducers.push(reducer),
    registerEffect: (effect: Effect<T>) => effects.push(effect),
  }
}
