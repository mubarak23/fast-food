import axios from "axios"

class BaseService {
    constructor(){
        this.APIKEY = process.env.APP_API_KEY
    }

    refreshToken(){
        this.token = localStorage.getItem("persist:root");
        this.token = this.token && JSON.parse(this.token).auth
        this.token = this.token && JSON.parse(this.token).user
        this.token = this.token && this.token.data.token
    }
    makePagination(meta, link){
        this.refreshToken()
        let pagination = {
            current_page: meta.current_page,
            next_page_url: link.next
              ? `&page=${meta.current_page + 1}`
              : null,
            prev_page_url: link.prev
              ? `&page=${meta.current_page - 1}`
              : null,
            total: meta.total,
            pages: meta.pages
          };
          return pagination;
    }
    async loadData (url, body, method){
        this.refreshToken()
        let error = null
        let res = await axios({
            url:url,
            method:method,
            data:body,
            headers: {
                'Authorization':`Bearer ${this.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            if(err.response.status === 422){
                this.token(null)
                window.location = "/login";
              }
              error = {title:"Error",message:err.response.data.error ? err.response.data.error.message :"Unknown error occured,please try again later" }  
        } )
        return {data:res ? res.data : null, error}
    }
}

export default BaseService