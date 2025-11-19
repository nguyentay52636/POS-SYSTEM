using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Services;

public interface IFileUploadService
{
    Task<string?> UploadProductImageAsync(IFormFile? file);
    Task<bool> DeleteProductImageAsync(string? imageUrl);
    string GetImageUrl(string fileName);
}

public class FileUploadService : IFileUploadService
{
    private readonly string _uploadPath;
    private readonly string _baseUrl;
    private readonly ILogger<FileUploadService> _logger;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private const long _maxFileSize = 5 * 1024 * 1024; // 5MB

    public FileUploadService(IWebHostEnvironment env, IConfiguration configuration, ILogger<FileUploadService> logger)
    {
        _uploadPath = Path.Combine(env.ContentRootPath, "image", "uploads", "products");
        _baseUrl = configuration["BaseUrl"] ?? "http://localhost:5006";
        _logger = logger;

        // Ensure directory exists
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
            _logger.LogInformation("Created upload directory: {UploadPath}", _uploadPath);
        }
        else
        {
            _logger.LogInformation("Upload directory exists: {UploadPath}", _uploadPath);
        }
    }

    public async Task<string?> UploadProductImageAsync(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("File is null or empty");
            return null;
        }

        _logger.LogInformation("Uploading file: {FileName}, Size: {FileSize} bytes", file.FileName, file.Length);

        // Validate file size
        if (file.Length > _maxFileSize)
        {
            _logger.LogWarning("File size exceeds limit: {FileSize} > {MaxSize}", file.Length, _maxFileSize);
            throw new ArgumentException($"File size exceeds maximum allowed size of {_maxFileSize / 1024 / 1024}MB");
        }

        // Validate file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !_allowedExtensions.Contains(extension))
        {
            _logger.LogWarning("Invalid file extension: {Extension}", extension);
            throw new ArgumentException($"File type not allowed. Allowed types: {string.Join(", ", _allowedExtensions)}");
        }

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadPath, fileName);

        try
        {
            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            _logger.LogInformation("File saved successfully: {FilePath}", filePath);

            // Verify file was saved
            if (File.Exists(filePath))
            {
                var fileInfo = new FileInfo(filePath);
                _logger.LogInformation("File verified: {FilePath}, Size: {Size} bytes", filePath, fileInfo.Length);
            }
            else
            {
                _logger.LogError("File was not saved: {FilePath}", filePath);
            }

            // Return URL path
            var imageUrl = GetImageUrl(fileName);
            _logger.LogInformation("Returning image URL: {ImageUrl}", imageUrl);
            return imageUrl;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving file: {FilePath}", filePath);
            throw;
        }
    }

    public Task<bool> DeleteProductImageAsync(string? imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
            return Task.FromResult(false);

        try
        {
            // Extract filename from URL
            var fileName = Path.GetFileName(imageUrl);
            if (string.IsNullOrEmpty(fileName))
                return Task.FromResult(false);

            var filePath = Path.Combine(_uploadPath, fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return Task.FromResult(true);
            }
        }
        catch
        {
            // Log error if needed
        }

        return Task.FromResult(false);
    }

    public string GetImageUrl(string fileName)
    {
        return $"/image/uploads/products/{fileName}";
    }
}

