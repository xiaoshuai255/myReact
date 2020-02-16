import { reqGetCategories, addCategory, updateCategory } from "../../api"
import { GET_CATEGORIES_SUCCESS, ADD_CATEGORIES_SUCCESS, UPDATE_CATEGORY_SUCCESS } from '../action-types/category'



const getCategoriesSuccess = (categories) => ({
	type: GET_CATEGORIES_SUCCESS,
	data: categories
})


const addCategoriesSuccess = (category) => ({
	type: ADD_CATEGORIES_SUCCESS,
	data: category
})

const updateCategorySuccess = (category) => ({
	type: UPDATE_CATEGORY_SUCCESS,
	data: category
})


export const getCategoriesAsync = () => {
	return (dispatch) => {
		return reqGetCategories()
			.then((response) => {
				dispatch(getCategoriesSuccess(response))
			})

	}
}


export const addCategoryAsync = (categoryName) => {
	return (dispatch) => {
		return addCategory(categoryName)
			.then((response) => {
				dispatch(addCategoriesSuccess(response))
			})

	}
}


export const updateCategoryAsync = (categoryName, categoryId) => {
	return (dispatch) => {
		return updateCategory(categoryName, categoryId)
			.then((response) => {
				dispatch(updateCategorySuccess(response))
			})

	}
}