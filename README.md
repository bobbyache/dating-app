# Questions/Thoughts to be Considered

- `/users/set-main-photo` should surely be a `PATCH` rather than a `PUT` to be dogmatically RESTfull? 
- Investigate paging and its application using HATEOS and RESTfull approaches.
- You have workspace settings for prettier (in the root repository folder), and you have a prettier file in the client folder. Experiment and see what takes preference what really needs to be set.
- "Likes" and "Liked by" is not implemented correctly. Feels as if the two should be two seperate use cases. Revisit the code and extract the two from each other.
- DataContext should also be an interface?

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

# Creating .NET Core Projects

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


# Debugging the Client and API (Issues and solution)


There is an issue trying to point to a sub-folder to run Angular. It doesn't matter whether you try and set the `webRoot` correctly it does not seem to work.

- This link [looked promising but doesn't seem to work](https://stackoverflow.com/questions/40443217/debug-with-visual-studio-code-not-working).
- This is the [official link](https://code.visualstudio.com/docs/editor/debugging) but the instructions to not appear to work.

```json
        {
            "name": "ng serve",
            "type": "chrome",
            "request": "launch",
            "preLaunchTask": "npm: start",
            "url": "http://localhost:4200/",
            "webRoot": "${workspaceRoot}/client"
          },
```

Problem is that the `webRoot` doesn't seem to work and you never seem to point to the right folder.

However, if you open another VS Code  instance in the sub-folder (in the client folder in this example), then you are able to use the `.vscode` `launch.json` settings to properly debug your Angular App.

However this means you will need to have two instances open.

## Solution

The solution is to create a workspace. Your project structure has the following files so the solution is to add the API folder and the client folder to a workspace rather than opening the parent folder.
Save the workspace file in the parent folder.

```
C:.
+---API
|   +---.vscode
+---client
|   +---.vscode
+---dating-app.code-workspace
|

```

### API
At some point VS Code will ask if you want to set up debugging configuration for hte API. However, you can do this manually by `CTRL+SHIFT+P` and choosing "Debug: Add configuration...". When you choose to launch your API you'll get an `ERR_EMPTY_RESPONSE` but this is simply because there is nothing at the root and your page doesn't open like on `dotnet watch ...` at the Swagger route.

You can still hit an endpoint from Postman with a breakpoint and it will break in your API code.

### Client

You'll also be able to debug your Angular code by simply select it from the debugging options as well as test your code using Jasmine.

This can be a little fickle as it sometimes hangs but it appears that you have to kill it in the "debug" list and and the kill the "npm start" process which appears to remain running in your VS Code terminal list.

It appears that if you shut down the browser windo instead of killing the process in the "debug list" the next time you try and debug the angular app you end up with a white hanging screen.

> Note: Good idea to move the corresponding files that no long belong in the parent folder into their respective folders.


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

# Reactive Forms

### Importing the Module

You have to import the `ReactiveFormsModule` from `@angular/forms`. Reactive forms are component based and so the the form is controlled via the component rather than in the template. Template forms are template driven.

See `register.component.html` for code.

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

### Client-side validation

> REMEMBER: Client-side validation is a nice-to-have. Server side validation is a necessity!

Most input fields are managed using a reusable `text-input.component.ts` control. Pass in the type of the control to change its appearance and behavior. The validations are applied to each `AbstractControl` via the parent component (`register.component.ts`) using a reactive forms approach. This is not the template driven approach in which the template drives the form behavior. Rather, the behavior is drive from a `FormGroup`.

To handle cross field validation on the client side, take a look at the `updateValueAndValidity()` method of the confirm password field.

To have a look to see how custom validations can be applied have a look at the `matchValues()` method.

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

Take a look at how the `getMember()` takes advantage of the `memberCache` to retrieve members already in memory by making clever use of the `reduce()` method.

The filters above the matches gallery listing are also cached (remembered) with the `userParams` in the `MemberService`. The reason why this works is that the service outlasts the component which is destroyed every time you navigate away from it. The `getUserParams`, `setUserParams`, and `resetUserParams` manage the filters from within the service.

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

# Pagination

- We should always page search results.
- Helps avoid performance problems.
- Page size should be limited.
- Parameters are passed by query string.

```
https://localhost:5001/api/users?pageNumber=1&pageSize=5
```
## Server Pagination

The following is a EF pattern that pages and returns an `IQueryable<User>`.

```csharp
var query = context.Users
    .Where(x = x.Gender == gender)
    .OrderBy(x => x.UserName)
    .Take(5)
    .Skip(5)
    // optional as it will return a type of IQueryable.
    .AsQueryable()
;
```

Do not want to do this for all our queries. We'd rather create a reusable `PagedList`. Take note of how this inherits from `List<T>` and makes use of generics in order to return a `PagedList` that encapsulates paging against entity tables in the database.

This is used in conjunction with the `PaginationHeader` which will pass back pagination information in HTTP responses (where applicable) from the Web API search methods.

To make this easier to use within a response an extension method (`HttpExtensions.AddPaginationHeader()`) is created to extend the `HttpResponse` class. Importantly the API must explicitly allow the client access to the Pagination header otherwise the default CORS policy will be to deny the client access to the information within this header.

The `UserParams` is a class that will be instantiated when the endpoint is hit (based on query parameter values) and then used by the repository method that returns the list of members (or users). It contains paging information and a little defensive logic (in order to ensure that the page size does not exceed a certain number) so that the client can request paged user data that it needs.

The resulting repository interface method therefore looks like this.

```csharp
    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
```

The resulting Entity Framework query implementation of that method therefore looks like this.

```csharp
    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var query = context.Users
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .AsNoTracking();

        return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
    }
```
The `UserParams` are passed via a query string from the response to the controller method. Note how the `PaginationHeader` is added to the response before the the reponse is sent back to the client.

```csharp
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
    {
        var users = await userRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize,
            users.TotalCount, users.TotalPages));

        return Ok(users);
    }
```

## Client Pagination

- Here is the [bootstrap component](https://valor-software.com/ngx-bootstrap/#/components/pagination?tab=overview) used to get this pagination into the SPA.

Have a look at the `member.service.ts` class to see how pagination is implemented in the Angular service. Specifically the `getMembers()` method. Note that `Pagination` and `PaginatedResult<T>` have been added to Angular to manage the results returned from the server. Note also how the `HttpParams` are sent with the request and the immutability of the `params` object.

Lastly take note of the `observe: 'response'` which ensures that the entire response (and not just the body) are made available through the observable to allow us to get to the headers. One can not typically access these headers unless the API has made the accessible via the `Access-Control-Expose-Headers` header.

The `getPaginatedResults()` uses TypeScript generics in order create a reusuable paginated get request in Angular code.

See also how the paged results are cached by using `Object.values(...)` on the parameter values.

# Time Ago

- [ngx-timeago](https://www.npmjs.com/package/ngx-timeago)

Use `npm install ngx-timeago --legacy-peer-deps` to use a pipe to convert a date to "Time ago" to get the last active etc.

Note how `member.lastActive + 'Z'` lets the client know the time is UTC which means that the browser automatically adds our offset to the original time to display it in relation to our current local time.

# Entity Framework Many-to-Many Relationships

Although later versions of Entity Framework Core allows the developer to create many-to-many relationships without creating a "join" or "bridge" entity, the results are not always desireable. For instance, the table name and foreign key names can often look quite confusing.

It is better to spend a bit of time creating the "join" entity in order for the developer to maintain control over naming conventions and this is the approach taken on this project.

For examples of how this is done, look at "Likes" and "Messages".

## Likes

When an `AppUser` can like many `AppUser`s and can be liked by many `AppUser`s we have a many to many relationship.

As stated above, self referencing many-to-many's are possible but do not allow the programmer to retain control of things like table names and foreign keys and such. So the workaround is to explicitly create a join table (`UserLike`):

| SourceUserId | LikedUserId |
| --- | --- |
|1 | 7 |
|1 | 8 |

In this case the Fluent API is being used to implement this configuration.

An `AppUser` has one `SourceUser` with many `LikedUsers`.
An `AppUser` has one `LikedUser` with many `LikedByUsers`.

The later versions of Entity Framework (from v 5) allows for the creation of a many-to-many relationship using convention such as:

```csharp
public class AppUser
{
    ...
    public List<AppUser> LikedByUsers { get; set; }
    public List<AppUser> LikedUsers { get; set; }
}
```

This approach can become quite confusing and the database table that is created (`AppUserAppUser`) is not very intuitive.

Therefore, the approach that is used here is the explicit many-to-many approach (an older approach). A `UserLike` entity is created to be the bridge table.

```csharp
public class AppUser
{
    ...
    public List<UserLike> LikedByUsers { get; set; }
    public List<UserLike> LikedUsers { get; set; }
}
```

Add in the many-to-many relationship using fluent assertion ends up being like this. Please note that for Sqlite (and just about every other database except for SQL Server) you'll use `DeleteBehavior.Cascade` for both sides. For SQL Server you must use `DeleteBehavior.NoAction` for one or the other of the relationships.

```csharp
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserLike>()
            .HasKey(k => new { k.SourceUserId, k.TargetUserId });

        //
        // If you are using SQL Server you have to specify one of these
        // to be "DeleteBehavior.NoAction" otherwise you'll get an error.
        builder.Entity<UserLike>()
            .HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers)
            .HasForeignKey(s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
            .HasOne(s => s.TargetUser)
            .WithMany(l => l.LikedByUsers)
            .HasForeignKey(s => s.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
```

## Messages

A similar thing takes place with messages.

### Restrict Delete

See `DataContext`.

```csharp
        builder.Entity<Message>()
            .HasOne(m => m.Recipient)
            .WithMany(m => m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
```

And on this occasion, the developer wants to restrict deletion because the message should not be deleted.
If the sending user removes their profile. The recipient of the message should still be able to see that message.

It shouldn't be deleted just because the user has deleted their profile.