import baseApi from "./baseApi";

export interface IProfitRule {
    ruleId: number;
    ruleType: string;
    productId: number;
    profitPercentage: number;
    priority: number;
    employeeId: number;
    status: string;
    createdAt: string;
    updatedAt: string;

}
export const getProfitRules = async (status: string) => {
    try {
        const { data } = await baseApi.get('/Profit-Rule', {
            params: {
                status: status
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }
}
export interface IChangeProfitRule {
    profitPercentage: number,
    priority: number,
    status: string,
    employeeId: number
}
export const changeProfitRule = async (profitRuleId: number, changeProfitRule: IChangeProfitRule) => {
    try {
        const { data } = await baseApi.put(`/ProfitRule/${profitRuleId}`, changeProfitRule)
        return data
    } catch (error) {
        console.log(error)
    }

}
export interface IAddProfitRule {
    productId: number,
    profitPercentage: number,
    priority: number,
    employeeId: number
}
export const addProfitRule = async (profitRule: IAddProfitRule) => {
    try {
        const { data } = await baseApi.post('/ProfitRule', profitRule)
        return data
    } catch (error) {
        console.log(error)
    }
}

export const deleteProfitRule = async (profitRuleId: number) => {
    try {
        const { data } = await baseApi.delete(`/ProfitRule/${profitRuleId}`)
        return data
    } catch (error) {
        console.log(error)
    }
}