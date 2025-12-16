"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { PermissionType, FeaturePermission } from "@/apis/rolePermissionsApi"

interface PermissionsTableProps {
    features: FeaturePermission[]
    onPermissionChange: (
        featureId: number,
        permission: PermissionType,
        value: boolean
    ) => void
    onSelectAll: (permission: PermissionType, value: boolean) => void
    onFeatureSelectAll: (featureId: number, value: boolean) => void
}

export function PermissionsTable({
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

    const isAllChecked = (permission: PermissionType) =>
        features.every((f) => f.permissions[permission])

    const isFeatureAllChecked = (feature: FeaturePermission) =>
        Object.values(feature.permissions).every(Boolean)

    const isAllFeaturesAllPermissionsChecked = () =>
        features.every((f) => Object.values(f.permissions).every(Boolean))

    const handleMasterCheckboxChange = (checked: boolean) => {
        features.forEach((f) => onFeatureSelectAll(f.featureId, checked))
    }

    return (
        <div className="rounded-xl border bg-background">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {/* Master checkbox */}
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={isAllFeaturesAllPermissionsChecked()}
                                    onCheckedChange={(checked) =>
                                        handleMasterCheckboxChange(checked as boolean)
                                    }
                                    className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                />
                            </TableHead>

                            <TableHead className="min-w-[200px]">Chức năng</TableHead>

                            {permissionColumns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className="w-28 text-center align-middle"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-black! dark:text-white!">
                                            {col.label}
                                        </span>
                                        {/* <Checkbox
                                            checked={isAllChecked(col.key)}
                                            onCheckedChange={(checked) =>
                                                onSelectAll(col.key, checked as boolean)
                                            }
                                            className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                        /> */}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {features.map((feature, index) => (
                            <TableRow
                                key={feature.featureId}
                                className={
                                    index % 2 === 0
                                        ? "bg-background"
                                        : "bg-muted/30"
                                }
                            >
                                {/* Feature select all */}
                                <TableCell className="w-12">
                                    <Checkbox
                                        checked={isFeatureAllChecked(feature)}
                                        onCheckedChange={(checked) =>
                                            onFeatureSelectAll(
                                                feature.featureId,
                                                checked as boolean
                                            )
                                        }
                                        className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                    />
                                </TableCell>

                                {/* Feature name */}
                                <TableCell className="font-medium">
                                    {feature.featureName}
                                </TableCell>

                                {/* Permissions */}
                                {permissionColumns.map((col) => (
                                    <TableCell key={col.key} className="text-center">
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={feature.permissions[col.key]}
                                                onCheckedChange={(checked) =>
                                                    onPermissionChange(
                                                        feature.featureId,
                                                        col.key,
                                                        checked as boolean
                                                    )
                                                }
                                                className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                            />
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
