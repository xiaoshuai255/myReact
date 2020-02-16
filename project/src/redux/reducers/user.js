/* 
  根据prevState和action来生成newState
*/
import { GET_USE_SUCCESS,REMOVE_USE_SUCCESS } from '../action-types/user'
import { getItem } from '../../utils/storage'

const initUser = getItem('user') || {}

function user(prevState = initUser, action) {
	switch (action.type) {
		case REMOVE_USE_SUCCESS:
			return {};
		case GET_USE_SUCCESS:
			return action.data  //返回action-creators中创建action对象是传的用户数据
		default:
			return prevState
	}
}

export default user