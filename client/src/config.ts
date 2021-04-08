// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'hhpuq4jbd6'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-r82qdi-o.eu.auth0.com',            // Auth0 domain
  clientId: 'rOaXeV9iART4aylm48KiTvpJprem7q2f',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
