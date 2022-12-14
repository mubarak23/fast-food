import { SET_PRODUCT,APPEND_PRODUCT,EDIT_PRODUCT,DELETE_PRODUCT } from "../types"
import { showMessage } from "./toastr"
import { setLoader,setPagination,setPageState } from "./loader"
import { product } from "../services"

let toastrInfoOption = {
    icon: 'success',
    status: 'success'
}

function productFailed (res,add = ""){
    return async (dispatch) => {
      showMessage(res.error.title,res.error.message+add, {icon:'error', status:'error'}) (dispatch);
    }
}


export function getAllProducts(filters, page={}){
    let failMessage = "Refresh the page"
    return async (dispatch) => {
        page.next_page_url ? dispatch(setPageState(true)):dispatch(setLoader(true))
        let res = await product.getProducts(`${filters}${page.next_page_url ? page.next_page_url : ''}`);
        page.next_page_url ? dispatch(setPageState(false)):dispatch(setLoader(false))
        if(!res.data) return productFailed(res, failMessage)(dispatch)
        if(page.next_page_url){
            dispatch({
                type: APPEND_PRODUCT,
                payload: { product: res.data}
            })
        }else{
            dispatch({
                type: SET_PRODUCT,
                payload: { product: res.data}
            })
        }
        let paginate = product.makePagination(
            { current_page: res.data.page, total: res.data.total },
            { prev: res.data.prev, next: res.data.next }
            )
          dispatch(setPagination(paginate))
          showMessage('Success',"Items have been fetched", toastrInfoOption) (dispatch);
        return true  
    }
}


export function addProduct(name, price, description, image){
    return async (dispatch) => {
        dispatch(setLoader(true))
        let res = await product.addProduct(name, price, description, image)
        dispatch(setLoader(false))
        if(!res.data) return productFailed(res)(dispatch)
        showMessage('Success', 'Meal Item Added Successfully', toastrInfoOption)(dispatch)
        return true
    }
}

export function editProduct(id, name, price, description, image){
    return async (dispatch) => {
        dispatch(setLoader(true))
        let res = await product.editproduct(name, price, description, id, image)
        dispatch(setLoader(false))
        if(!res.data) return productFailed(res)(dispatch)
        dispatch({
            type: EDIT_PRODUCT,
            payload: { product: res.data}
        })
        showMessage('Success',"Meal Item has been updated", toastrInfoOption) (dispatch);
        return true
    }
}

export function deleteProduct(id){
    return async (dispatch) => {
        dispatch(setLoader(true))
        let res = await product.deleteProduct(id)
        dispatch(setLoader(false))
        if(!res.data) return productFailed(res)(dispatch)
        dispatch({
            type: DELETE_PRODUCT,
            payload: { product: res.data}
        })
        showMessage('Success',"Meal Item has been deleted", toastrInfoOption) (dispatch);
        return true
    }
}


export function addReview(rating, comment, id){
    let failMessage =''
    return async (dispatch) => {
        dispatch(setLoader(true))
        let res = await product.addReview(id, rating, comment)
        dispatch(setLoader(false))
        if(!res.data) return productFailed(res, failMessage)(dispatch)
        dispatch({
            type: EDIT_PRODUCT,
            payload: { product: res.data}
        })
        showMessage('Success',"Review has been added", toastrInfoOption) (dispatch);
        return true
    }
}

export function editReview(id,rating,comment){
    let failureMessage = '';
    return async (dispatch) => {
        dispatch(setLoader(true))
        let res = await product.editReview(id,rating,comment);
        dispatch(setLoader(false))
        if (!res.data) return productFailed(res,failureMessage)(dispatch);
          dispatch({
            type: EDIT_PRODUCT,
            payload: { product: res.data },
        });
        showMessage('Success',"Review has been edited", toastrInfoOption) (dispatch);
        return true
    };
  }

  
  export function deleteReview(id){
    let failureMessage = '';
    return async (dispatch) => {
        dispatch(setLoader(true))
        let res = await product.deleteReview(id);
        dispatch(setLoader(false))
        if (!res.data) return productFailed(res,failureMessage)(dispatch);
          dispatch({
            type: EDIT_PRODUCT,
            payload: { product: res.data },
        });
        showMessage('Success',"Review has been deleted", toastrInfoOption) (dispatch);
        return true
    };
}

