using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using AutoMapper;

namespace backend.Services;

public interface IPaymentService
{
    Task<PaymentResponseDto> CreateAsync(CreatePaymentDto dto);
    Task<PaymentDetailResponseDto?> GetByIdAsync(int id);
    Task<PaymentResponseDto?> UpdateAsync(int id, UpdatePaymentDto dto);
    Task<bool> DeleteAsync(int id);
    Task<PagedResponse<PaymentResponseDto>> SearchAsync(PaymentQueryParams query);
    Task<PaymentResponseDto[]> ListAllAsync();
    Task<PaymentResponseDto[]> GetPaymentsByOrderIdAsync(int orderId);
    Task<decimal> GetTotalPaymentsByOrderIdAsync(int orderId);
}

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IOrderRepository _orderRepo;
    private readonly ICustomerRepository _customerRepo;
    private readonly IMapper _mapper;

    public PaymentService(
        IPaymentRepository paymentRepo,
        IOrderRepository orderRepo,
        ICustomerRepository customerRepo,
        IMapper mapper)
    {
        _paymentRepo = paymentRepo;
        _orderRepo = orderRepo;
        _customerRepo = customerRepo;
        _mapper = mapper;
    }

    public async Task<PaymentResponseDto> CreateAsync(CreatePaymentDto dto)
    {
        // Validate order exists
        var order = await _orderRepo.GetByIdAsync(dto.OrderId);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {dto.OrderId} not found");
        }

        // Validate order is not canceled
        if (order.Status == "canceled")
        {
            throw new ArgumentException("Cannot create payment for a canceled order");
        }

        // Validate payment amount doesn't exceed order total
        var existingPayments = await _paymentRepo.GetTotalPaymentsByOrderIdAsync(dto.OrderId);
        var remainingAmount = (order.TotalAmount ?? 0) - existingPayments;

        if (dto.Amount > remainingAmount)
        {
            throw new ArgumentException($"Payment amount ({dto.Amount:C}) exceeds remaining order amount ({remainingAmount:C})");
        }

        // Create payment
        var payment = _mapper.Map<Payment>(dto);
        payment = await _paymentRepo.CreateAsync(payment);

        // Check if order is fully paid
        var totalPayments = await _paymentRepo.GetTotalPaymentsByOrderIdAsync(dto.OrderId);
        if (totalPayments >= (order.TotalAmount ?? 0))
        {
            await _orderRepo.UpdateOrderStatusAsync(dto.OrderId, "paid");
        }

        return _mapper.Map<PaymentResponseDto>(payment);
    }

    public async Task<PaymentDetailResponseDto?> GetByIdAsync(int id)
    {
        var payment = await _paymentRepo.GetByIdAsync(id);
        if (payment == null) return null;

        var paymentDto = _mapper.Map<PaymentDetailResponseDto>(payment);

        // Get order details
        var order = await _orderRepo.GetByIdAsync(payment.OrderId);
        if (order != null)
        {
            paymentDto.OrderStatus = order.Status;
            paymentDto.OrderTotalAmount = order.TotalAmount;

            // Get customer name
            if (order.CustomerId.HasValue)
            {
                var customer = await _customerRepo.GetByIdAsync(order.CustomerId.Value);
                if (customer != null)
                {
                    paymentDto.CustomerName = customer.Name;
                }
            }
        }

        return paymentDto;
    }

    public async Task<PaymentResponseDto?> UpdateAsync(int id, UpdatePaymentDto dto)
    {
        var payment = await _paymentRepo.GetByIdAsync(id);
        if (payment == null) return null;

        // Validate order still exists
        var order = await _orderRepo.GetByIdAsync(payment.OrderId);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {payment.OrderId} not found");
        }

        // Update payment fields
        if (dto.Amount.HasValue)
        {
            // Validate new amount doesn't exceed order total
            var existingPayments = await _paymentRepo.GetTotalPaymentsByOrderIdAsync(payment.OrderId);
            existingPayments -= payment.Amount; // Subtract current payment amount
            var remainingAmount = (order.TotalAmount ?? 0) - existingPayments;

            if (dto.Amount.Value > remainingAmount)
            {
                throw new ArgumentException($"Payment amount ({dto.Amount.Value:C}) exceeds remaining order amount ({remainingAmount:C})");
            }

            payment.Amount = dto.Amount.Value;
        }

        if (dto.PaymentMethod != null)
        {
            payment.PaymentMethod = dto.PaymentMethod;
        }

        if (dto.PaymentDate.HasValue)
        {
            payment.PaymentDate = dto.PaymentDate;
        }

        payment = await _paymentRepo.UpdateAsync(payment);

        // Check if order payment status needs to be updated
        var totalPayments = await _paymentRepo.GetTotalPaymentsByOrderIdAsync(payment.OrderId);
        if (totalPayments >= (order.TotalAmount ?? 0) && order.Status == "pending")
        {
            await _orderRepo.UpdateOrderStatusAsync(payment.OrderId, "paid");
        }
        else if (totalPayments < (order.TotalAmount ?? 0) && order.Status == "paid")
        {
            await _orderRepo.UpdateOrderStatusAsync(payment.OrderId, "pending");
        }

        return _mapper.Map<PaymentResponseDto>(payment);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var payment = await _paymentRepo.GetByIdAsync(id);
        if (payment == null) return false;

        var success = await _paymentRepo.DeleteAsync(id);

        if (success)
        {
            // Check if order payment status needs to be updated
            var order = await _orderRepo.GetByIdAsync(payment.OrderId);
            if (order != null)
            {
                var totalPayments = await _paymentRepo.GetTotalPaymentsByOrderIdAsync(payment.OrderId);
                if (totalPayments < (order.TotalAmount ?? 0) && order.Status == "paid")
                {
                    await _orderRepo.UpdateOrderStatusAsync(payment.OrderId, "pending");
                }
            }
        }

        return success;
    }

    public async Task<PagedResponse<PaymentResponseDto>> SearchAsync(PaymentQueryParams query)
    {
        var (items, total) = await _paymentRepo.SearchAsync(query);
        var paymentDtos = _mapper.Map<PaymentResponseDto[]>(items);

        return new PagedResponse<PaymentResponseDto>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = paymentDtos
        };
    }

    public async Task<PaymentResponseDto[]> ListAllAsync()
    {
        var items = await _paymentRepo.ListAllAsync();
        return _mapper.Map<PaymentResponseDto[]>(items);
    }

    public async Task<PaymentResponseDto[]> GetPaymentsByOrderIdAsync(int orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {orderId} not found");
        }

        var payments = await _paymentRepo.GetPaymentsByOrderIdAsync(orderId);
        return _mapper.Map<PaymentResponseDto[]>(payments);
    }

    public async Task<decimal> GetTotalPaymentsByOrderIdAsync(int orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new ArgumentException($"Order with ID {orderId} not found");
        }

        return await _paymentRepo.GetTotalPaymentsByOrderIdAsync(orderId);
    }
}
