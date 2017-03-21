import { AsyncStorage } from 'react-native';

const setToken = (token) => AsyncStorage.setItem('auth_token', token);
const getToken = () => {
    return AsyncStorage.getItem('auth_token');
}

module.exports = {
    setToken: setToken,
    getToken: getToken,
}