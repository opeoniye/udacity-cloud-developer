import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { newsFeedView as newsFeedView } from '../../businessLogic/news'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('newsFeedView')

// NEWS: Get selected NEWS item for public user
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    
    // Write your code here
    const userId = getUserId(event)
    const newsId = event.pathParameters.newsId
    const news = await newsFeedView(userId, newsId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
        //'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: news
      })
    }
}
