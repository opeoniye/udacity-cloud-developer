import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteNews } from '../../businessLogic/news'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    logger.info('Processing deleteNews event', event)

    // NEWS: Remove a NEWS item by id
    const userId = getUserId(event)
    const newsId = event.pathParameters.newsId
    
    await deleteNews(newsId, userId)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
}
