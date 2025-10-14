using System;

namespace backend.Models;

public class Inventory
{
public int InventoryId { get; set; }
public int ProductId { get; set; }
public int Quantity { get; set; }
public DateTime? UpdatedAt { get; set; }
}
