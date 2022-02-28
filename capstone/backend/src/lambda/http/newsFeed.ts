import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { newsFeed as newsFeed } from '../../businessLogic/news'
import { createLogger } from '../../utils/logger'

const logger = createLogger('newsFeed')

// NEWS: Get all NEWS items for public user
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    
    const newsId = event.pathParameters.newsId
    const news = newsFeed(newsId)

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
