using System;

namespace backend.Models;

public class User
{
public int UserId { get; set; }
public DateTime? CreatedAt { get; set; }
public string? FullName { get; set; }
public string? Password { get; set; }
public string? Role { get; set; }
public string? Username { get; set; }
}
