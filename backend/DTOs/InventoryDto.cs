using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class InventoryResponseDto
{
    public int InventoryId { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public int Quantity { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
public class CreateInventoryDto
{
    [Required(ErrorMessage = "ProductId is required")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Quantity is required")]
    public int Quantity { get; set; }
}
public class UpdateInventoryDto
{
    [Required(ErrorMessage = "Quantity is required")]
    public int Quantity { get; set; }
}
