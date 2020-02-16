/* 
  封装axios
*/
import axios from 'axios'
import codeMessage from '../config/code-message'
import { message } from 'antd'
import store from '../redux/store'
import { removeItem } from '../utils/storage'
import { removeUserSuccess } from '../redux/action-creators/user'
import history from '../utils/history'

// axiosInstance就是Axios实例对象，它的用法和axios基本一样
const axiosInstance = axios.create({
	//设置默认基础地质
	baseURL: 'http://localhost:5000/api',
	timeout: 10000,//指定请求超时的毫秒数，超过时间自动终止请求
	headers: {}
})

//设置请求拦截器
axiosInstance.interceptors.request.use((config) => {
	//在发送之前修改配置信息
	//如果post请求是content-type:application/json  下面这段代码就去掉
	if (config.method === 'POST') {
		//如果请求方式是post，那就给headers加上content-type:'application/x-www-form-urlencoded'
		config.headers['content-type'] = 'application/x-www-form-urlencoded'
		//修改data数据 变成urlencoded
		config.data = Object.keys(config.data).reduce((prev, key) => {
			const value = config.data[key];
			return prev + `&${key}=${value}`;

		}, '').substring(1);
	}

	//从redux中读取user状态数据,从user中读取token
	const { user: { token } } = store.getState();
	//判断token是否存在
	if (token) {
		config.headers.authorization = 'Bearer ' + token;
	}
	//将config返回出去
	return config
}, (error) => {
	//请求出现错误

})

//设置响应拦截器
axiosInstance.interceptors.response.use(
	({ data }) => { //通过解构赋值提取data
		//判断响应成功
		if (data.status === 0) {
			//响应成功 返回数据
			return data.data
		} else {
			//功能响应失败
			message.error(data.msg)
			return Promise.reject(data.msg)
		}
	}, (error) => {

		let errorMessage = ''
		if (error.response) {
			//说明服务器返回了响应
			errorMessage = codeMessage[error.response.status] || '未知错误';

			if (error.response.status === 401) {
				//说明token有问题
				//清空本地token (localStorage、redux) 重定向到/login
				removeItem();
				store.dispatch(removeUserSuccess()); //调用removeUserSuccess这个方法就可以更新对象
				history.push('/login')
			}
		} else {
			if (error.message.indexOf('Network Error') !== -1) {
				errorMessage = '请检查网络连接';
			} else if (error.message.indexOf('timeout') !== -1) {
				errorMessage = '刷新重试';
			} else {
				errorMessage = '未知错误'
			}
		}
		message.error(errorMessage)
		return Promise.reject(errorMessage);
	})

export default axiosInstance;