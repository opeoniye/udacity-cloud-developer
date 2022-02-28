import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { newsFeedUser as newsFeedUser } from '../../businessLogic/news'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('newsFeedUser')

// NEWS: Get NEWS items for a current user
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    
    // Write your code here
    const userId = getUserId(event)
    const news = await newsFeedUser(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: news
      })
    }
}
