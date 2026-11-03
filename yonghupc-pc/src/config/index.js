
const pro_url = window.location.hostname
const HOST_URL = window.location.origin
const BASE_URL = window.location.origin + '/wap/'
const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${pro_url}/data/websocket`


export default {
    HOST_URL,
    BASE_URL,
    WS_URL,
}
