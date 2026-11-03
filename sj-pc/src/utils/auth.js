import Cookies from 'js-cookie'
import store from "@/store";

const TokenKey = 'Admin-Token'

export function getToken() {
    // 兼容旧版本只写入 localStorage 的登录状态。进入登录页前先读取
    // 已有商户 token，路由守卫会继续向后端校验其是否仍然有效。
    return Cookies.get(TokenKey) || localStorage.getItem('token') || localStorage.getItem('ES_TOKEN')
}

export function setToken(token) {
    store.commit('user/SET_TOKEN', token)
    localStorage.setItem('token', token)
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    store.commit('user/SET_TOKEN', '')
    localStorage.setItem('token', '')
    return Cookies.remove(TokenKey)
}
