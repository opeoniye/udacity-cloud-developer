import { NewsDynamoDB } from '../dataLayer/dynamoDB'
import { NewsS3 } from '../fileStorage/S3';
import { NewsItem } from '../models/NewsFeed'
import { NewsUpdate } from '../models/NewsUpdate'
import { AddNewsRequest } from '../requests/AddNewsRequest'
import { EditNewsRequest } from '../requests/EditNewsRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('news')
const newsAccess = new NewsDynamoDB()
const newsStorage = new NewsS3()

// NEWS: Implement businessLogic
export async function newsFeed(newsId: string): Promise<NewsItem[]> {

    logger.info(`newsFeed function`)

    return await newsAccess.getNewsFeed(newsId)
}

export async function newsFeedUser(userId: string): Promise<NewsItem[]> {

    logger.info(`newsFeedUser function`)

    return await newsAccess.getNewsFeedUser(userId)
}

export async function newsFeedView(userId: string, newsId: string): Promise<NewsItem> {

    logger.info(`newsFeedView function`)

    return await newsAccess.getNewsFeedView(userId, newsId)
}

export async function addNews(userId: string, addNewsRequest: AddNewsRequest
): Promise<NewsItem> {

    logger.info('addNews function')

    const newsId = uuid.v4()
    const newItem: NewsItem = {
        userId,
        newsId,
        newsTitle: addNewsRequest.newsTitle,
        newsSummary: addNewsRequest.newsSummary,
        newsBody: addNewsRequest.newsBody,
        newsTime: new Date().toISOString(),
        //done: false,
        attachmentUrl: null,
      }

    await newsAccess.addNewsItem(newItem)
    return newItem
}
    
export async function editNews(userId: string, newsId: string, editNewsRequest: EditNewsRequest) {
    
    logger.info('editNews function')

    const item = await newsAccess.getNewsFeedView(userId, newsId)

    if (!item)
        throw new Error('News item not found')

    if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update ${newsId}`)
    throw new Error('User is not authorized to ')
    }

    await newsAccess.editNewsItem(newsId, userId, editNewsRequest as NewsUpdate)
}

export async function deleteNews(newsId: string, userId: string ) {
    logger.info(`deleteNews function`)

    const item = await newsAccess.getNewsFeedView(userId, newsId)

    if (!item)
        throw new Error('Todo item not found')

    if (item.userId !== userId) {
        throw new Error('Unauthorized user')
    }

    await newsAccess.deleteNewsItem(newsId, userId)
}

export async function generateUploadUrl(attachmentId: string, urlTimeout: number): Promise<string> {
    logger.info(`generateUploadUrl function`)
  
    const uploadUrl = await newsStorage.getUploadUrl(attachmentId, urlTimeout)
  
    return uploadUrl
}

export async function newsImageUrl(userId: string, newsId: string, attachmentId: string) {
    logger.info(`newsImageUrl function`)

    const attachmentUrl = await newsStorage.getAttachmentUrl(attachmentId)

    const item = await newsAccess.getNewsFeedView(userId, newsId)

    if (!item)
        throw new Error('Attachment url not found')

    if (item.userId !== userId) {
        throw new Error('Unauthorized user')
    }

    await newsAccess.newsImageUrl(newsId, userId, attachmentUrl)

}

