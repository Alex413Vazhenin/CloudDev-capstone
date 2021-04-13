import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateMagazineRequest } from '../../requests/UpdateMagazineRequest'
import { updateMagazine } from '../../userActions/magazines'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const magazineId = event.pathParameters.magazineId
  const updatedMagazine: UpdateMagazineRequest = JSON.parse(event.body)

  // Update a magazine item with the provided id using values in the "updatedMagazine" object

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await updateMagazine(updatedMagazine, magazineId, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
