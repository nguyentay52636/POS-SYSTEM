using backend.Configurations;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using backend.Mappings;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddControllers();

// Database
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseInMemoryDatabase("dev-db"));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
    );
}

// AutoMapper
builder.Services.AddAutoMapper(typeof(UserMappings), typeof(SupplierMappings));

// DI
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IValidationService, ValidationService>();

// Supplier
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ISupplierService, SupplierService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "POS System API v1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();

app.MapControllers();

// Seed sample users in Development for testing
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (!db.Users.Any())
    {
        db.Users.AddRange(
            new User { Username = "john", Password = "secret", FullName = "John Doe", Role = "staff", CreatedAt = DateTime.UtcNow },
            new User { Username = "alice", Password = "pw", FullName = "Alice", Role = "staff", CreatedAt = DateTime.UtcNow },
            new User { Username = "bob", Password = "pw", FullName = "Bob", Role = "admin", CreatedAt = DateTime.UtcNow }
        );
        db.SaveChanges();
    }

    // Seed sample suppliers for testing
    if (!db.Suppliers.Any())
    {
        db.Suppliers.AddRange(
            new Supplier { Name = "ABC Suppliers Inc", Address = "123 Main St, New York, NY", Email = "contact@abc-suppliers.com", Phone = "+1-555-0100" },
            new Supplier { Name = "Global Trade Co", Address = "456 Commerce Ave, Los Angeles, CA", Email = "info@globaltrade.com", Phone = "+1-555-0200" },
            new Supplier { Name = "Premium Products Ltd", Address = "789 Business Blvd, Chicago, IL", Email = "sales@premiumproducts.com", Phone = "+1-555-0300" }
        );
        db.SaveChanges();
    }
}

app.Run();

