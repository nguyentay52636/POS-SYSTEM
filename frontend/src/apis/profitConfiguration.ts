import baseApi from "./baseApi";

export interface IProfitConfiguration {
    configId: number,
    defaultProfitPercentage: number,
    updatedAt: string,
    updatedByEmployeeId: number
}
export const getProfitConfigurationGlobal = async () => {
    try {
        const { data } = await baseApi.get('/ProfitConfiguration')
        return data
    } catch (error) {
        console.log(error)
    }
}
export interface IUpdateProfitConfiguration {
    defaultProfitPercentage: number,
    updatedByEmployeeId: number
}
export const updateProfitConfigurationGlobal = async (profitConfiguration: IUpdateProfitConfiguration) => {
    try {
        const { data } = await baseApi.put(`/ProfitConfiguration`, profitConfiguration)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}