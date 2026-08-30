import axios from "axios"

export const deductCredits = async (cost, userId) => {

    const balance = await axios.get(`${process.env.BILLING_SERVICE}/credits`, {
        headers: { "x-user-id": userId },
    })

    if (balance?.data?.credits < cost) {
        const error = new Error(`Insufficient credits for right agent! `)

        error.status = 402
        error.data = {
            success: false,
            message: `Insufficient credits for right agent! `
        }

        throw error
    }

    await axios.post(`${process.env.BILLING_SERVICE}/deduct`,
        { cost },
        {
            headers: {
                "x-internal-key": process.env.INTERNAL_API_KEY,
                "x-user-id": userId,
            }
        },
    )
}