// NEWS: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'dxi3no2kzj'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // NEWS: Create an Auth0 application and copy values from it into this map.
  domain: 'opeoniye.us.auth0.com',                // Auth0 domain
  clientId: 'QmuSIwWGAWLieiJlP6gS4ci8jqnUePsB',   // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
