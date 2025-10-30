using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IOrderService
{
    Task<OrderResponseDto> CreateAsync(CreateOrderDto dto);
    Task<OrderDetailResponseDto?> GetByIdAsync(int id);
    Task<OrderResponseDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto);
    Task<bool> CancelOrderAsync(int id);
    Task<PagedResponse<OrderResponseDto>> SearchAsync(OrderQueryParams query);
    Task<OrderResponseDto[]> ListAllAsync();
    Task<OrderItemResponseDto[]> GetOrderItemsAsync(int orderId);
    Task<PaymentResponseDto[]> GetPaymentsAsync(int orderId);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly IProductRepository _productRepo;
    private readonly IPromotionRepository _promotionRepo;
    private readonly ICustomerRepository _customerRepo;
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public OrderService(
        IOrderRepository orderRepo,
        IProductRepository productRepo,
        IPromotionRepository promotionRepo,
        ICustomerRepository customerRepo,
        IUserRepository userRepo,
        IMapper mapper)
    {
        _orderRepo = orderRepo;
        _productRepo = productRepo;
        _promotionRepo = promotionRepo;
        _customerRepo = customerRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<OrderResponseDto> CreateAsync(CreateOrderDto dto)
    {
        // Validate user exists
        var user = await _userRepo.GetByIdAsync(dto.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {dto.UserId} not found");
        }

        // Validate customer if provided
        if (dto.CustomerId.HasValue)
        {
            var customer = await _customerRepo.GetByIdAsync(dto.CustomerId.Value);
            if (customer == null)
            {
                throw new ArgumentException($"Customer with ID {dto.CustomerId} not found");
            }
        }

        // Validate all products exist and get their details
        decimal subtotalBeforeDiscount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in dto.OrderItems)
        {
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {item.ProductId} not found");
            }

            var orderItem = _mapper.Map<OrderItem>(item);
            orderItems.Add(orderItem);
            subtotalBeforeDiscount += item.Price * item.Quantity;
        }

        // Handle promotion if provided
        decimal discountAmount = 0;
        int? promoId = dto.PromoId;

        if (!string.IsNullOrWhiteSpace(dto.PromoCode))
        {
            var promotion = await _promotionRepo.GetByPromoCodeAsync(dto.PromoCode);
            if (promotion == null)
            {
                throw new ArgumentException($"Promotion code '{dto.PromoCode}' not found");
            }

            // Validate promotion
            var now = DateTime.Now;
            if (promotion.Status != "active")
            {
                throw new ArgumentException("Promotion is not active");
            }
            if (promotion.StartDate > now || promotion.EndDate < now)
            {
                throw new ArgumentException("Promotion is not valid at this time");
            }
            if (promotion.UsageLimit > 0 && promotion.UsedCount >= promotion.UsageLimit)
            {
                throw new ArgumentException("Promotion usage limit has been reached");
            }

            // Calculate discount
            if (promotion.DiscountType == "percent")
            {
                discountAmount = subtotalBeforeDiscount * (promotion.DiscountValue ?? 0) / 100;
            }
            else if (promotion.DiscountType == "fixed")
            {
                discountAmount = promotion.DiscountValue ?? 0;
            }

            // Check minimum order amount
            if (promotion.MinOrderAmount > 0 && subtotalBeforeDiscount < promotion.MinOrderAmount)
            {
                throw new ArgumentException($"Minimum order amount of {promotion.MinOrderAmount:C} required for this promotion");
            }

            promoId = promotion.PromoId;

            // Increment promotion used count
            promotion.UsedCount = (promotion.UsedCount ?? 0) + 1;
            await _promotionRepo.UpdateAsync(promotion);
        }
        else if (dto.PromoId.HasValue)
        {
            var promotion = await _promotionRepo.GetByIdAsync(dto.PromoId.Value);
            if (promotion != null)
            {
                // Calculate discount
                if (promotion.DiscountType == "percent")
                {
                    discountAmount = subtotalBeforeDiscount * (promotion.DiscountValue ?? 0) / 100;
                }
                else if (promotion.DiscountType == "fixed")
                {
                    discountAmount = promotion.DiscountValue ?? 0;
                }
            }
        }

        // Create order
        var order = _mapper.Map<Order>(dto);
        order.PromoId = promoId;
        order.DiscountAmount = discountAmount;
        order.TotalAmount = subtotalBeforeDiscount - discountAmount;
        order = await _orderRepo.CreateAsync(order);

        // Add order items
        foreach (var item in orderItems)
        {
            item.OrderId = order.OrderId;
        }
        await _orderRepo.AddOrderItemsAsync(orderItems);

        // Get and return full order details
        return await GetOrderResponseDtoAsync(order.OrderId);
    }

    public async Task<OrderDetailResponseDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepo.GetByIdAsync(id);
        if (order == null) return null;

        var orderDto = _mapper.Map<OrderDetailResponseDto>(order);

        // Get customer details
        if (order.CustomerId.HasValue)
        {
            var customer = await _customerRepo.GetByIdAsync(order.CustomerId.Value);
            if (customer != null)
            {
                orderDto.CustomerName = customer.Name;
                orderDto.CustomerEmail = customer.Email;
                orderDto.CustomerPhone = customer.Phone;
            }
        }

        // Get user details
        if (order.UserId.HasValue)
        {
            var user = await _userRepo.GetByIdAsync(order.UserId.Value);
            if (user != null)
            {
                orderDto.UserName = user.Username;
            }
        }

        // Get promotion details
        if (order.PromoId.HasValue)
        {
            var promotion = await _promotionRepo.GetByIdAsync(order.PromoId.Value);
            if (promotion != null)
            {
                orderDto.PromoCode = promotion.PromoCode;
                orderDto.PromoDescription = promotion.Description;
            }
        }

        // Get order items
        var orderItems = await _orderRepo.GetOrderItemsByOrderIdAsync(id);
        orderDto.OrderItems = new List<OrderItemResponseDto>();

        foreach (var item in orderItems)
        {
            var itemDto = _mapper.Map<OrderItemResponseDto>(item);
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                itemDto.ProductName = product.ProductName;
                itemDto.Barcode = product.Barcode;
            }
            orderDto.OrderItems.Add(itemDto);
        }

        // Get payments
        var payments = await _orderRepo.GetPaymentsByOrderIdAsync(id);
        orderDto.Payments = _mapper.Map<List<PaymentResponseDto>>(payments);

        return orderDto;
    }

    public async Task<OrderResponseDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        var order = await _orderRepo.GetByIdAsync(id);
        if (order == null) return null;

        // Chuẩn hoá trạng thái hiện tại và trạng thái mới về EN: pending|paid|canceled
        var current = NormalizeStatus(order.Status);            // "pending" | "paid" | "canceled"
        var target  = NormalizeStatus(dto.Status);              // map "DaDuyet" -> "paid", "ChoDuyet" -> "pending", ...

        // Rule chặn
        if (current == "canceled")
            throw new ArgumentException("Cannot update status of a canceled order");

        if (current == "paid" && target != "canceled")
            throw new ArgumentException("Cannot change status of a paid order except to canceled");

        // Cho phép: pending -> paid | canceled ; paid -> canceled
        if (current == target)
        {
            // Không đổi gì, trả về chi tiết hiện tại
            return await GetOrderResponseDtoAsync(id);
        }

        var success = await _orderRepo.UpdateOrderStatusAsync(id, target);
        if (!success) return null;

        return await GetOrderResponseDtoAsync(id);
    }

    public async Task<bool> CancelOrderAsync(int id)
    {
        var order = await _orderRepo.GetByIdAsync(id);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {id} not found");
        }

        if (order.Status != "pending")
        {
            throw new ArgumentException("Only pending orders can be canceled");
        }

        return await _orderRepo.CancelOrderAsync(id);
    }

    public async Task<PagedResponse<OrderResponseDto>> SearchAsync(OrderQueryParams query)
    {
        var (items, total) = await _orderRepo.SearchAsync(query);
        var orderDtos = new List<OrderResponseDto>();

        foreach (var order in items)
        {
            var orderDto = await GetOrderResponseDtoAsync(order.OrderId);
            orderDtos.Add(orderDto);
        }

        return new PagedResponse<OrderResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = orderDtos.ToArray()
        };
    }

    public async Task<OrderResponseDto[]> ListAllAsync()
    {
        var items = await _orderRepo.ListAllAsync();
        var orderDtos = new List<OrderResponseDto>();

        foreach (var order in items)
        {
            var orderDto = await GetOrderResponseDtoAsync(order.OrderId);
            orderDtos.Add(orderDto);
        }

        return orderDtos.ToArray();
    }

    public async Task<OrderItemResponseDto[]> GetOrderItemsAsync(int orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {orderId} not found");
        }

        var orderItems = await _orderRepo.GetOrderItemsByOrderIdAsync(orderId);
        var itemDtos = new List<OrderItemResponseDto>();

        foreach (var item in orderItems)
        {
            var itemDto = _mapper.Map<OrderItemResponseDto>(item);
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                itemDto.ProductName = product.ProductName;
                itemDto.Barcode = product.Barcode;
            }
            itemDtos.Add(itemDto);
        }

        return itemDtos.ToArray();
    }

    public async Task<PaymentResponseDto[]> GetPaymentsAsync(int orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {orderId} not found");
        }

        var payments = await _orderRepo.GetPaymentsByOrderIdAsync(orderId);
        return _mapper.Map<PaymentResponseDto[]>(payments);
    }

    private async Task<OrderResponseDto> GetOrderResponseDtoAsync(int orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        var orderDto = _mapper.Map<OrderResponseDto>(order!);

        // Get customer name
        if (order!.CustomerId.HasValue)
        {
            var customer = await _customerRepo.GetByIdAsync(order.CustomerId.Value);
            if (customer != null)
            {
                orderDto.CustomerName = customer.Name;
            }
        }

        // Get user name
        if (order.UserId.HasValue)
        {
            var user = await _userRepo.GetByIdAsync(order.UserId.Value);
            if (user != null)
            {
                orderDto.UserName = user.Username;
            }
        }

        // Get promo code
        if (order.PromoId.HasValue)
        {
            var promotion = await _promotionRepo.GetByIdAsync(order.PromoId.Value);
            if (promotion != null)
            {
                orderDto.PromoCode = promotion.PromoCode;
            }
        }

        // Get order items
        var orderItems = await _orderRepo.GetOrderItemsByOrderIdAsync(orderId);
        orderDto.OrderItems = new List<OrderItemResponseDto>();

        foreach (var item in orderItems)
        {
            var itemDto = _mapper.Map<OrderItemResponseDto>(item);
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                itemDto.ProductName = product.ProductName;
                itemDto.Barcode = product.Barcode;
            }
            orderDto.OrderItems.Add(itemDto);
        }

        return orderDto;
    }
    private static string NormalizeStatus(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return "pending";
        var s = raw.Trim().ToLowerInvariant();

        return s switch
        {
            // EN
            "pending"   => "pending",
            "paid"      => "paid",
            "approved"  => "paid",       // nếu trước đây có dùng "approved"

            "canceled"  => "canceled",
            "cancelled" => "canceled",

            // VN
            "choduyet"  => "pending",
            "đangduyet" => "pending",

            "daduyet"   => "paid",

            "dahuy"     => "canceled",

            _ => "pending"
        };
    }
}
