import api from "../utils/axios.js"

export const createCheckout = async (planId) => {
    try {
        const { data } = await api.post("/api/billing/checkout", { planId })
        return data?.url || null
    } catch (error) {
        console.log(error)
        return null
    }
}
