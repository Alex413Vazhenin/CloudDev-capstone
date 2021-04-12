import { apiEndpoint } from '../config'
import { Magazine } from '../types/Magazines';
import { CreateMagazineRequest } from '../types/CreateMagazineRequest';
import Axios from 'axios'
import { UpdateMagazineRequest } from '../types/UpdateMagazineRequest';

export async function getMagazines(idToken: string): Promise<Magazine[]> {
  console.log('Fetching magazines')

  const response = await Axios.get(`${apiEndpoint}/magazines`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Magazines:', response.data)
  return response.data.items
}

export async function createMagazine(
  idToken: string,
  newMagazine: CreateMagazineRequest
): Promise<Magazine> {
  const response = await Axios.post(`${apiEndpoint}/magazines`,  JSON.stringify(newMagazine), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchMagazine(
  idToken: string,
  MagazineId: string,
  updatedMagazine: UpdateMagazineRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/magazines/${magazineId}`, JSON.stringify(updatedMagazine), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteMagazine(
  idToken: string,
  magazineId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/magazines/${magazineId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function generateUploadUrl(
  idToken: string,
  magazineId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/magazines/${magazineId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
