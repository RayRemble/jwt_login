import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import googleReducer from './googleReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    googleInfo: googleReducer
});