import baseApi from "./baseApi";

export interface IFeaturePermission {
    featureId: number;
    featureName: string;
}
export const getFeatures = async () => {
    try {
        const { data } = await baseApi.get(`/Feature`);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const addFeature = async (feature: IFeaturePermission) => {
    try {
        const { data } = await baseApi.post(`/Feature`, feature);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const getFeatureById = async (featureId: number) => {
    try {
        const { data } = await baseApi.get(`/Feature/${featureId}`);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const updateFeature = async (featureId: number, feature: IFeaturePermission) => {
    try {
        const { data } = await baseApi.put(`/Feature/${featureId}`, feature);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const deleteFeature = async (featureId: number) => {
    try {
        const { data } = await baseApi.delete(`/Feature/${featureId}`);
        return data;
    } catch (error: any) {
        throw error;
    }
}
