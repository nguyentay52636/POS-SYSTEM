import baseApi from "./baseApi";

export interface IRevenueChart {
label : string
periodValue :number ; 
revenue :number ; 
orderCount :number ; 
customerCount :number ;
startDate :string ;
endDate :string ;
 }
 
export interface ITopProduct { 
    productId: number
    productName: string
    barcode: string
    categoryName: string
    imageUrl: string
    totalQuantitySold: number
    totalRevenue: number
    growthRate: number
    rank: number
}
export const getChartWeekly = async(year :number,month :number)=> {
    try {
const {data} = await baseApi.get<IRevenueChart[]>(`/Dashboard/revenue/weekly?year=${year}&month=${month}`);
return data;
    }catch(error :any) {
        console.error('Error fetching chart weekly:', error)
        throw error;
    }
}
export const getChartMonthly = async(year :number)=> {
    try {
        const {data} = await baseApi.get<IRevenueChart[]>(`/Dashboard/revenue/monthly?year=${year}`);
    return data;
    }catch(error :any) {
        console.error('Error fetching chart monthly:', error)
    throw error;
    }
}
export const getCharYearly = async()=> { 
try {
const {data} = await baseApi.get<IRevenueChart[]>(`/Dashboard/revenue/yearly`);
return data;
}catch(error :any) {
    console.error('Error fetching chart yearly:', error)
    throw error;
}
} 
export type TopProductPeriod = 'week' | 'month' | 'year' | 'quarter'

export interface ITopProductParams {
    period: TopProductPeriod
    year?: number
    month?: number
    quarter?: number
    topCount?: number
}

export const getTopProducts = async (params: ITopProductParams) => {
    try {
        const currentDate = new Date()
        const queryParams = new URLSearchParams()
        
        queryParams.append('period', params.period)
        queryParams.append('year', String(params.year ?? currentDate.getFullYear()))
        
        if (params.period === 'week' || params.period === 'month') {
            queryParams.append('month', String(params.month ?? currentDate.getMonth() + 1))
        }
        
        if (params.period === 'quarter' && params.quarter) {
            queryParams.append('quarter', String(params.quarter))
        }
        
        queryParams.append('topCount', String(params.topCount ?? 10))
        
        const { data } = await baseApi.get<ITopProduct[]>(`/Dashboard/top-products?${queryParams.toString()}`)
        return data
    } catch (error: any) {
        console.error('Error fetching top products:', error)
        throw error
    }
}

// Convenience functions for each period type
export const getTopProductsWeekly = async (year?: number, month?: number, topCount: number = 10) => {
    return getTopProducts({ period: 'week', year, month, topCount })
}

export const getTopProductsMonthly = async (year?: number, month?: number, topCount: number = 10) => {
    return getTopProducts({ period: 'month', year, month, topCount })
}

export const getTopProductsYearly = async (year?: number, topCount: number = 10) => {
    return getTopProducts({ period: 'year', year, topCount })
}

export const getTopProductsQuarterly = async (year?: number, quarter?: number, topCount: number = 10) => {
    return getTopProducts({ period: 'quarter', year, quarter, topCount })
}
export interface ICategoryChart { 
    categoryId: number,
    category: string,
    revenue: number,
    percentage: number,
    color: string,
}
export const getCategoryChart = async()=> {  
try {
    const {data} = await baseApi.get<ICategoryChart[]>(`/DashBoard/category-revenue`);
    return data;
}catch(error :any) {
    console.error('Error fetching category chart:', error)
    throw error;
}
} 