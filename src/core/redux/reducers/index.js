import { combineReducers } from 'redux';
import walletsReducer from './wallets-reducer';

const rootReducer = combineReducers({
    walletsReducer,
});

export default rootReducer;
