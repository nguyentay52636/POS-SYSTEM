"use client"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { IRole } from "@/apis/roleApi"

interface RoleSelectorProps {
    roles: IRole[]
    selectedRole: IRole | null
    onRoleChange: (role: IRole) => void
}

export function RoleSelector({ roles, selectedRole, onRoleChange }: RoleSelectorProps) {
    return (
        <div className="space-y-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300 h-10 text-sm font-medium"
                    >
                        <span className="text-gray-900">{selectedRole?.roleName || "Chọn vai trò"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) bg-white border-gray-200">
                    {roles.map((role, index) => (
                        <div key={role.roleId}>
                            <DropdownMenuItem
                                onClick={() => onRoleChange(role)}
                                className={cn(
                                    "flex items-center justify-between cursor-pointer py-2.5 px-3",
                                    selectedRole?.roleId === role.roleId && "bg-green-50",
                                )}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-gray-900">{role.roleName}</span>
                                    <span className="text-xs text-gray-500">{role.description}</span>
                                </div>
                                {selectedRole?.roleId === role.roleId && (
                                    <Check className="h-4 w-4 text-green-700 flex-shrink-0 ml-2" />
                                )}
                            </DropdownMenuItem>
                            {index < roles.length - 1 && <DropdownMenuSeparator className="bg-gray-100" />}
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
