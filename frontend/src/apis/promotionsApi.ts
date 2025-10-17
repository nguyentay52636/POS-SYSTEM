import baseApi from "./baseApi"

export interface Promotion { 
promoId? : number
promoCode?: string
description :string
discountType : string
discountValue : number
startDate : string
endDate : string
minOrderAmount : number
usageLimit : number
usedCount : number
status : string
}
const getAllPromotions = async ()=> {
try {
const {data} = await baseApi.get('/Promotion') ; 
return data; 
}catch (error : any) { 
throw error;
}
}
const addPromotions = async ({promoCode,description,discountType,discountValue,startDate,endDate,minOrderAmount,usageLimit,usedCount,status} : Promotion)=>  {
    const newPromotion =  {
promoCode,
description,
discountType,
discountValue,
startDate,
endDate,
minOrderAmount,
usageLimit,
usedCount,
status
    }
try {
    const {data} = await baseApi.post('/Promotion',newPromotion) ;
    return data;
}catch (error :any) { 
 throw error
}
}
const deletePromotions = async (promotionId : number)=> {
    try {
        const {data} = await baseApi.delete(`/Promotion/${promotionId}`) ;
        return data;
    }catch (error :any) { 
        throw error
    }
 } 
const updatePromotions = async (promotionId : number,promotion : Promotion)=> {
    try {
        const {data} = await baseApi.put(`/Promotion/${promotionId}`,promotion) ;
        return data;
    }catch (error :any) { 
        throw error
    }
}
const  searchPromotions = async (promotionCode : string)=> { 
try {
const {data} = await baseApi.get(`/Promotion/search/${promotionCode}`) ;
return data;
}catch(error:any) {
    throw error
}
} 
const getPromotionActive = async ()=> {
    try {
        const {data} = await baseApi.get('/Promotion/active') ;
        return data;
    }catch(error:any) {
        throw error
    }
}

export {getAllPromotions,addPromotions,deletePromotions,updatePromotions,searchPromotions,getPromotionActive    }
