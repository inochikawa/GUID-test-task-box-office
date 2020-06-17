using System;
using System.Text;
using BO.Data;
using BO.Data.SeedData;
using BO.Web.Authorization.Handlers;
using BO.Web.Authorization.Requirements;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using BO.Core.ApplicationOptions;
using Microsoft.OpenApi.Models;

namespace BO.Web
{
    public class Startup
    {
        private AppAuthorizationOptions _authorizationSection;
        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            _authorizationSection = configuration.GetSection(AppAuthorizationOptions.Key).Get<AppAuthorizationOptions>();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppAuthorizationOptions>(Configuration.GetSection(AppAuthorizationOptions.Key));
            
            services
                .AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                );
            

            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
            services.AddDbContext<BoxOfficeContext>(options =>
                {
                    options.UseSqlServer(Configuration.GetConnectionString("Local"), sqlServerOpts =>
                        {
                            sqlServerOpts.MigrationsAssembly(typeof(BoxOfficeContext).Assembly.GetName().Name);
                        });
                });
            
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authorizationSection.JwtSecret)),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy(AdminRequirement.PolicyName, builder =>
                    {
                        builder.Requirements.Add(new AdminRequirement());
                    });
            });
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Box Office API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                    In = ParameterLocation.Header, 
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey 
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    { 
                        new OpenApiSecurityScheme 
                        { 
                            Reference = new OpenApiReference 
                            { 
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer" 
                            } 
                        },
                        new string[] { } 
                    } 
                });
            });
            
            services.AddScoped<IAuthorizationHandler, AdminRequirementHandler>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, BoxOfficeContext dbContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Box Office API V1");
            });

            app.UseRouting();
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
            
            
            InitDataBase(dbContext);
        }

        private void InitDataBase(BoxOfficeContext dbContext)
        {
            dbContext.Database.EnsureDeleted();
            // Always use automigration for test purposes 
            dbContext.Database.Migrate();
            
            SeedData.Users(dbContext);
            SeedData.Shows(dbContext);
        }
    }
}