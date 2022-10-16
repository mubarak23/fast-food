import BaseService from "./base";
import { PRODUCT_URL, PRODUCT_REVIEW_URL } from "../constants"


class ProductService extends BaseService {

    constructor(){
        super()
        this.PRODUCT_URL = PRODUCT_URL
        this.PRODUCT_REVIEW_URL = PRODUCT_REVIEW_URL
    }

    async getProducts(filters){
        let reqBody = {}
        return this.loadData(`${this.PRODUCT_URL}/?${filters}`, reqBody, "GET")
    }

    async getProduct(id){
        let reqBody = {}
        return this.loadData(`${this.PRODUCT_URL}/${id}`, reqBody, "GET")
    }

    async addProduct(name, price, description, image){
        let reqBody = new FormData()
        reqBody.append("name", name)
        reqBody.append("price", price)
        reqBody.append("description", description)
        image && reqBody.append("image", image)

        return this.loadData(this.PRODUCT_URL, reqBody, "POST")
    }

    async editProduct(name, price, description, image, id){
        let reqBody = new FormData();

        reqBody.append("name", name);
        reqBody.append("price", price);
        reqBody.append("description", description);
        image && reqBody.append("image", image) ;
        return this.loadData(`${this.PRODUCT_URL}/${id}`, reqBody, "PUT")
    }

    async deleteProduct(id){
        let reqBody = {}
        return this.loadData(`${this.PRODUCT_URL}/${id}`, reqBody, "DELETE")
    }

    async addProductReview(rating, comment, id){
        let reqBody = { review:{ rating, comment} }
        return this.loadData(`${this.PRODUCT_REVIEW_URL}/${id}`, reqBody, "POST")
    }

    async editReview(id, rating, comment){
        let reqBody = { review:{ rating, comment} }
        return this.loadData(`${this.PRODUCT_REVIEW_URL}/${id}`, reqBody, "PUT")
    }

    async deleteReview(id){
        let reqBody = {}
        return this.loadData(`${this.PRODUCT_REVIEW_URL}/${id}`, reqBody, "DELETE")
    }
}

export default ProductService