import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/MagazinesAccess'
import { CreateTodoRequest } from '../requests/CreateMagazineRequest'
import { UpdateTodoRequest } from '../requests/UpdateMagazineRequest'
import { parseUserId } from '../auth/utils'

const todosAccess = new TodosAccess()

export async function getAllTodos(jwtToken): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return todosAccess.getAllTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {
  
    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)  
    const attachmentUrl = ``
    
    return await todosAccess.createTodo({
      todoId,
      userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: attachmentUrl
    })
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    todoId: string, jwtToken:string) {
    const userId = parseUserId(jwtToken)

return await todosAccess.updateTodo({
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
},
    userId, todoId)    
    }
export async function deleteTodo(
    todoId: string, jwtToken: string
    ) {
    const userId = parseUserId(jwtToken)
    
return await todosAccess.deleteTodo(todoId, userId)
}

export function generateUploadUrl(todoId) {
    const signedUrl = todosAccess.generateUploadUrl(todoId)
    return signedUrl
}

export async function updateTodoUrl(todoId: string, jwtToken){
    const userId = parseUserId(jwtToken)
    return await todosAccess.updateTodoUrl(
        userId,
        todoId
    )
}