# appservice-auth

## App Service frontend with secure calls to App Service backend api using EasyAuth

### App Service Backend web API
The backapi is a simple NodeJS application that reads a local json file to return a set of profile data to a client.

#### Deploy the backend API
For this sample to work, deploy `AppServiceEasyAuth/BackendNodejs/` to an App Service. Alternatively, you can deploy your own code for the backend API.

#### Configure Authentication / Authorization for your backend API
To secure your backend API app deployed in App Service, simply enable EasyAuth. From the App Service blade, under the **Setting** section, click **Authentication / Authorization**. Then set the following:
* App Service Authentication to **On**.
* Action to take when request is not authenticated to **Login with Azure Active Directory**.
* Authentication Providers, configure **Azure Active Directory**. 
  * Management mode set to **Express** and provide a unique name for your Azure AD App.
  * Make sure you write down the AppID, you will need this later.

Click **Ok** and make sure to click **Save** before moving on and for changes to apply. You can now navigate to your app's URL and instead of getting your app, you are now presented with an authentication prompt before getting to your app.
    
### App Service Frontend app
The frontend is composed of two applications. The first one is Frontsrv (`AppServiceEasyAuth/FrontendNodejs/`), which is a NodeJS app that is used to deliver assets to browser. The second one is Frontapp (`AppServiceEasyAuth/FrontendAngular/`), which is an Angular application (the assets). We used Azure pipelines to automate the build of the entire frontend.

#### Deploy the frontend app
This sample assumes the Angular app (Frontapp) is in the `frontend\dist\frontend` folder in the root of the NodeJS app (Frontapp)

You can verify the app is working correctly by navigating to its URL before configuring EasyAuth.

#### Configure Authentication / Authorization for your frontend APP
This configuration is exactly the same as for the backend API, however, make sure to specify a new unique name when you set the Management mode to **Express**. 

#### AAD App Registration API permissions
We now need to ensure that the frontend app registration has access to the backend app registration. To do this, from the Azure portal, launch Azure Active Directory. From its blade, under the **General** section click on **App Registration** and find your App (which was automatically created by App Service when enabling EasyAuth). 

On the App Registration blade, under the **General** section, click on **API Permissions**. Now click on **Add a permission** select **My APIs** and find and select your backend app registration. 

#### App Service additional login params
Before our frontend can access our backend app, we need to additional parameters to our app. This is easily done using **Resource Explorer**. Navigate to your App Serivce app and on the blade, under the **Development** section, click on **Resource Explorer** and then on **Go**. This will launch the portal and take you to the specific instance of the service. 

Expand the config property, and click on **authsetting**. Enable editing by clicking **Edit** on the top section, and change `
"additionalLoginParams": null` to ` "additionalLoginParams": ["response_type=code id_token","resource=<back_end_application_id>"] `. Click on **PUT** on the top section to save the changes. 

#### Call backend API securely from browser
Now that EasyAuth is configured in for both apps, you can now make secure calls from your frontend to your backend. To do this, all calls to the backend need to have the header `Authorization: Bearer + access_token` set. 

For your frontend app, which runs and executes client side, to access the token store created by EasyAuth, your app needs to send a `GET` to `/.auth/me`. This endpoint is only exposed when EasyAuth is enabled, and it returns information about the user logged in. 

##### Reference links
* [App Service EasyAuth overview](https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization#authentication-flow)
* [Accessing and refreshing token from EasyAuth's token store](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-how-to#retrieve-tokens-in-app-code)


## App Service frontend secured with MSAL with secure calls to App Service backend API using PassportJS

The important part to remember it's that: MSAL JS is client side only and that for a NodeJS backend API a third-party library needs to be used at this time. We are using [Passport-Azure-AD](http://www.passportjs.org/packages/passport-azure-ad/)

### Angular frontend app
Angular app is using MSAL-Angular for authorization

#### app.module.ts
```javascript
export const protectedResourceMap:[string, string[]][]=[ 
  ['https://my-api.site.com/api/getitems',['app://<appID>/items.read', 'app://<appID>>/items.edit']],
  ['https://my-api.site.com/api/getprofiles',['app://<appID>/profiles.read', 'app://<appID>>/profiles.edit']]
];

.....

@NgModule({
  declarations: [ ... ],
  imports: [ ... ,
    MsalModule.forRoot ({       // Configure MSAL module to use our AAD, consent, and protected resources
      clientID: environment.aad.clientID,
      authority: environment.aad.authority,
      consentScopes: [ 'app://<appID>/profiles.read', 'app://<appID>>/profiles.edit' ],
      protectedResourceMap: protectedResourceMap,
      logger: loggerCallback,
      level: LogLevel.Verbose,
      piiLoggingEnabled: true
    })
  ],
  providers: [ ... ,
    {
      provide: HTTP_INTERCEPTORS,   // MSAL HTTP interceptor
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  ...
  
```

#### app-routing.module.ts
All routes that are defined with `canActivate: MSALGurad` will require authentication / authorization. Our app only requires it for our only route
```
const routes: Routes = [
  { path: 'profiles', component: ProfilesComponent, canActivate: [MsalGuard]}
];
```

#### profile-data.service.ts
This service calls our backend API and append the `access_token` in the Authorization header
```
  getProfiles(token): Observable<any> {
    return this.http.get(environment.apps.backend.url, 
                          {headers: {'Authorization': 'Bearer ' + token, 'X-ZUMO-AUTH': token}, 
                          observe: 'response'});
  }
```

### Backend API with Passport.js
Our backend api app is being protected from unauthorized access using **Passport-Azure-AD** with the **Bearer Strategy**. All the backend app will do, it's verify the token it has received.

#### Configure Passport-Azure-AD
[Passport-Azure-Add documentation](http://www.passportjs.org/packages/passport-azure-ad/)

#### Protect app routes
The library will automatically obtain the `Authentication` header from the request and verify the token attached.
```
app.get('/api/profiles', passport.authenticate('oauth-bearer', { session: false }), function(req, res, next) {
    console.log('Headers are: ' + JSON.stringify(req.headers));
    fs.readFile('../BackendNodejs/profiles.json', (err, jsonData) => {
      if (err) {
        console.log("Error reading file: ", err)
        return
      }
      
      jsonProfiles = JSON.parse(jsonData);
  
      res.send(jsonProfiles);
  
    })
  });
```

##### Reference links
* [MSAL for JavaScript documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
* [MSAL Angular preview documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)
* [MSAL JS Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki)
* [Passport-Azure-Add documentation](http://www.passportjs.org/packages/passport-azure-ad/)
