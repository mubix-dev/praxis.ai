import api from "../utils/axios.js"

export const getCredits = async()=>{
    try {
        const {data} = await api.get("/api/billing/credits")
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}