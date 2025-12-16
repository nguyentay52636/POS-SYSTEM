using backend.Models;
using backend.Repositories;
using backend.Services;
using backend.Mappings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace backend.Configurations
{
    public static class ServiceExtensions
    {
        public static void AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Database - Use SQL Server for all environments
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                       .ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
            });

            // AutoMapper - Scans the assembly containing UserMappings for all profiles
            services.AddAutoMapper(typeof(UserMappings).Assembly);

            // DI - Core
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IValidationService, ValidationService>();

            // Supplier
            services.AddScoped<ISupplierRepository, SupplierRepository>();
            services.AddScoped<ISupplierService, SupplierService>();

            // Category
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICategoryService, CategoryService>();

            // Product
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductService, ProductService>();

            // Customer
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<ICustomerService, CustomerService>();

            // Config Customer Point
            services.AddScoped<IConfigCustomerPointRepository, ConfigCustomerPointRepository>();
            services.AddScoped<IConfigCustomerPointService, ConfigCustomerPointService>();

            // Promotion
            services.AddScoped<IPromotionRepository, PromotionRepository>();
            services.AddScoped<IPromotionService, PromotionService>();

            // Order
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderService, OrderService>();

            // Inventory
            services.AddScoped<IInventoryRepository, InventoryRepository>();
            services.AddScoped<IInventoryService, InventoryService>();

            // Product-Inventory Status Sync
            services.AddScoped<IProductInventoryStatusSyncService, ProductInventoryStatusSyncService>();

            // Payment
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IPaymentService, PaymentService>();

            // Import Receipt
            services.AddScoped<IImportReceiptRepository, ImportReceiptRepository>();
            services.AddScoped<IImportReceiptService, ImportReceiptService>();

            // Export Receipt
            services.AddScoped<IExportReceiptRepository, ExportReceiptRepository>();
            services.AddScoped<IExportReceiptService, ExportReceiptService>();

            // RBAC
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IRoleService, RoleService>();

            services.AddScoped<IFeatureRepository, FeatureRepository>();
            services.AddScoped<IFeatureService, FeatureService>();

            services.AddScoped<IPermissionTypeRepository, PermissionTypeRepository>();
            services.AddScoped<IPermissionTypeService, PermissionTypeService>();

            services.AddScoped<IRolePermissionRepository, RolePermissionRepository>();
            services.AddScoped<IRolePermissionService, RolePermissionService>();

            // Employee
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            services.AddScoped<IEmployeeService, EmployeeService>();

            // History Services
            services.AddScoped<ICustomerPointsHistoryService, CustomerPointsHistoryService>();
            services.AddScoped<IInventoryHistoryService, InventoryHistoryService>();
            services.AddScoped<IOrderCancellationHistoryService, OrderCancellationHistoryService>();

            // Profit Configuration
            services.AddScoped<IProfitConfigurationService, ProfitConfigurationService>();
            services.AddScoped<IProfitRuleService, ProfitRuleService>();

            // Dashboard
            services.AddScoped<IDashBoardRepository, DashBoardRepository>();
            services.AddScoped<IDashBoardService, DashBoardService>();
        }
    }
}
