import { combineReducers } from 'redux'
import collapsedReducer from './collapsed-reducer'
import loadingReducer from './loading-reducer'

const reducer = combineReducers({
  collapsedReducer,
  loadingReducer
})

export default reducer