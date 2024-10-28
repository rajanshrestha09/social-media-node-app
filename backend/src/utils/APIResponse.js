class APIResponse {
    constructor(success, message, statusCode, data){
        this.success = success
        this.message = message
        this.statusCode = statusCode
        if(data){
            this.data = data
        }
    }

   static successMethod(success = true , message = "Successful", statusCode , data){
    return new APIResponse(success, message, statusCode, data)
   }

   static errorMethod(success = false, message="Error", statusCode){
    return new APIResponse(success, message, statusCode)
   }
}


export default APIResponse