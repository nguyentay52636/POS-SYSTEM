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
productId :number ; 
productName :string ;
categoryName :string ;
imageUrl :string ;
totalQuantitySold :number ;
totalRevenue :number ;
growthRate :number ;
rank :number ;
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