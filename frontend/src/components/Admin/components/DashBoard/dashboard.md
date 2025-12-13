Dashboard API Endpoints
1. Main Dashboard
Method	Endpoint	Description
GET	/api/dashboard	Lấy toàn bộ thống kê dashboard
GET	/api/dashboard/overview	Lấy tổng quan (doanh thu, đơn hàng, khách hàng)
2. Revenue Chart APIs
Method	Endpoint	Description
GET	/api/dashboard/revenue-chart	Lấy dữ liệu biểu đồ theo period
GET	/api/dashboard/revenue/monthly	Thống kê theo tháng (12 tháng)
GET	/api/dashboard/revenue/weekly	Thống kê theo tuần trong tháng
GET	/api/dashboard/revenue/quarterly	Thống kê theo quý (4 quý)
GET	/api/dashboard/revenue/yearly	Thống kê theo năm (5 năm gần nhất)
3. Other Statistics
Method	Endpoint	Description
GET	/api/dashboard/top-products	Top sản phẩm bán chạy
GET	/api/dashboard/category-revenue	Doanh thu theo danh mục
GET	/api/dashboard/order-status	Thống kê trạng thái đơn hàng
GET	/api/dashboard/trend	So sánh xu hướng với kỳ trước
GET	/api/dashboard/daily	Doanh thu theo ngày
GET	/api/dashboard/hourly	Doanh thu theo giờ

period: "week" | "month" | "quarter" | "year"
year: số năm (default: năm hiện tại)
month: 1-12 (cho thống kê tuần)
quarter: 1-4 (cho thống kê quý)
topCount: 1-50 (số sản phẩm top, default: 10)
fromDate: DateTime (custom range)
toDate: DateTime (custom range)


GET /api/dashboard?period=month&year=2025 - Thống kê theo tháng
GET /api/dashboard?period=week&year=2025&month=12 - Thống kê theo tuần
GET /api/dashboard?period=quarter&year=2025 - Thống kê theo quý
GET /api/dashboard/top-products?period=month&topCount=5 - Top 5 s

API Response sẽ trả về như sau:
1. Revenue Chart (Biểu đồ doanh thu):
{  "label": "T12",  "periodValue": 12,  "revenue": 38000,  "orderCount": 1,  "customerCount": 0,  "startDate": "2025-12-01",  "endDate": "2025-12-31"}

2. Top Products (Sản phẩm bán chạy):
{  "productId": 14,  "productName": "sữa Milo",  "categoryName": "Gia vị",  "imageUrl": "http://localhost:5006/uploads/images/...",  "totalQuantitySold": 8,  "totalRevenue": 96000,  "growthRate": 15,  "rank": 1
}





Trường	Giá trị ví dụ	Ý nghĩa
label	"T12"	Nhãn hiển thị trên biểu đồ. "T12" = Tháng 12. Tùy theo period: "Tuần 1", "Q1", "2025"
periodValue	12	Giá trị số của kỳ thống kê. Ở đây là tháng 12
revenue	38000	Tổng doanh thu trong kỳ này (VNĐ). Tính bằng SUM(Order.TotalAmount) của các đơn hàng status = "paid"
orderCount	1	Số lượng đơn hàng trong kỳ này. Có 1 đơn hàng trong tháng 12
customerCount	0	Số khách hàng khác nhau đã mua trong kỳ. Bằng 0 vì đơn hàng có customerId = null
startDate	"2025-12-01"	Ngày bắt đầu của kỳ thống kê (đầu tháng 12)
endDate	"2025-12-31"	Ngày kết thúc của kỳ thống kê (cuối tháng 12)


thống kê sản phẩm bán chạy :
# Top 10 sản phẩm tuần này
GET /api/dashboard/top-products/weekly

# Top 5 sản phẩm tuần này
GET /api/dashboard/top-products/weekly?topCount=5

# Top 10 sản phẩm tháng 12/2025
GET /api/dashboard/top-products/monthly?year=2025&month=12

# Top 10 sản phẩm năm 2025
GET /api/dashboard/top-products/yearly?year=2025
--------===============-----------
[
  {
    "productId": 14,
    "productName": "sữa Milo",
    "barcode": "12317223",
    "categoryName": "Gia vị",
    "imageUrl": "http://localhost:5006/uploads/images/...",
    "totalQuantitySold": 1250,
    "totalRevenue": 45200000,
    "growthRate": 15.5,
    "rank": 1
  },
  {
    "productId": 8,
    "productName": "Bánh mì Kinh Đô",
    "totalQuantitySold": 980,
    "totalRevenue": 32800000,
    "growthRate": 8,
    "rank": 2
  }
  // ...
]