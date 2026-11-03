import request from "@/request";

//商品详情
export const getSellerGoods = (params) => {
    return request({
        url: "api/sellerGoods!info.action",
        method: "post",
        params:params
    })
};
//商品详情里面的评论
export const getEvaluationList = (params) => {
    return request({
        url: "/api/evaluation!list.action",
        method: "post",
        params:params
    })
};
//获取商家详情
export const getSellerInfo = (params) => {
    return request({
        url: "api/seller!info.action",
        method: "post",
        params:params
    })
};
//提交订单
export const orderSubmit = (params) => {
    return request({
        url: "api/order!submit.action",
        method: "post",
        params:params
    })
};
//下单
export const orderPay = (params) => {
    return request({
        url: "api/order!pay.action",
        method: "post",
        params:params
    })
};
//订单详情
export const orderInfoPay = (params) => {
    return request({
        url: "api/order!info.action",
        method: "post",
        params: {
            ...params,
            loginType: 'user'
        }
    })
};
//商户注册
export const sellerRegister = (params) => {
    return request({
        url: "/seller/version!register.action",
        method: "post",
        params:params
    })
};
//图片上传
export const uploadimg = (params) => {
    return request({
        url: "api/uploadimg!execute.action",
        method: "post",
        data:params,
    })
};
export const apiListCountry = (params = {}) => {
    return request({
        url: "api/address!listCountry.action",
        method: "post",
        params: params
    })
}
export const sellerRegister2 = (params) => {
    return request({
        url: "/seller/version!registerjs.action",
        method: "post",
        params: params
    })
};
export const getEmailCode = (params = {}) => {
    return request({
        url: "api/jscode!execute.action",
        method: "post",
        params: params
    })
}
export const getSignType = (params = {}) => {
    return request({
        url: "api/sysParaSign!info.action",
        method: "post",
        params: params
    })
}
//查询申请进度
export const getStatus = (params) => {
    return request({
        url: "api/kyc!get.action",
        method: "post",
        params:params
    })
};
//关注商品
export const keepGoods = (params) => {
    return request({
        url: "api/keepGoods!add.action",
        method: "post",
        params:params
    })
};
//取消关注商品
export const keepGoodsDel = (params) => {
    return request({
        url: "api/keepGoods!del.action",
        method: "post",
        params:params
    })
};
//添加评论
export const evaluationAdd = (params) => {
    return request({
        url: "api/evaluation!add.action",
        method: "post",
        params:params
    })
};
// 获取下载链接地址
export const apiGetDownloadPath = () => {
    return request({
        url: "api/index!download-url.action",
        method: "post",
    })
};
// 有图.中评差评
export const apiEvaluationCountType = (params) => {
    return request({
        url: "api/evaluation!countType.action",
        method: "post",
        params
    })
};
// type： 1、猜你喜欢  2、推荐

export const apiRecommendAndLike = (params) => {
    return request({
        url: "api/sellerGoods!recommend_like.action",
        method: "post",
        params
    })
};

// 添加购物车
export const apiAddCart = (params) => {
    return request({
        url: "api/cart!add.action",
        method: "post",
        params
    })
}
// 购物车列表
export const apiCartList = (params) => {
    return request({
        url: "api/cart!list.action",
        method: "post",
        params
    })
}
// 更新购物车
export const apiUpdateCart = (params) => {
    return request({
        url: "api/cart!update.action",
        method: "post",
        params
    })
}