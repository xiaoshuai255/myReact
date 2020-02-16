/*
  用来创建action对象
    同步action creator: 返回值就是action对象
    异步action creator: 返回值是一个函数，在函数中完成异步操作
*/
import { reqLogin } from '../../api'

import { GET_USE_SUCCESS, REMOVE_USE_SUCCESS } from '../action-types/user'
//同步函数
const getUserSuccess = (user) => ({
	type: GET_USE_SUCCESS,
	data: user
})

export const removeUserSuccess = () => ({
	type: REMOVE_USE_SUCCESS,

})

//异步函数
export const getUserAsync = (username, password) => {
	return (dispatch) => {
		//异步操作
		return reqLogin(username, password)
			.then((response) => {
				//创建action
				const action = getUserSuccess(response)
				console.log(action)
				//调用dispatch方法
				dispatch(action)

				return response
			})
	}
}