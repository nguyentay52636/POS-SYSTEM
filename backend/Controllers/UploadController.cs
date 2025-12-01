using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [SwaggerTag("Upload operations")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        /// <summary>
        /// Uploads an image file.
        /// </summary>
        /// <param name="file">The image file to upload.</param>
        /// <returns>The URL of the uploaded image.</returns>
        [HttpPost("image")]
        [SwaggerOperation(Summary = "Upload an image", Description = "Uploads an image file to the server and returns the file URL.")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Create uploads/images directory if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads", "images");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Generate unique filename
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return URL
            var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/images/{uniqueFileName}";

            return Ok(new { url = fileUrl });
        }
    }
}
