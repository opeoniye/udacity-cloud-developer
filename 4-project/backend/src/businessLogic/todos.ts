import { TodoDynamoDB } from '../dataLayer/todoDynamoDB'
import { TodoS3 } from '../fileStorage/todoS3';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

const logger = createLogger('todos')

const todosAccess = new TodoDynamoDB()
const todosStorage = new TodoS3()

// TODO: Implement businessLogic
export async function getTodos(userId: string): Promise<TodoItem[]> {

    logger.info(`getTodo function`)

    return await todosAccess.getTodoItems(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {

    logger.info('createTodo function')

    const todoId = uuid.v4()
    const newItem: TodoItem = {
        userId,
        todoId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
      }

    await todosAccess.createTodoItem(newItem)
    return newItem
}
    
export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    
    logger.info('updateTodo function')

    const item = await todosAccess.getTodoItem(todoId, userId)

    if (!item)
        throw new Error('Todo item not found')

    if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update ${todoId}`)
    throw new Error('User is not authorized to ')
    }

    await todosAccess.updateTodoItem(todoId, userId, updateTodoRequest as TodoUpdate)
}

export async function deleteTodo(todoId: string, userId: string ) {
    logger.info(`deleteTodo function`)

    const item = await todosAccess.getTodoItem(todoId, userId)

    if (!item)
        throw new Error('Todo item not found')

    if (item.userId !== userId) {
        throw new Error('Unauthorized user')
    }

    await todosAccess.deleteTodoItem(todoId, userId)
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
    logger.info(`updateAttachmentUrl function`)

    const attachmentUrl = await todosStorage.getAttachmentUrl(attachmentId)

    const item = await todosAccess.getTodoItem(todoId, userId)

    if (!item)
        throw new Error('Attachment url not found')

    if (item.userId !== userId) {
        throw new Error('Unauthorized user')
    }

    await todosAccess.updateAttachmentUrl(todoId, userId, attachmentUrl)

}

export async function generateUploadUrl(attachmentId: string, urlTimeout: number): Promise<string> {
    logger.info(`generateUploadUrl function`)
  
    const uploadUrl = await todosStorage.getUploadUrl(attachmentId, urlTimeout)
  
    return uploadUrl
}

