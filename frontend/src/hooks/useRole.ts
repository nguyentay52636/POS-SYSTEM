import { useEffect, useState } from "react"
import { getAllRoles, IRole } from "@/apis/roleApi"

export const useRole = () => { 
const [roles, setRoles] =useState<IRole[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const fetchRoles = async () => {
    try {
        setLoading(true)
        const data = await getAllRoles()
        setRoles(data)
    } catch (error) {
        setError("Không thể tải danh sách vai trò")
    } finally {
        setLoading(false)
    }
}

useEffect(() => {
    fetchRoles()
}, [])

return {
    roles,
    loading,
    error,
}   
} 