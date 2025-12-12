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