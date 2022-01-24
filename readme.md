# Tiny Redux

Just a tiny bit of state management

## Usage

### Via `<script>` tag

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script
      src="https://cdn.jsdelivr.net/gh/matttelliott/tiny-redux/index.min.js"
      type="text/javascript"
    ></script>
    <script>
      const initialState = { clicked: false }
      const { getState, registerReducer, registerEffect, dispatchAction } =
        tinyRedux(initialState)
    </script>

    <!-- Optional React scripts -->
    <script
      src="https://unpkg.com/react@17/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  </head>
  <body>
    <main id="root"></main>

    <script type="text/babel">
      function update(state) {
        ReactDOM.render(
          <div>
            <p>clicked: {getState().clicked.toString()}</p>
            <button type='button' onClick={() => dispatchAction('clickButton')}>
              Click Me
            </button>
          </div>,
          document.getElementById('root')
        )
      }

      update(getState())
      registerEffect((state, action) => {
        setTimeout(() => update(state), 0)
      })
      registerReducer((state, action) => {
        if (action.type !== 'clickButton') return state
        state.clicked = true
        return state
      })
    </script>
  </body>
</html>
```

### Via NPM

```bash
npm install --save @matttelliott/tiny-redux
```

```typescript
import { tinyRedux } from '@matttelliott/tiny-redux'

const initialState = {}
const { getState, registerReducer, registerEffect, dispatchAction } =
  tinyRedux(initialState)
```
