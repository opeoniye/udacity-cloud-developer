import 'source-map-support/register'
//import * as middy from 'middy'
//import { cors } from 'middy/middlewares'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AddNewsRequest } from '../../requests/AddNewsRequest'
import { getUserId } from '../utils';
import { addNews } from '../../businessLogic/news'
import { createLogger } from '../../utils/logger'

const logger = createLogger('addNews')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // NEWS: Adding a NEWS item
    logger.info('Processing event: ', event)
    
    const userId = getUserId(event)
    const newNews: AddNewsRequest = JSON.parse(event.body)

    if (newNews.newsTitle.length < 5  || newNews.newsSummary.length < 10 || newNews.newsBody.length < 10) {
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

    const newItem = await addNews(userId, newNews)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newItem
        })
    }

}
