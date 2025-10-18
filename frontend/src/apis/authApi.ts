import baseApi from "./baseApi"
 export interface User { 
username : string
password : string
full_name : string
role?: string
createdAt?: string
updatedAt?: string
 }
 export interface registerDto {
username : string
password : string
full_name : string
 }
export const login = async (username: string, password: string) => { 
    try {
        const response = await baseApi.post('/Auth/login', { username, password })
        return response.data
    } catch (error) {
        console.error('Error logging in:', error)
        throw error
    }
} 
export const register = async ({username, password, full_name}: registerDto) => { 
    try {
        const {data} = await baseApi.post('/Auth/register', { username, password, full_name })
        return data;
    } catch (error) {
        console.error('Error registering:', error)
        throw error
    }
 } 