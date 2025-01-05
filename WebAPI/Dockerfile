# Use the official ASP.NET runtime image for Linux (if deploying on Render or a similar platform)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

EXPOSE 8080
EXPOSE 8081

# The SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["WebAPI/WebAPI.csproj", "WebAPI/"]
RUN dotnet restore "WebAPI/WebAPI.csproj"

# Copy the entire repository and build the project
COPY . .
WORKDIR "/src/"
RUN dotnet build "WebAPI/WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the app to the /app/publish directory
FROM build AS publish
RUN dotnet publish "WebAPI/WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage: Use the base image and copy the published app
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Run the app (listen on dynamic PORT environment variable)
ENTRYPOINT ["dotnet", "WebAPI.dll"]
