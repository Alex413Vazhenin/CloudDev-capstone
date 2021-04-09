import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl, updateMagazineUrl } from '../../userActions/magazines'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const magazineId = event.pathParameters.magazineId

  // TODO: Return a presigned URL to upload a file for a magazine item with the provided id

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  const signedUrl = generateUploadUrl(magazineId)
  await updateMagazineUrl(magazineId, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
