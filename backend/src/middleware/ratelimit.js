import Ratelimit from "../config/upstash.js";

const ratelimiter = async(req,res,next)=>{
    try{
        const {success} = await Ratelimit.limit("my-limit-key");
        if(!success){
            return res.status(429).json({message:"Too many requests"})
        }
        next();
    }
    catch(error){
        console.error("Rate limit error:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export default ratelimiter;

