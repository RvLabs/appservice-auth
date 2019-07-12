// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  aad: {
    clientID: "d3964db2-6860-4997-bcc6-1e15cfe0e6fb",
    authority: "https://login.microsoftonline.com/common/"
  },
  apps: {
    frontend: {
      url: "http://localhost:4200",
      appId: "d3964db2-6860-4997-bcc6-1e15cfe0e6fb",
      scope: {
        endpoint: "api://d3964db2-6860-4997-bcc6-1e15cfe0e6fb",
        consent: "api://d3964db2-6860-4997-bcc6-1e15cfe0e6fb/frontend.read"
      }
    },
    backend: {
      url: "http://localhost:3001/api/profiles",
      appId: "2318f86a-f186-4e0f-bd11-c9d357787879",
      scope: {
        endpoint: "api://2318f86a-f186-4e0f-bd11-c9d357787879",
        consent: "api://2318f86a-f186-4e0f-bd11-c9d357787879/api.read"
      }
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
