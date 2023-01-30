using API.Data;
using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// https://github.com/trycatchlearn/datingapp

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();


// if (builder.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    // Will automatically create the database if it doesn't exist
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();

    // Seed with initial data (if no data exists)
    await Seed.SeedUsers(context);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
