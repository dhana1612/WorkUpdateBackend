using Microsoft.EntityFrameworkCore;
using WebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();




// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", builder =>
    {
        builder.WithOrigins("http://127.0.0.1:5500") 
               .AllowAnyHeader()   // Allow any header
               .AllowAnyMethod()   // Allow any HTTP method (GET, POST, etc.)
               .AllowCredentials(); // Allow cookies/auth
    });
});




builder.Services.AddDbContext<UserLoginDbContext>(options =>
   options.UseNpgsql(builder.Configuration.GetConnectionString("APIConnection"))
);



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply the CORS policy before mapping controllers
app.UseCors("AllowSpecificOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
