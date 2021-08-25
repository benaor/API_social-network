import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import App from "./App"
import "./styles/index.scss"
import rootReducer from "./reducers"

//Devtools
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
// import logger from "redux-logger"

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
