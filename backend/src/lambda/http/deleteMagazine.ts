import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteMagazine } from '../../userActions/magazines'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const magazineId = event.pathParameters.magazineId

  // Remove a magazine item by id

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await deleteMagazine(magazineId, jwtToken)

  return {
    statusCode: 204,
    headers: {
      'access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
