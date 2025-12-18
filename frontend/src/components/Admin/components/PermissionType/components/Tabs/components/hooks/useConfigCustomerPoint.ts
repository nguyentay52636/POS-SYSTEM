import { useState, useEffect, useCallback } from "react"
import { getConfigPoint, updateConfigPoint, type IConfigPoint } from "@/apis/configPointApi"
import { type PointsConfig, DEFAULT_CONFIG } from "../PointsConversion/types"

export const useConfigCustomerPoint = () => {
    const [config, setConfig] = useState<PointsConfig>(DEFAULT_CONFIG)
    const [loading, setLoading] = useState(false)
    const [apiConfig, setApiConfig] = useState<IConfigPoint | null>(null)

    const fetchConfig = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getConfigPoint()
            let active: IConfigPoint | null = null

            if (Array.isArray(data)) {
                // Find active config or take the first one
                active = data.find((c: any) => c.isActive) || data[0]
            } else if (data) {
                active = data as IConfigPoint
            }

            if (active) {
                setApiConfig(active)
                setConfig(prev => ({
                    ...prev,
                    points: active!.pointsPerUnit,
                    amount: active!.moneyPerUnit,
                }))
            }
        } catch (error) {
            console.error("Failed to fetch config points:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchConfig()
    }, [fetchConfig])

    const updateConfig = async (newConfig: PointsConfig) => {
        setLoading(true)
        try {
            if (!apiConfig) {
                console.error("No configuration loaded to update")
                return false
            }

            const payload: IConfigPoint = {
                ...apiConfig,
                pointsPerUnit: newConfig.points,
                moneyPerUnit: newConfig.amount,
                updatedAt: new Date().toISOString()
            }

            await updateConfigPoint(payload)
            await fetchConfig()
            return true
        } catch (error) {
            console.error("Failed to update config:", error)
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        config,
        setConfig, // Allow local updates before save
        loading,
        updateConfig,
        refresh: fetchConfig
    }
}