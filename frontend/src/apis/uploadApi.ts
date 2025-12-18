import baseApi from "./baseApi"

export const uploadLocalImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await baseApi.post('/Upload/image', formData)
    return data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 