namespace backend.DTOs;

public class CustomerPointsHistoryDTO
{
    public int HistoryId { get; set; }
    public int CustomerId { get; set; }
    public int? OrderId { get; set; }
    public int PointsEarned { get; set; }
    public int PointsUsed { get; set; }
    public int PointsBalance { get; set; }
    public string TransactionType { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class InventoryHistoryDTO
{
    public int HistoryId { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public int? OldQuantity { get; set; }
    public int? NewQuantity { get; set; }
    public int? Difference { get; set; }
    public string? ChangeType { get; set; }
    public string? Reason { get; set; }
    public string? Note { get; set; }
    public int? EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public DateTime? ChangeDate { get; set; }
}

public class ProfitConfigurationDTO
{
    public int ConfigId { get; set; }
    public decimal DefaultProfitPercentage { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByEmployeeId { get; set; }
    public string? UpdatedByEmployeeName { get; set; }
}

public class UpdateProfitConfigurationDTO
{
    public decimal DefaultProfitPercentage { get; set; }
    public int? UpdatedByEmployeeId { get; set; }
}

public class ProfitRuleDTO
{
    public int RuleId { get; set; }
    public string RuleType { get; set; } = "by_product";
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal ProfitPercentage { get; set; }
    public int Priority { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
}

public class CreateProfitRuleDTO
{
    public int ProductId { get; set; }
    public decimal ProfitPercentage { get; set; }
    public int Priority { get; set; } = 1;
    public int? EmployeeId { get; set; }
}

public class UpdateProfitRuleDTO
{
    public decimal? ProfitPercentage { get; set; }
    public int? Priority { get; set; }
    public string? Status { get; set; }
    public int? EmployeeId { get; set; }
}
