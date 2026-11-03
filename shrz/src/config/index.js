/*!
 * @author atongmu <zhounianlai@teacher.com.cn>
 * date 11/07/2019
 * description The project global config.
 */
const ENV_DEV = window.location.host // dev

const ENV_PRO = window.location.hostname//
let base_url = ''
let host_url = ''
if (process.env.NODE_ENV === 'development') {
    base_url = 'http://' + ENV_DEV + '/wap'
    host_url= 'http://' + ENV_DEV + '/'
} else {
    base_url = window.location.origin + '/wap'
    host_url= window.location.origin + '/'
}
export const HOST_URL = host_url
export default {
    /**
     * @description Request api base url.
     */
    baseUrl: {
        dev:'/wap/',
        // dev: "http://stu.teacher.com.cn",
        pro: "/wap/",
    },

    /**
     * @description Index page name.
     */
    homePage: "myProject",

    /**
     * @description Public image base url.
     */
    imageBaseUrl: "",

    /**
     * @description Cookie's expire date, default 7 days.
     */
    cookieExpires: 7,
  }
