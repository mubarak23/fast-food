import { createStore, applyMiddleware, compose } from  "redux";
import {persistReducer, persistStore} from "redux-persist";
import devToolsEnhancer from "remote-redux-devtools";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { persistConfig } from "./configureStore.js";
import reducers from "./reducers";

const persistantStore = persistReducer(persistConfig, reducers)

export const store = createStore(
    persistantStore, {},
    compose(
        applyMiddleware(createLogger(), thunk),
        devToolsEnhancer({
            name: 'fast-food-store',
            realtime: false
        })
    )
)

export const fastFoodStore = persistStore(store)

