import proxy from "express-http-proxy"


export const proxyWithHeaders = (serviceURL)=>{
    return proxy(serviceURL,{
        limit:"25mb",
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
            if(srcReq.user){
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }
            return proxyReqOpts
        }
    })
}