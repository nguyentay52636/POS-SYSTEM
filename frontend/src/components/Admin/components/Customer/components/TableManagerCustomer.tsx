import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Filter, Users, Mail, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Customer } from "@/apis/customerApi";

type Props = {
  customers: Customer[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  busy?: boolean;
};

export default function TableManagerCustomer({
  customers,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  busy = false,
}: Props) {
  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span>Danh sách khách hàng</span>
            </CardTitle>
            <CardDescription>
              Quản lý và theo dõi khách hàng ({customers.length} khách hàng)
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                <TableRow>
                  <TableHead className="font-semibold">Khách hàng</TableHead>
                  <TableHead className="font-semibold">Liên hệ</TableHead>
                  <TableHead className="font-semibold">Địa chỉ</TableHead>
                  <TableHead className="font-semibold">Hành Động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customers.map((c, index) => (
                  <TableRow key={c.customerId ?? `${c.name}-${index}`}> 
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                          <AvatarImage src={"/placeholder.svg"} alt={c.name || "Customer"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {(c.name || "?").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {c.name ?? "(Chưa có tên)"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {c.customerId ?? "-"}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1">
                          <Phone className="h-3 w-3 mr-2 text-green-600" />
                          <span>{c.phone || "-"}</span>
                        </div>
                        <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1">
                          <Mail className="h-3 w-3 mr-2 text-blue-600" />
                          <span>{c.email || "-"}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1">
                        <MapPin className="h-3 w-3 mr-2 text-rose-600" />
                        <span className="truncate max-w-[280px]">{c.address || "-"}</span>
                      </div>
                    </TableCell>


                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => c.customerId && onEdit(c.customerId)}
                        disabled={busy}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => c.customerId && onDelete(c.customerId)}
                        disabled={busy}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xoá
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Không có khách hàng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
