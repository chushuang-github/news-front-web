import { createStore, compose } from 'redux'
import reducer from './reducer'

// 持久化
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
  key: 'coderhub',
  storage,
  whitelist: ['collapsedReducer'],
}
// 改造reducer：配置需要持久化的reducer
const persistedReducer = persistReducer(persistConfig, reducer)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(persistedReducer, composeEnhancers())

const persistor = persistStore(store)

export {
  persistor,
  store
}