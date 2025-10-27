using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "Category name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 100 characters")]
    public string CategoryName { get; set; } = string.Empty;
}

public class UpdateCategoryDto
{
    [Required(ErrorMessage = "Category name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 100 characters")]
    public string CategoryName { get; set; } = string.Empty;
}

public class CategoryResponseDto
{
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
}

public class CategoryQueryParams
{
    public string? Keyword { get; set; }
    public string? CategoryName { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "name"; // name | id
    public string? SortDir { get; set; } = "asc"; // asc | desc
}
