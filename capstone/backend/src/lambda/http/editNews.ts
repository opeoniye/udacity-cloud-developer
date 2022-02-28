import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { editNews } from '../../businessLogic/news'
import { EditNewsRequest } from '../../requests/EditNewsRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('editNews')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing editNews event', event)

    const userId = getUserId(event)
    const newsId = event.pathParameters.newsId
    const updatedNews: EditNewsRequest = JSON.parse(event.body)
    
    if (updatedNews.newsTitle.length < 5  || updatedNews.newsSummary.length < 10 || updatedNews.newsBody.length < 10) {
      //throw new Error ('News content too short')
      return {
        statusCode: 406,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: 'News content too short'
        })
      }
    }

    await editNews(userId, newsId, updatedNews)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
}
