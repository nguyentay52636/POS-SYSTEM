using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using backend.Models;

namespace backend.Attributes;

public class PermissionAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _feature;
    private readonly string _permission;

    public PermissionAttribute(string feature, string permission)
    {
        _feature = feature;
        _permission = permission;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var roleIdClaim = user.Claims.FirstOrDefault(x => x.Type == "role_id");
        if (roleIdClaim == null)
        {
            context.Result = new ForbidResult();
            return;
        }

        var roleId = int.Parse(roleIdClaim.Value);

        var db = context.HttpContext.RequestServices.GetService<ApplicationDbContext>();
        if (db == null)
        {
            context.Result = new StatusCodeResult(500);
            return;
        }

        var hasPermission = db.RolePermissions
            .Any(rp => rp.RoleId == roleId
                    && rp.Feature.FeatureName == _feature
                    && rp.PermissionType.PermissionName == _permission
                    && rp.IsAllowed == true);

        if (!hasPermission)
        {
            context.Result = new ForbidResult();
        }
    }
}
