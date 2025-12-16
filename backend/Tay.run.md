  {
    "ConnectionStrings": {
      "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=bachhoaxanh;Trusted_Connection=True;MultipleActiveResultSets=true"
    },
    "Logging": {
      "LogLevel": {
        "Default": "Information",
        "Microsoft.AspNetCore": "Warning"
      }
    }
  }


  {
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=bachhoaxanh;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "JwtConfig": {
    "Key": "your-super-secret-key-with-at-least-32-characters-for-security",
    "Issuer": "POSSystemAPI",
    "Audience": "POSSystemClient",
    "ExpireMinutes": 1440
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}