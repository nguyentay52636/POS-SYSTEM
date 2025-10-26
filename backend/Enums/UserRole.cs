namespace backend.Enums;

public enum UserRole
{
    Customer = 0,
    Admin = 1,
    Staff = 2
}

public static class UserRoleHelper
{
    public static string GetRoleName(int roleValue)
    {
        return roleValue switch
        {
            0 => "customer",
            1 => "admin",
            2 => "staff",
            _ => "customer"
        };
    }

    public static int GetRoleValue(string roleName)
    {
        return roleName?.ToLowerInvariant() switch
        {
            "customer" => 0,
            "admin" => 1,
            "staff" => 2,
            _ => 0
        };
    }

    public static bool IsValidRole(string roleName)
    {
        return roleName?.ToLowerInvariant() is "customer" or "staff" or "admin";
    }

    public static bool IsValidRole(int roleValue)
    {
        return roleValue is 0 or 1 or 2;
    }
}
