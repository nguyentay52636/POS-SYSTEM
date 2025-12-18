import baseApi from "./baseApi"

export interface IConfigPoint {
    configId: number,
    pointsPerUnit: number,
    moneyPerUnit: number,
    isActive: boolean,
    updatedAt: string,
    updatedByEmployeeId?: number
}

export const getConfigPoint = async () => {
    try {
        const { data } = await baseApi.get('/ConfigCustomerPoint')
        return data
    } catch (error) {
        console.log(error)
    }
}

export interface IUpdateConfigPoint {
    pointsPerUnit: number,
    moneyPerUnit: number,
    updatedByEmployeeId?: number
}
export const updateConfigPoint = async (configPoint: IConfigPoint) => {
    try {
        const { data } = await baseApi.put(`/ConfigCustomerPoint`, configPoint)
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
