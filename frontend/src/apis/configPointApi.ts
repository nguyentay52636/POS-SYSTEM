import baseApi from "./baseApi"

export interface IConfigPoint {
    configId: number,
    pointsPerUnit: number,
    moneyPerUnit: number,
    isActive: boolean,
    updatedAt: string
}
export interface IUpdateConfigPoint {
    pointsPerUnit: number,
    moneyPerUnit: number
}
export const getConfigPoint = async () => {
    try {
        const { data } = await baseApi.get('/ConfigCustomerPoint')
        return data
    } catch (error) {
        console.log(error)
    }
}
export const updateConfigPoint = async (configPoint: IConfigPoint) => {
    try {
        const { data } = await baseApi.put(`/ConfigCustomerPoint/${configPoint.configId}`, configPoint)
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
