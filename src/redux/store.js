import { applyMiddleware, compose } from "redux";
import { legacy_createStore as createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

// Налаштування Redux DevTools (додатково до middleware)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)) // Підключення Redux DevTools
);

export default store;
