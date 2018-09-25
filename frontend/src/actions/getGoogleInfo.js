import axios from 'axios';
import { GET_ERRORS, SET_GOOGLE_INFO } from './types';

var googleInfo = {};

export const getGoogleInfo = () => dispatch => {
    axios.post('/api/googleAPI')
            .then(res => {
                console.log(res);
                googleInfo.userLocationCity = res.data.userLocationCity;
                googleInfo.userTimezone = res.data.userTimezone;
                dispatch(setUserLocation(googleInfo));      
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}

export const setUserLocation = googleInfo => {
    
    return {
        type: SET_GOOGLE_INFO,
        payload: googleInfo
    }
}

