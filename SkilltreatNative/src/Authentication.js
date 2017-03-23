import { AsyncStorage } from 'react-native';

const setToken = (token) => AsyncStorage.setItem('auth_token', token);
const getToken = () => AsyncStorage.getItem('auth_token');
const removeToken = () => AsyncStorage.removeItem('auth_token');

module.exports = {
    setToken: setToken,
    getToken: getToken,
    removeToken: removeToken,
}