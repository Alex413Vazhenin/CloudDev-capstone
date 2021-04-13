import * as uuid from 'uuid'

import { MagazineItem } from '../models/MagazineItem'
import { MagazinesAccess } from '../dataLayer/MagazinesAccess'
import { CreateMagazineRequest } from '../requests/CreateMagazineRequest'
import { UpdateMagazineRequest } from '../requests/UpdateMagazineRequest'
import { parseUserId } from '../auth/utils'

const magazinesAccess = new MagazinesAccess()

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

export async function updateMagazine(
    updateMagazineRequest: UpdateMagazineRequest,
    magazineId: string, jwtToken:string) {
    const userId = parseUserId(jwtToken)

return await magazinesAccess.updateMagazine({
    title: updateMagazineRequest.title,
    topic: updateMagazineRequest.topic,
},
    userId, magazineId)    
    }
export async function deleteMagazine(
    magazineId: string, jwtToken: string
    ) {
    const userId = parseUserId(jwtToken)
    
return await magazinesAccess.deleteMagazine(magazineId, userId)
}

export function generateUploadUrl(magazineId) {
    const signedUrl = magazinesAccess.generateUploadUrl(magazineId)
    return signedUrl
}

export async function updateMagazineUrl(magazineId: string, jwtToken){
    const userId = parseUserId(jwtToken)
    return await magazinesAccess.updateMagazineUrl(
        userId,
        magazineId
    )
}