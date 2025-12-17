import baseApi from "./baseApi";

export interface ConfigCustomerPoints {
    configId: number;
    pointsPerUnit: number;
    moneyPerUnit: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export const getConfigCustomerPoints = async () => {
    try {
        const { data } = await baseApi.get<ConfigCustomerPoints[]>('/ConfigCustomerPoint')

        return data
    } catch (error: any) {
        console.error('Error getting config customer points:', error)
        throw error
    }
} 
