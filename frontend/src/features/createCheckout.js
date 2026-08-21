import api from "../utils/axios.js"

export const createCheckout = async (planId) => {
    try {
        const { data } = await api.post("/api/billing/checkout", { planId })
        return { url: data?.url || null }
    } catch (error) {
        console.log(error)
        return { error: error.response?.data?.message || "Something went wrong. Please try again." }
    }
}
