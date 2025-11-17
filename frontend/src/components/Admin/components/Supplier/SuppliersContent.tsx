"use client"

import { useState, useEffect } from "react"
import { ISupplier, SanPham } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/TableManagerSupplier/SearchAction"
import ManagerTableSuppliers from "./components/TableManagerSupplier/ManagerTableSuppliers"
import PaginationSuppliers from "./components/TableManagerSupplier/PaginationSuppliers"
import HeaderManagerSupplier from "./components/HeaderManagerSupplier"
import ImportCard from "./components/Dialog/ImportCard/ImportCard"
import ViewDetailsSuppliers from "./components/Dialog/ViewDetailsSuppliers/ViewDetailsSuppliers"
import DialogEditSupplier from "./components/Dialog/EditSupplier/DialogEditSupplier"
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, CreateSupplierDTO, UpdateSupplierDTO } from "@/apis/supplierApi"
import { toast } from "sonner"

export default function SuppliersContent() {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

    // Normalize supplier data để xử lý naming convention inconsistency
    const normalizeSupplier = (supplier: any): ISupplier => {
        return {
            ...supplier,
            supplier_id: supplier.supplier_id || supplier.supplierId,
            supplierId: supplier.supplierId || supplier.supplier_id
        }
    }

    // Mock products data for ViewDetailsSuppliers
    const mockProducts: SanPham[] = [
        {
            maSanPham: "SP001",
            tenSanPham: "Táo đỏ New Zealand",
            donVi: "kg",
            soLuongTon: 100,
            maThuongHieu: "TH001",
            maDanhMuc: "DM001",
            maLoai: "L001",
            moTa: "Táo nhập khẩu từ New Zealand",
            giaBan: 85000,
            giaNhap: 65000,
            hinhAnh: "/images/products/apple-red.jpg",
            xuatXu: "New Zealand",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Trái cây",
            brandName: "Fresh",
            typeName: "Trái cây tươi"
        },
        {
            maSanPham: "SP002",
            tenSanPham: "Cam Valencia",
            donVi: "kg",
            soLuongTon: 150,
            maThuongHieu: "TH001",
            maDanhMuc: "DM001",
            maLoai: "L001",
            moTa: "Cam nhập khẩu",
            giaBan: 45000,
            giaNhap: 35000,
            hinhAnh: "/images/products/orange.jpg",
            xuatXu: "Tây Ban Nha",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Trái cây",
            brandName: "Fresh",
            typeName: "Trái cây tươi"
        },
        {
            maSanPham: "SP003",
            tenSanPham: "Rau xà lách",
            donVi: "bó",
            soLuongTon: 80,
            maThuongHieu: "TH002",
            maDanhMuc: "DM002",
            maLoai: "L002",
            moTa: "Rau tươi",
            giaBan: 15000,
            giaNhap: 10000,
            hinhAnh: "/images/products/lettuce.jpg",
            xuatXu: "Việt Nam",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Rau củ",
            brandName: "Fresh",
            typeName: "Rau củ"
        },
        {
            maSanPham: "SP004",
            tenSanPham: "Thịt bò thăn",
            donVi: "kg",
            soLuongTon: 50,
            maThuongHieu: "TH003",
            maDanhMuc: "DM003",
            maLoai: "L003",
            moTa: "Thịt bò nhập khẩu",
            giaBan: 450000,
            giaNhap: 380000,
            hinhAnh: "/images/products/beef.jpg",
            xuatXu: "Úc",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Thịt",
            brandName: "Premium",
            typeName: "Thịt tươi"
        },
        {
            maSanPham: "SP005",
            tenSanPham: "Cá hồi fillet",
            donVi: "kg",
            soLuongTon: 30,
            maThuongHieu: "TH004",
            maDanhMuc: "DM004",
            maLoai: "L004",
            moTa: "Cá hồi Na Uy",
            giaBan: 320000,
            giaNhap: 280000,
            hinhAnh: "/images/products/salmon.jpg",
            xuatXu: "Na Uy",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Hải sản",
            brandName: "Premium",
            typeName: "Hải sản tươi"
        },
        {
            maSanPham: "SP006",
            tenSanPham: "Nước suối Lavie",
            donVi: "chai",
            soLuongTon: 200,
            maThuongHieu: "TH005",
            maDanhMuc: "DM005",
            maLoai: "L005",
            moTa: "Nước suối tinh khiết",
            giaBan: 8000,
            giaNhap: 6000,
            hinhAnh: "/images/products/water.jpg",
            xuatXu: "Việt Nam",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Đồ uống",
            brandName: "Lavie",
            typeName: "Nước uống"
        }
    ]

    // Fetch suppliers on component mount
    useEffect(() => {
        fetchSuppliers()
    }, [])

    const fetchSuppliers = async () => {
        try {
            setLoading(true)
            const data = await getAllSuppliers()
            // Normalize data để xử lý naming convention
            const normalizedData = data.map(normalizeSupplier)
            console.log("Fetched and normalized suppliers:", normalizedData)
            setSuppliers(normalizedData)
        } catch (error) {
            console.error("Error fetching suppliers:", error)
            toast.error("Không thể tải danh sách nhà cung cấp")
        } finally {
            setLoading(false)
        }
    }

    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.supplier_id.toString().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || supplier.trangThai === statusFilter

        return matchesSearch && matchesStatus
    })

    const totalSuppliers = suppliers.length
    const activeSuppliers = suppliers.filter(s => s.trangThai === "active").length
    const inactiveSuppliers = suppliers.filter(s => s.trangThai === "inactive").length

    const handleAddSupplier = async (data: CreateSupplierDTO) => {
        try {
            const newSupplier = await addSupplier(data)
            const normalizedSupplier = normalizeSupplier(newSupplier)
            setSuppliers([...suppliers, normalizedSupplier])
            setIsAddDialogOpen(false)
            toast.success("Thêm nhà cung cấp thành công!")
        } catch (error) {
            console.error("Error adding supplier:", error)
            toast.error("Không thể thêm nhà cung cấp")
            throw error
        }
    }

    const handleEditSupplier = async (supplierId: number, data: UpdateSupplierDTO) => {
        if (!supplierId) {
            toast.error("Lỗi: Không tìm thấy mã nhà cung cấp")
            return
        }

        try {
            console.log("Updating supplier with ID:", supplierId, "Data:", data)
            const updatedSupplier = await updateSupplier(supplierId, data)
            console.log("Updated supplier from API:", updatedSupplier)

            // Normalize supplier data trước khi cập nhật vào state
            const normalizedSupplier = normalizeSupplier(updatedSupplier)
            console.log("Normalized supplier:", normalizedSupplier)

            // Cập nhật danh sách suppliers - xử lý cả supplier_id và supplierId
            setSuppliers(suppliers.map((s) => {
                const currentId = s.supplier_id || s.supplierId
                const isMatch = currentId === supplierId
                console.log(`Comparing supplier ${s.name}: currentId=${currentId}, supplierId=${supplierId}, match=${isMatch}`)
                return isMatch ? normalizedSupplier : s
            }))

            setIsEditDialogOpen(false)
            setSelectedSupplier(null)
            toast.success("Cập nhật nhà cung cấp thành công!")
        } catch (error) {
            console.error("Error updating supplier:", error)
            toast.error("Không thể cập nhật nhà cung cấp")
        }
    }

    const handleDeleteSupplier = async (supplierId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) return

        try {
            await deleteSupplier(supplierId)
            // Xử lý cả supplier_id và supplierId khi filter
            setSuppliers(suppliers.filter((s) => {
                const currentId = s.supplier_id || s.supplierId
                return currentId !== supplierId
            }))
            toast.success("Xóa nhà cung cấp thành công!")
        } catch (error) {
            console.error("Error deleting supplier:", error)
            toast.error("Không thể xóa nhà cung cấp")
        }
    }

    const handleImportGoods = (data: {
        ngayNhap: string
        chiTietPhieuNhap: any[]
        tongTien: number
    }) => {
        console.log("Import goods data:", data)
        setIsImportDialogOpen(false)
        setSelectedSupplier(null)
        toast.success("Nhập hàng thành công!")
    }

    if (loading) {
        return (
            <div className=" to-white p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className=" p-6">
            <div className="mx-auto space-y-6">
                <HeaderManagerSupplier
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    handleAddSupplier={handleAddSupplier}
                />
                <StatsCard
                    totalSuppliers={totalSuppliers}
                    activeSuppliers={activeSuppliers}
                    inactiveSuppliers={inactiveSuppliers}
                />
                <SearchAction
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
                <ManagerTableSuppliers
                    suppliers={suppliers}
                    filteredSuppliers={filteredSuppliers}
                    setSelectedSupplier={setSelectedSupplier}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteSupplier={handleDeleteSupplier}
                />

                <PaginationSuppliers totalItems={filteredSuppliers.length} />

                <ViewDetailsSuppliers
                    mockProducts={mockProducts}
                    isDetailDialogOpen={isDetailDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                />

                <ImportCard
                    isImportDialogOpen={isImportDialogOpen}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    selectedSupplier={selectedSupplier}
                    setSelectedSupplier={setSelectedSupplier}
                    handleImportGoods={handleImportGoods}
                />

                <DialogEditSupplier
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    selectedSupplier={selectedSupplier}
                    handleEditSupplier={handleEditSupplier}
                />
            </div>
        </div>
    )
}
