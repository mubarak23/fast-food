import BaseService from "./base"
import { ORDER_URL  } from "../constants"


class myOrderService extends BaseService {
    constructor(){
        super()
        this.ORDER_URL = ORDER_URL
    }

    async getOrders(filters) {
        let requestBody = {}
        return this.loadData(`${this.ORDER_URL}?${filters}`, requestBody, "GET")
    }

    async getOrder(id){
        let requestBody = {}
        return this.loadData(`${this.ORDER_URL}/${id}`, requestBody, "GET")
    }

    async addOrder(data){
        let requestBody = data
        return this.loadData(this.ORDER_URL, requestBody, "POST")
    }

    async updateStatus(id,status) {
        let requestBody = {mode:status};
        return await this.loadData(`${this.ORDER_URL}/status/${id}`, requestBody, "PUT");
    }


    async editOrderDetails (id, data){
        let requestBody = data;
        return this.loadData(`${this.ORDER_URL}/${id}`, requestBody, "PUT")
    }
    
    async deleteOrder (id){
        let requestBody = {}
        return this.loadData(`${this.ORDER_URL}/${id}`, requestBody, "DELETE")
    }

}

export default new myOrderService()