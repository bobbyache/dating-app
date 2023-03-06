# Setup instructions

### Installing Node and Angular

Originally setup via course using node v16.16.0 and Angular 14.2.10 using the following commands:

```
nvm install 16.16.0
npm install -g @angular/cli@14
```

Need to install bootstrap and this can be done manually with `npm install ngx-bootstrap`. Follow the [instructions here](https://ng-bootstrap.github.io/#/getting-started) to complete this installation.

### Creating .NET Core Projects

Use `dotnet new list` to see a list of project templates you can use to create .NET projects.

```
dotnet new sln
dotnet new webapi -n API
dotnet sln add API/API.csproj
```

# Development Commands

`dotnet watch run` enables hot reload. Doesn't always work correctly. To run the API Server you'll use `dotnet watch run --no-hot-reload`. To update the database after making changes you'll use `dotnet ef database update`. To run Angular you'll use use `ng serve`.

### .NET Core SDK

Use `dotnet --info` to get information for your current SDK version and its build information as well as some information about your system. Other .NET SDK installations are also shown.

Use `dotnet sdk check` to check the current support status, version status, and patch information for your installed .NET SDKs.

If you do have multiple versions of .NET installed and you wish to use a specific version that isn't the latest version you can specify this in a `global.json` file. You can generate this file using `dotnet new globaljson` in your project folder.

It creates a file like:

```json
{
  "sdk": {
    "version": "7.0.101"
  }
}
```

# Installing Entity Framework and SQLite

Ensure to install the following two packages:

- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.EntityFrameworkCore.Design`

Install the SQLite extension by `alexcvzz` to view your database. You'll open the command palatte with CTRL+SHIFT+P... And choose the option to open a database. Your database will show up in the list if you've already done a `dotnet ef database update` and you'll be able to access it in your explore pane. Look for SQLite Explorer.

### Data Migrations

- Use `dotnet tool install --global dotnet-ef --version` in order to install `dotnet-ef`. You'd normally want to install this globally unless you need a specific version for a specific project.
- Use `dotnet tool list` to get the listing of tools. This will display the `dotnet-ef` version if one is installed. Use `dotnet tool list -g` to see the global tool list. `dotnet tool list --local` to list all locally installed tools.

For whatever reason, you may wish to use a specific version of dotnet-ef for a project (perhaps you’re learning something on Udemy). You can set up a manifest file for your solution. Take a look at [this article](https://learn.microsoft.com/en-us/dotnet/core/tools/local-tools-how-to-use). When you create a new tool manifest it will create a file here: .config\dotnet-tools.json and add your version to it.

The commands that you can use are also listed on the [official nuget](https://www.nuget.org/packages/dotnet-ef/) dotnet-ef site.

### Updating the database

Before running the `dotnet ef database update` it will be useful to make sure your solutions builds with a `dotnet build`.

# Use HTTPS (for Angular)

Code that allows you to generate a new certificate with instructions are located at `git@github.com:bobbyache/generate-certificate-for-https.git`

Look in your client/ssl directory to find the certificates.

Windows 10

	1. Double click on the certificate (server.crt)
	2. Click on the button “Install Certificate …”
	3. Select whether you want to store it on user level or on machine level
	4. Click “Next”
	5. Select “Place all certificates in the following store”
	6. Click “Browse”
	7. Select “Trusted Root Certification Authorities”
	8. Click “Ok”
	9. Click “Next”
	10. Click “Finish”

If you get a prompt, click “Yes”

# Use HTTPS with Postman

Postman cannot validate our self-signed certificate as it is "self signed". By default Postman wants to verify certificates over HTTPS. To get around this, in Postman go into Settings -> General and turn off SSL Certificate Verification.


# Installing Extensions and some useful Settings
- `Explorer:Compact Folders` setting can be unchecked in order to avoid long paths for folders that do not have any files.
- `Files:Exclude` setting can be modified to hide your bin and obj folders. The `.git` folder is hidden by default.

### Csharp Omnisharp

Once you've installed this extension, make sure to check both the following settings for the extension:
- Omnisharp: Enable Async Completion
- Omnisharp: Enable Import Completion
- Omnisharp: Enable Editor Config Support
- Omnisharp: Organize imports On Format

If you run into problems you can `Reload Window`. You can also open up the integrated terminal and look at the Problems or Output terminal.

Can use the `Omnisharp:Path` setting to target a specific version or to opt in to beta releases using `latest`.

You should ensure the setting "Editor > Bracket Pair Colorization:Enabled" is set. Also "Editor > Guides: Bracket Pairs" should be set to true. Also set "Editor: Auto Closing Brackets" to always and "Auto Closing Quotes" to always.

# Important information regarding `appsettings` files

These files SHOULD NOT be saved to source control (especially the production settings) as they can contain sensitive information such as database connection strings. In this case its fine as the only database used is created locally.

# All Extensions

- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
- [C# Omnisharp](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
- [C# Extensions](https://marketplace.visualstudio.com/items?itemName=kreativ-software.csharpextensions)
- [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- [Nuget Gallery](https://marketplace.visualstudio.com/items?itemName=patcx.vscode-nuget-gallery)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [SQLite](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite)



# Productivity Tips
- [Angular Bootstrap](https://ng-bootstrap.github.io/#/home) - You'll generally following the manual install instructions, add the styles to `angular.json`.
- [json2ts](http://json2ts.com/) - Generates TypeScript interfaces from JSON.

# CORS considerations

Since the Angular application is served on a different host (different port) to the API attempts to call `localhost:5001` will result in  CORS policy block error. So `Access-Control-Allow-Origin` header needs to be set by the API.

CORS is a browser security feature. It's the API's responsibility to add the header above to allow the client browser to trust that there is a policy in place that allows the client and the server to talk to each other. Otherwise our client could download some dodgy code or data.

The API server knows to add CORS services using this code:

```csharp
services.AddCors();
```

The API server add this header using the following code:

```csharp
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("https://localhost:4200"));
```

Once this is done, the `Access-Control-Allow-Origin` header will be sent with every response.

# Security

