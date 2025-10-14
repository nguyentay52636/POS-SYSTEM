using System;

namespace backend.Models;

public class Customer
{
public int CustomerId { get; set; }
public string? Address { get; set; }
public DateTime? CreatedAt { get; set; }
public string? Email { get; set; }
public string? Name { get; set; }
public string? Phone { get; set; }
}
