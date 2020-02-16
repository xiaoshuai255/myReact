/* 
  用来定义请求方法的模块
*/

import axiosInstance from './request'

//请求登录
export const reqLogin = ((username, password) => {
	return axiosInstance({
		method: 'POST',
		url: '/login',
		data: {
			username, password
		}
	})
})


//请求分类列表数据
export const reqGetCategories = () => axiosInstance({
	method: 'GET',
	url: '/category/get',

})


//请求添加分类数据
export const addCategory = (categoryName) => axiosInstance({
	method: 'POST',
	url: '/category/add',
	data: {
		categoryName
	}
})


//修改分类
export const updateCategory = (categoryName, categoryId) => axiosInstance({
	method: 'POST',
	url: '/category/update',
	data: {
		categoryName,
		categoryId
	}
})

//获取商品列表
export const getProducts = (pageNum, pageSize) => axiosInstance({
	method: 'GET',
	url: '/product/list',
	params: {
		pageNum,
		pageSize
	}
})

//请求添加商品数据
export const reqAddProduct = ({ name, desc, price, categoryId, detail }) => axiosInstance({
	method: 'POST',
	url: '/product/add',
	data: {
		name, desc, price, categoryId, detail
	}
})

//请求获取单个商品数据（详情）
export const reqOneProduct = (categoryId) => axiosInstance({
	method: 'GET',
	url: '/product/get',
	params: {
		categoryId
	}
})

//请求修改商品数据
export const reqUpdateProduct = ({ name, desc, price, categoryId, detail, productId }) => axiosInstance({
	method: 'POST',
	url: '/product/update',
	data: {
		name, desc, price, categoryId, detail, productId
	}
})


//请求修改商品数据
export const reqUpdateProductStatus = (productId, status) => axiosInstance({
	method: 'POST',
	url: '/product/update/status',
	data: {
		productId, status
	}
})


//搜索商品
export const reqSearchProduct = ({ searchType, searchValue, pageNum, pageSize }) => axiosInstance({
	method: 'GET',
	url: '/product/search',
	params: {
		pageNum,  //页数
		pageSize,  //条数
		[searchType]: searchValue   //前面先确定搜索的方式：搜索的值
	}
})