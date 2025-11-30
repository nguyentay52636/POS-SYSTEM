"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { PermissionType, FeaturePermission } from "@/apis/rolePermissionsApi"

interface PermissionsTableProps {
    features: FeaturePermission[]
    onPermissionChange: (featureId: number, permission: PermissionType, value: boolean) => void
    onSelectAll: (permission: PermissionType, value: boolean) => void
    onFeatureSelectAll: (featureId: number, value: boolean) => void
}

export function PermisstionTable({
    features,
    onPermissionChange,
    onSelectAll,
    onFeatureSelectAll,
}: PermissionsTableProps) {
    const permissionColumns: { key: PermissionType; label: string }[] = [
        { key: "view", label: "Xem" },
        { key: "create", label: "Thêm" },
        { key: "edit", label: "Sửa" },
        { key: "delete", label: "Xóa" },
        { key: "print", label: "In" },
        { key: "export", label: "Xuất Excel" },
    ]

    const isAllChecked = (permission: PermissionType) => {
        return features.every((feature) => feature.permissions[permission])
    }

    const isFeatureAllChecked = (feature: FeaturePermission) => {
        return Object.values(feature.permissions).every((value) => value)
    }

    const isAllFeaturesAllPermissionsChecked = () => {
        return features.every((feature) => Object.values(feature.permissions).every((value) => value))
    }

    const handleMasterCheckboxChange = (checked: boolean) => {
        features.forEach((feature) => {
            onFeatureSelectAll(feature.featureId, checked)
        })
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 w-12">
                                <Checkbox
                                    checked={isAllFeaturesAllPermissionsChecked()}
                                    onCheckedChange={(checked) => handleMasterCheckboxChange(checked as boolean)}
                                    className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                />
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                Chức năng
                            </th>
                            {permissionColumns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide w-28"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span>{col.label}</span>
                                        <Checkbox
                                            checked={isAllChecked(col.key)}
                                            onCheckedChange={(checked) => onSelectAll(col.key, checked as boolean)}
                                            className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {features.map((feature, index) => (
                            <tr
                                key={feature.featureId}
                                className={`transition-colors hover:bg-green-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                            >
                                <td className="px-4 py-3.5">
                                    <Checkbox
                                        checked={isFeatureAllChecked(feature)}
                                        onCheckedChange={(checked) => onFeatureSelectAll(feature.featureId, checked as boolean)}
                                        className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                    />
                                </td>
                                <td className="px-4 py-3.5 text-sm text-gray-900 font-medium">{feature.featureName}</td>
                                {permissionColumns.map((col) => (
                                    <td key={col.key} className="px-4 py-3.5 text-center">
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={feature.permissions[col.key]}
                                                onCheckedChange={(checked) =>
                                                    onPermissionChange(feature.featureId, col.key, checked as boolean)
                                                }
                                                className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                            />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
