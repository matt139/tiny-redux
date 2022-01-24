export function tinyRedux(state) {
    let reducers = [];
    let effects = [];
    return {
        dispatchAction: (type, data) => {
            const action = { type, data };
            effects.forEach((effect) => effect(state, action));
            state = reducers.reduce((nextState, reducer) => reducer(nextState, action), state);
            return state;
        },
        getState: () => state,
        registerReducer: (reducer) => reducers.push(reducer),
        registerEffect: (effect) => effects.push(effect),
    };
}
