import { SET_GOOGLE_INFO } from '../actions/types';

const initialState = {
    googleInfo: {}
}

export default function(state = initialState, action ) {
    console.log(action.payload);
    switch(action.type) {
        case SET_GOOGLE_INFO:
            return {
                ...state,
                googleInfo: action.payload
            }
        default: 
            return state;
    }
}