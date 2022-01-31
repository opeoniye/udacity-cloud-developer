import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
//import * as middy from 'middy'
//import { cors, httpErrorHandler } from 'middy/middlewares'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info('Processing generateUploadUrl  event', event)

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const attachmentId = uuid.v4()
    const urlTimeout = process.env.SIGNED_URL_EXPIRATION

    const uploadUrl = await generateUploadUrl(attachmentId, Number(urlTimeout))

    await updateAttachmentUrl(userId, todoId, attachmentId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }    

}


//handler
//  .use(httpErrorHandler())
//  .use(
//    cors({
//      credentials: true
//    })
//  )
