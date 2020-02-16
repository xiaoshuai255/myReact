import { GET_CATEGORIES_SUCCESS, ADD_CATEGORIES_SUCCESS, UPDATE_CATEGORY_SUCCESS } from '../action-types/category'

const initState = [];

function categories(prevState = initState, action) {
	switch (action.type) {
		case GET_CATEGORIES_SUCCESS:
			return action.data;
		case ADD_CATEGORIES_SUCCESS:
			return [...prevState, action.data]  //先将之前的数据展开，然后再添加到后面更新的action.data中
		case UPDATE_CATEGORY_SUCCESS:
			return prevState.map((category) => {
				if (category._id === action.data._id) {
					//如果id匹配的上就返回修改过的数据
					return action.data
				}
				//如果匹配不上，就返回原来的数据
				return category
			})
		default:
			return prevState
	}
}

export default categories