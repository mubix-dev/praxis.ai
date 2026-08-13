import redis from "../../shared/redis/redis.js"

const isAuth = async(req,res,next)=>{
    try {
        const sessionId = req.cookies?.sessionId
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized Access!"})
        }

        const session = await redis.get(`sessionId-${sessionId}`)
        
        if(!session){
            return res.status(401).json({message:"Session Expired!"})
        }

        req.user = JSON.parse(session)

        next()
    } catch (error) {
        return res.status(500).json({message:`isAuth Error: ${error}`})
    }
}

export default isAuth