import Axios from "@/util/http";

/**
 * 首页搜索列表
 * @param {string} keyword 搜索关键字
 * @returns
 */
export const SearchApi = (data) =>
  Axios.post("/api/sellerGoods!search-keyword.action", data);

/**
 * 获取首页banner图
 * @param {h} data 
 * @returns 
 */
export const GetHomeBanner = (data) =>
  Axios.post("/api/index!home.action", data);

export const HomeBanner = (data) =>
  Axios.post("/api/banner!bannerList.action", data)
/**
 * 店铺下搜索商品
 * @param {string} keyword 搜索关键字
 * @returns 
 */
export const SearchGoodsApi = (data) =>
  Axios.post("/api/sellerGoods!searchSellerGoods.action", data);

/**
 * 首页分类列表
 * @params {token, pageNum, pageSize, lang}
 * @returns
 */
export const CategoryApi = (data) =>
  Axios.post("/api/category!list.action", data);

export const CategoryApiList = (data) =>
  Axios.fetch("/api/category!tree.action", data);

export const RecommendCategory = (data) =>
  Axios.post('/api/category!recommend.action?', data)
/**
 * 首页推荐商品
 * @params {lang,pageNum,pageSize,recTime(推荐), newTime(新品), }
 * @returns
 */
export const RecommendedProductsApi = (data) =>
  Axios.post("/api/sellerGoods!list.action", data);

/**
 * 搜索结果列表
 * @param {Object} data
 * @returns
 */
export const SearchResultListApi = (data) =>
  // Axios.post("/api/sellerGoods!search-goods.action", data);
  Axios.post("/api/sellerGoods!search.action", data);
  
export const accountCancel = (data) =>
  Axios.post("/api/user!logoff.action", data);
/**
 * 商户列表
 * @param {Object} data
 * pageNum	是	int	页d码
  pageSize	是	int	长度
  isRec	是	int	推荐 1是
 * @returns
 */
export const MerchantListApi = (data) =>
  Axios.post("/api/seller!list.action", data);

/**
 * 商户商品列表
 * @param {Object} data
 * token	是	string	用户token
  pageNum	是	int	页码
  pageSize	是	int	长度
  lang	是	string	语言
  sellerId	是	string	店铺id
  categoryId	是	string	分类id
  isNew	是	int	新品推荐 1为是
  isRec	是	int	推荐 1为是
  isPrice	是	int	排序 1为是
 * @returns
 */
export const MerchantProductListApi = (data) =>
  Axios.post("/api/sellerGoods!list.action", data);

// export const MerchantProductListApi = (data) =>
//   Axios.post("/seller/goods!list.action", data);

/**
   * lang	是	string	语言
pageNum	是	int	页码
pageSize	是	int	长度
isPrice	是	int	0-否，1-是
categoryId	是	string	分类id
   * @param {Object} data 
   * @returns 
   */
export const SellerGoodsListApi = (data) =>
  Axios.post("/api/sellerGoods!list.action", data);

// 店铺内搜索
export const searchSellerGoods = (data) =>
  Axios.post("/api/sellerGoods!searchSellerGoods.action", data);

export const getDownloadAppUrl = () => Axios.post('/api/index!download-url.action')

//订阅
export const sub = (data) => Axios.post('/api/subscribe!add.action', data)
/**
 * 首页推荐、新品
 * @params {lang,type(1->推荐；0->新品) }
 * @returns
 */
export const RecommendedProductsNewApi = (data) => Axios.post("/api/sellerGoods!recommend_new.action", data);

// 心跳
export const heartBeat = (data) => Axios.post('/api/user!heartbeat.action', data)

// 最大购买数
export const maxBuy = (data) => Axios.post('/api/syspara!getSyspara.action', data)
// 获取活动链接
export const getActiveUrl = (data) => Axios.fetch('/api/activity/lottery!getCurrentActivity.action', data)

// 添加购物车
export const addCart = (data) => Axios.post('/api/cart!add.action', data)
// 购物车列表
export const cartList = (data) => Axios.post('/api/cart!list.action', data)
// 删除购物车商品
export const updateCart = (data) => Axios.post('/api/cart!update.action', data)
// 下单购物车商品
export const submitCart = (data) => Axios.post('/api/order!submit.action', data)

// 获取通知列表
export const getMessageList = (data) => Axios.fetch('/api/notification!message.pagelist',data)
// 投诉接口
// /api/comp/add.action
// 参数
// sellerId  被投诉的卖家id
// complaintStatus  投诉类型
// imgUrl1  截图凭证
// imgUrl2
// imgUrl3
// imgUrl4
// imgUrl5
// imgUrl6
// imgUrl7
// imgUrl8
// imgUrl9
// 投诉店铺
export const complaint = (data) => Axios.post('/api/comp/add.action', data)
// 从购物车删除商品或者更新数量：
// /api/cart!update.action
// skuId
// sellerGoodsId
// buyNum
// isMove 为1时表示删除该商品，否则不传



// 下单的接口：
// /api/order!submit.action
// 从购物车下单时候，增加一个参数
// fromCart:1
// 否则不传

