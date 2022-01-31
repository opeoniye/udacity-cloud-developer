import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodoDynamoDB {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosTableIndex = process.env.TODOS_CREATED_AT_INDEX
        ) {
    }

    async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
        logger.info(`Getting ToDo item for current user ${userId}`)

        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()

        const items = result.Item
        return items as TodoItem
    }

    async getTodoItems(userId: string): Promise<TodoItem[]> {
        logger.info(`Getting all ToDo items for current user ${userId}`)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosTableIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem) {
        logger.info(`Creating ToDo item`)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem,
        }).promise()
    }

    async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate) {
        logger.info(`Updating Todo item ${todoId} for current user ${userId}`)

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
                "#name": "name",
                "#dueDate": "dueDate",
                "#done": "done"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done
            }
        }).promise()
    }

    async deleteTodoItem(todoId: string, userId: string) {
        logger.info(`Deleting Todo item ${todoId} for current user ${userId}`)
        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        })
    }

    async updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string) {
        logger.info(`Updating attachment url ${attachmentUrl} for ${todoId}`)

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl
            }
        }).promise()
    }

}