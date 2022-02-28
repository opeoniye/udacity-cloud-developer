import Axios from 'axios'
import { apiEndpoint } from '../config'
import { NewsItem } from '../types/News';
import Response from "../types/response";
import { AddNewsRequest } from '../types/AddNewsRequest';
import { EditNewsRequest } from '../types/EditNewsRequest';

export async function getNewsFeedUser(idToken: string): Promise<NewsItem[]> {
  console.log('Fetching news')

  const response = await Axios.get(`${apiEndpoint}/news/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('News:', response.data)
  return response.data.items
}

export async function getNewsFeedView(idToken: string, newsId: string): Promise<Response> {
  console.log(`Fetching news for ${newsId}`)

  const response = await Axios.get(`${apiEndpoint}/news/${newsId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('NewsAPI: ', response.data)
  return response.data
}

export async function addNews(
  idToken: string,
  newNews: AddNewsRequest
): Promise<NewsItem> {
  const response = await Axios.post(`${apiEndpoint}/news`, JSON.stringify(newNews), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('News:', response.data)  
  return response.data.item
}

export async function editNews(
  idToken: string,
  newsId: string,
  updatedNews: EditNewsRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/news/${newsId}`, JSON.stringify(updatedNews), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteNews(idToken: string, newsId: string): Promise<void> {
  console.log(`Deleting news ${newsId}`)
  const response = await Axios.delete(`${apiEndpoint}/news/${newsId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('News:', response.data )
}

export async function getUploadUrl(idToken: string, newsId: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/news/${newsId}/attachment`, '', {
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
