namespace backend.Enums;

public enum UserRole
{
    Staff = 1,
    Admin = 2
}

public static class UserRoleHelper
{
    public static string GetRoleName(int roleValue)
    {
        return roleValue switch
        {
            1 => "staff",
            2 => "admin",
            _ => "staff"
        };
    }

    public static int GetRoleValue(string roleName)
    {
        return roleName?.ToLowerInvariant() switch
        {
            "staff" => 1,
            "admin" => 2,
            _ => 1
        };
    }

    public static bool IsValidRole(string roleName)
    {
        return roleName?.ToLowerInvariant() is "staff" or "admin";
    }

    public static bool IsValidRole(int roleValue)
    {
        return roleValue is 1 or 2;
    }
}
