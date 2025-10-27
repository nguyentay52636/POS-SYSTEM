# ----- Build stage -----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app /p:UseAppHost=false

# ----- Runtime stage -----
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://0.0.0.0:5006
EXPOSE 5006

# 👇 Đổi tên DLL này cho khớp nếu dự án của bạn tạo ra DLL khác
ENTRYPOINT ["dotnet", "backend.dll"]
