# Setup instructions

Originally setup via course using node v16.16.0 and Angular 14.2.10 using the following commands:

```
nvm install 16.16.0
npm install -g @angular/cli@14
```

# Development Commands

To run the API Server you'll use `dotnet watch --no-hot-reload`. To update the database after making changes you'll use `dotnet ef database update`. To run Angular you'll use use `ng serve`.

# Use HTTPS (for Angular)

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