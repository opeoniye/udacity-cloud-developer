import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { NewsItem } from '../models/NewsFeed'
import { NewsUpdate } from '../models/NewsUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('newsDynamoDB')

// NEWS: Implement the dataLayer logic
export class NewsDynamoDB {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly newsTable = process.env.TRIPLE_LOVE_NEWS,
        private readonly newsTableUserIndex = process.env.TRIPLE_LOVE_NEWS_USERID_INDEX,
        private readonly newsTableNewsIndex = process.env.TRIPLE_LOVE_NEWS_NEWSID_INDEX
        ) {
    }

    async getNewsFeed(newsId: string): Promise<NewsItem[]> {
        logger.info('Getting all NEWS items')

        //const newsId = newsId.NewsItem
        const result = await this.docClient.query({
            TableName: this.newsTable,
            IndexName: this.newsTableNewsIndex,
            KeyConditionExpression: 'newsId = :newsId',
            ExpressionAttributeValues: {
                ':newsId': newsId
            }
        }).promise()

        const items = result.Items
        return items as NewsItem[]
    } 

    async getNewsFeedUser(userId: string): Promise<NewsItem[]> {
        logger.info(`Getting all News for current user ${userId}`)

        const result = await this.docClient.query({
            TableName: this.newsTable,
            IndexName: this.newsTableUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as NewsItem[]
    }
    
    async getNewsFeedView(userId: string, newsId: string): Promise<NewsItem> {
        logger.info(`View NEWS item ${newsId}`)

        const result = await this.docClient.get({
            TableName: this.newsTable,
            Key: {
                userId,
                newsId
            }
        }).promise()

        const items = result.Item
        return items as NewsItem
    }

    async addNewsItem(newsItem: NewsItem) {
        logger.info(`Creating News item`)

        await this.docClient.put({
            TableName: this.newsTable,
            Item: newsItem,
        }).promise()
    }

    async editNewsItem(newsId: string, userId: string, newsUpdate: NewsUpdate) {
        logger.info(`Updating News item ${newsId} for current user ${userId}`)

        await this.docClient.update({
            TableName: this.newsTable,
            Key: {
                newsId,
                userId
            },
            UpdateExpression: 'set #newsTitle = :newsTitle, #newsSummary = :newsSummary, #newsBody = :newsBody',
            ExpressionAttributeNames: {
                "#newsTitle": "newsTitle",
                "#newsSummary": "newsSummary",
                "#newsBody": "newsBody"
            },
            ExpressionAttributeValues: {
                ":newsTitle": newsUpdate.newsTitle,
                ":newsSummary": newsUpdate.newsSummary,
                ":newsBody": newsUpdate.newsBody
            }
        }).promise()
    }

    async deleteNewsItem(newsId: string, userId: string) {
        logger.info(`Deleting News item ${newsId} for current user ${userId}`)
        
        await this.docClient.delete({
            TableName: this.newsTable,
            Key: {
                newsId,
                userId
            }
        }).promise()
    }

    async newsImageUrl(newsId: string, userId: string, attachmentUrl: string) {
        logger.info(`Updating attachment url ${attachmentUrl} for ${newsId}`)

        await this.docClient.update({
            TableName: this.newsTable,
            Key: {
                newsId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl
            }
        }).promise()
    }

}