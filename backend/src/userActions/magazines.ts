import * as uuid from 'uuid'

import { MagazineItem } from '../models/MagazineItem'
import { MagazinesAccess } from '../dataLayer/MagazinesAccess'
import { CreateMagazineRequest } from '../requests/CreateMagazineRequest'
import { UpdateMagazineRequest } from '../requests/UpdateMagazineRequest'
import { parseUserId } from '../auth/utils'

const MagazinesAccess = new MagazinesAccess()

export async function getAllMagazines(jwtToken): Promise<MagazineItem[]> {
    const userId = parseUserId(jwtToken)
    return magazinesAccess.getAllMagazines(userId)
}

export async function createMagazine(
    createMagazineRequest: CreateMagazineRequest,
    jwtToken: string
): Promise<MagazineItem> {
  
    const magazineId = uuid.v4()
    const userId = parseUserId(jwtToken)  
    const attachmentUrl = ``
    
    return await magazinesAccess.createMagazine({
      magazineId,
      userId,
      title: createMagazineRequest.title,
      topic: createMagazineRequest.topic,
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