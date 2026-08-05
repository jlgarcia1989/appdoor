using Api;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Model;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
   
    options.EnableAnnotations();
});

var connectionString = builder.Configuration.GetConnectionString("DoorConnectionString");


builder.Services.AddDbContext<DataContext>(x => x.UseSqlServer(connectionString));
builder.Services.AddScoped<ServicioUsuarios>();
builder.Services.AddScoped<ServicioRutas>();
IMapper mapper = MapperConfig.InitializeAutomapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddDirectoryBrowser();
var app = builder.Build();



// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
    app.UseSwaggerUI();
//}
app.UseStaticFiles();
app.UseAuthorization();


app.MapControllers();

app.Run();
