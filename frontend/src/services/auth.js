import BaseService from './base'
import { REGISTER_URL, LOGIN_URL } from '../constants';

class AuthService extends BaseService{
    constructor(){
        super()
        this.LOGIN_URL = LOGIN_URL;
        this.REGISTER_URL = REGISTER_URL
    }
    async login(email, password){
        const requestBody = {email, password}
        return await this.loadData(LOGIN_URL, requestBody, 'POST')
    }

    async register (name, phone, email, password){
            const requestBody = { name, phone, email, password}
            return await this.loadData(this.REGISTER_URL, requestBody, 'POST')
    }
}

export default new AuthService()