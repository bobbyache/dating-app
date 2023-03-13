# Setup instructions

### Installing Node and Angular

Originally setup via course using node v16.16.0 and Angular 14.2.10 using the following commands:

```
nvm install 16.16.0
npm install -g @angular/cli@14
```

Need to install bootstrap and this can be done manually with `npm install ngx-bootstrap`. Follow the [instructions here](https://ng-bootstrap.github.io/#/getting-started) to complete this installation.

### Delete and reinstall

```
rm -rf node_modules && npm i --legacy-peer-deps
```

### Creating .NET Core Projects

Use `dotnet new list` to see a list of project templates you can use to create .NET projects.

```
dotnet new sln
dotnet new webapi -n API
dotnet sln add API/API.csproj
```

# Development Commands

`dotnet watch` enables hot reload (unless you've disable the feature in your `launchSettings.json`). Doesn't always work correctly. To run the API Server you'll use `dotnet watch --no-hot-reload`. To update the database after making changes you'll use `dotnet ef database update`. To run Angular you'll use use `ng serve`.

To disable hot reload you can try going to `Properties/launchSettings.json` and add the following piece of JSON. However this currently doesn't seem to work.

```json
{
  "profiles": {
    "api": {
		...
      "hotReloadEnabled": false,
		...
    }
  }
}
```

So the option is just using `--no-hot-reload`.

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

# Use HTTPS for the Server

When running requests to the Server you will run ito a `net::ERR_CERT_AUTHORITY_INVALID` response which shows up in your console every time you run a request against the server. You'll probably also see a "Your connection is not private" page with a "Proceed to localhost (unsafe)" link.

You can install a dev certificate by running the following commands in your api root folder.
```
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

At this point everything should work correctly and you should not get the invalid certifate error. Also when your API loads the swagger page you shouldn't get the warning page and clicking on the lock icon in the address bar should tell you that the connection is valid. Drilling in here should show that the certificate is valid.

- [ ] How do I reinstate an expire certificate?

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
- [Cloudinary](https://cloudinary.com/) - Free cloud service with up to 10 Gigs.

# UI Components and Libraries

### ngx-gallery
- https://www.npmjs.com/package/@kolkov/ngx-gallery
- `npm install @kolkov/ngx-gallery`

### ngx-spinner
- https://www.npmjs.com/package/ngx-spinner

If you run into an issue like this:
```
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```
Run the install again like this `npm install @kolkov/ngx-gallery --legacy-peer-deps` as the author might not have got around to updating his component to say that is ok to use Angular XX. Can use one or two of the suggested switches.

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

If you want to know how to log in with any given user take a look at the `Seed.cs` class to see what the generated password is. It should be `Pa$$w0rd`.

Its always good to store the password hash as opposed to a password. This is a one way encryption method so one cannot decrypt back from the password to the hash. However this is not enough because if a user uses a weak well known password the hash will be recognisable and if the database is compromized and the attacker notices that Jack and Jill have the same hash and that hash maps back to a well known password online the attacker can use that password to gain access to both user's account.. Online there are dictionaries of hashes that map back to commonly used passwords based on common algorithms used to hash them. Salting protects against [dictionary attacks](https://en.wikipedia.org/wiki/Dictionary_attack).

Hashing and salting (another randomized string) a password means that even though Jack and Jill have the same hashed password the result of the salt means that there is no way to determine that their passwords are the same.

So the database has both a password hash field and a password salt field.

See the `AccountController` to see how the user registers and logs in. Hashing is used using `HMACSHA512`. The `hmac.Key` will be used to obtain the `PasswordSalt`.

```csharp
	using var hmac = new HMACSHA512();
	var user = new AppUser
	{
		Username = registerDto.Username.ToLower(),
		PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
		PasswordSalt = hmac.Key
	};
```

Now during login we can check the login password to make sure that it corresponds to the one we have registered based on the hash and the hash salt.

```csharp
	using var hmac = new HMACSHA512(user.PasswordSalt);
	var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
	for (int i = 0; i < computedHash.Length; i++)
	{
		if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
	}
```

For insight into how the token is created have a look at the `TokenService` which allows us to abstract the creation of the token away from the rest of the application. This will also allow us to swap out the service during unit testing.

## JSON Web Tokens

This should be a REST service. Hence one does not want to hold state. Therefore a JSON web token is preferred as a form of authentication. Once the user has a token, the service does not need to hit the database on every attempt.

Creating the token is also abstracted from the rest of the application using a `TokenService`. Use [this site to decode the JWT](https://jwt.ms/). The service is inject as `AddScoped` because it is not necessary on every call. It is only necessary when we need to create a token.

The `TokenService` reads from the configuration from `appSettings` `TokenKey` to retrieve the key used to encrypt the token. The token will consist of a number of claims amongst other properties.

The `Authorize` attribute above the controller method handles whether the bearer token is going to be asserted against or not.

Now the service needs to know how to authenticate. This is done in two parts:

- Add a service
- Add some middleware

The `IdentityServiceExtensions` middleware class which uses the `Microsoft.AspNetCore.Authentication.JwtBearer` package defines how the system will validate the token. Note how it reads the `TokenKey` from the APIs config.

The following needs to be applied in the order that it is presented here. The first line finds out who you are. The second line asserts that you have the rights to access the resource.

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

## Client Token Interceptor

To understand how the token is attached to each logged in user request have a look at the how the `client\src\app\_interceptors\jwt.interceptor.ts` works. Note that the user is taken from local storage as the current user (look at the `AccountService`). On each request the `user.token` is attached as an `Authorization` header.

# Validation

Validation attributes (if they are used) should be applied to the DTO and not the Entity classes. Simply adding a `Required` attribute to the `RegisterDto` field would result in the API passing back a 400 Bad Request if the field is not populated. `ControllerBase` is the controller class that allows this auto binding and validation to take place.

`ModelState` also tracks whether the model being passed in is valid. Although shouldn't need to use it everything is set up correctly.

With the validation setup in code you will always get a response like this:

```json
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-3dde7aa1218c88b1566d6127abdbd5fd-69c7ee216d8fb68a-00",
    "errors": {
        "Password": [
            "The Password field is required."
        ],
        "Username": [
            "The Username field is required."
        ]
    }
}
```

### Defensive Error Handling

In the `register.component.html` file is an example of how defensive programming can be done right on the backend. The backend will have the same validations as the front-end but it could quite possibly have additional validations. If a bug occurs in the SPA and a validation does not take place, the server will throw back the missed validation error. The server can also response with more complicated validation errors that require a round trip or checks against the database.

This approach means that if the UI handles the validation a round trip to the server is prevented. However, if the validation is circumvented for some reason an invalid validation response will still be thrown back from the server.

```html
    <div class="row" *ngIf="validationErrors">
        <ul class="text-danger">
            <li *ngFor="let error of validationErrors">{{ error }}</li>
        </ul>
    </div>
```

This is also a clever little trick to make sure the user cannot submit without the form being valid: `(ngSubmit)="registerForm.valid && register()"`.

# Error Handling

## Server

Be sure that this code is commented out in your `Program.cs` class. If you comment out the C# code to use the developer exception page you'll get a nicely formed JSON response which includes the stack trace as part of it. Why? If this below code is executed, MVC will swallow the exception and attempt to redirect to an exception page. Since this is an API, we would rather send a JSON response.


```csharp
if (builder.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
```

Go to your `launchSettings.json` file and replace the `ASPNETCORE_ENVIRONMENT` setting from `Development` to `Production`. Now if you run `GET https://localhost:5001/api/buggy/server-error` you'll only get the following results back in the response:

```json
{
    "statusCode": 500,
    "message": "Object reference not set to an instance of an object.",
    "details": "Internal Server Error"
}
```

The stack space is not included (for security reasons) and this will probably not how you want it handled in development mode.

If you set it back to `Development` you will see the entire stack trace returned.

You might think that we need to add code like this to every controller method to catch unhandled exceptions and return the correct status code.

```csharp
try
{
	...
}
catch (Exception ex)
{
	return StatusCode(500, "Computer says no!");
}
```
No. Rather, handle exceptions at the highest level. If we have our exception handling middleware at the top of the middleware tree that means that whatever exception is thrown will be handled at this level. Exceptions bubble up to the highest level where they can be handled and middleware executes in order.

Look at your `Program.cs` file to see where `app.UseMiddleware<ExceptionMiddleware>();` is positioned. Its the first piece of middleware! This is important! It saves us writing the code above for each controller method.

Look at the `Errors/ApiException.cs` class. Here is where we create the response format for an internal server error. The `Details` field will become the stack trace.

Another class `ExceptionMiddleware` is used as the middleware that handles the uncaught exception and creates the `ApiException` response object. In this class we inject an `ILogger` class to do any necessary logging. The `IHostEnvironment` will allow us to know whether we are in development mode or production mode. Note how the response is changed depending on the environment we're in!

The middleware framework expects a `InvokeAsync` method. The `RequestDelegate` will be called to go to the next piece of middleware in the pipeline. The try... catch... block will catch any exception bubbled up from anywhere downstream in the pipeline.

## Client

The `_interceptors\error.interceptor.ts` handles any errors coming through via the API. It simply looks for the `error.status` and depending what it is (or isn't), handles it by either displaying a `toastr` message or navigating to an error page. Both the router and the `toastr` is injected via the constructor.


### Not Found Errors

Note in the module `app-routing.module.ts` the following line at the end of the routes indicates that any route that does not exist will end up navigating to the not found component.


```typescript
{ path: '**', component:NotFoundComponent, pathMatch: 'full' },
```

### Internal Server Errors

The interceptor sends through router state using a construct called `NavigationExtras`. While navigating and hitting the constructor for the `ServerErrorComponent` this data will be available as long as the router is injected in the constructor.

```typescript
const navigationExtras: NavigationExtras = { state: {error: error.error}};
```

Allows the page to show some information passed to it by the intercepted error.

# AutoMapper

Look for the `AutoMapperProfiles` which is where you set up your mapping.

# HTTP request types and responses.

### HttpPut

If successful will always return a `NotContent` which effectively a 204. This is simply the server's way of saying. Everything went Ok, but I've got nothing else to send back to you. Naturally the client will have all the data it has requested the server to update.

Take a look at the `UsersController.UpdateUser()` method. If there are no changes to the user, the method will return a `BadRequest` as there were no changes to update. This means that `SaveAllAsync()` will return false. This is the expected behavior.

# Spinner and Requests

### ngx-spinner

The [package](https://www.npmjs.com/package/ngx-spinner) can be found here. But if you go to the GitHub site you'll get some more information [here](https://github.com/Napster2210/ngx-spinner).j The `ng add ngx-spinner` didn't work so try the `$ npm install ngx-spinner --save` and that still gives you errors but if you look closely enough at the error text you'll see that you can use `npm install ngx-spinner --save --legacy-peer-deps` and this works. Again this is simply because the developer has not published enough up to date info.

If this doesn't work double check the GitHub page and look for which version is compatible with which version of Angular. In the original case this was that a specific version `npm install ngx-spinner@14.0.0 --save --legacy-peer-deps` had to be installed for Angular 14.

Once done note that the style is added to `angular.json` and the necessary import is added to `shared.module.ts`. The chosen animation is `ball-scale-multiple`.

Now there could be more than one http requests going on at the same time so to handle this scenario we make use of `busyRequestCount` in the `BusyService`. This way the count increments and decrements as the requests intiate and complete and when there are no requests left the result should be 0.

### How dow we know?

Use and interceptor.  See `LoadingInterceptor` and how it interacts with the ngx-spinner and `BusyService`.

# Caching

Have a look at the `MembersService` to see how in-memory client-side caching is implemented using observables and arrays within the service. Note that the `updateMember`uses the spread operator to neatly ensure that an updated member does not need to be refetched from the server with another call as the client should have all the necessary data to display the updated member.

# Storing Images

Storing images as Large Binary Ojbects (BLOBs) is not efficient. Databases are not meant for this. File systems are optimized for storing files so storing files on the web server. However, this is not a good idea if you need to scale in the future.
- Space issue. How much space do we have?
- Aspect ratio
- CPU contention

Using a cloud system can be unlimited space but would come at a cost. Can use their logic to handle the aspect ratios of the images that we wish to have on our site.

## Steps to store a new image

- Client uploads photo to API with JWT.
- Server uploads the photo to Cloudinary (securely with API keys).
- Cloudinary stores the photo and sends the response.
- API saves photo URL and public ID to our server's database.
- Each photo is given an auto generated ID when its database record is created.
- 201 Created response sent back to the client with a location header.

To get information about the various and SDKs and their usage one can go to the documentation. [This link takes you straight to how](https://cloudinary.com/documentation/dotnet_integration) you'd work with the API using .NET SDK.

A nuget package exists called `CloudinaryDotNet` by `Cloudinary` and so the nuget package installation is a requirement.

### Configuration

The configuration will be added to `appsettings.json`. These are NOT settings that you'll want to store on GitHub! Ensure that this file is added to your `.gitignore` file.

```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "AllowedHosts": "*",
    "CloudinarySettings": {
        "CloudName": "...",
        "ApiKey": "...",
        "ApiSecret": "..."
    }
}

```

The `IPhotoService` enscapsulates the logic of saving the photo to and from the cloud so have a look here to see how it works.

### Return location of the created resource (HATEOS)

Also take al ook at how when the photo is uploaded the following standards are met:
- The response is a `201 Created`.
- The `PhotoDto` is returned with the response.
- A `Location` header is added (where to find the response on the server).

### Client File Upload

[ng2-file-upload](https://valor-software.com/ng2-file-upload/) is an Angular file upload component used in this solution. Although this looks like its really out of date it is actually continuously maintained. The versioning is weird.

Use `npm install ng2-file-upload@next` but use `npm install ng2-file-upload@next --legacy-peer-deps` if you have issues installing it. However things had changed when you tried it didn't work so you used a specific verion and added this to the dependencies:

```
"ng2-file-upload": "2.0.0-3",
```

# Reactive Forms

### Importing the Module

You have to import the `ReactiveFormsModule` from `@angular/forms`. Reactive forms are component based and so the the form is controlled via the component rather than in the template. Template forms are template driven.

See `register.component.html` for code.