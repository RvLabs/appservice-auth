# appservice-auth

### App Service frontend with secure calls to App Service backend api using EasyAuth

#### App Service Backend web API

1. Create App Service app and deploy code from NodeJSAPI repo
2. Configure EasyAuth with AAD and note the AppID
    1. Test the App Service site is now secured by navigating to it
    
#### App Service Frontend app

1. Create App Service app and deploy NodeJSServer code
   1. Verify app is working by navigating to it
2. Enable Authentication / Authorization using express mode
3. Provide the frontend app access to the backend app
   1. AAD > App Registration > Select the frontend app
   2. API Permissions > Add a permission > My Apis > select the backend app
4. Configure App Service security using Azure Resource Explorer
   1. On your App Service blade, under Development tools, click on Resource Explorer
   2. Click Go to launch Resource Explorer to the selected App Service.
   3. Click on Authsettings and add:
      ``` "additionalLoginParams": ["response_type=code id_token","resource=<back_end_application_id>"] ```
5. Call backend API securely from browser
   1. Enable CORS at Backend app
   2. Access EasyAuth's  token store by calling `/.auth/me` via GET op
   3. Append access_token to Authorization header: Authorization: Bearer + token

##### Reference links
* [App Service EasyAuth overview](https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization#authentication-flow)
* [Accessing and refreshing token from EasyAuth's token store](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-how-to#retrieve-tokens-in-app-code)


### App Service fronend secured with MSAL with secure calls to App Service backend API using PassportJS

The important part to remember it's that: MSAL JS is client side only and that for a NodeJS backend API a third-party library needs to be used at this time. We are using [Passport-Azure-AD](http://www.passportjs.org/packages/passport-azure-ad/)

#### Angular frontend app

#### Configure MSAL
1. app.module.ts
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
##### Reference links
