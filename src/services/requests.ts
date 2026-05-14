import pb from '@/lib/pocketbase/client'

export const getRequests = () =>
  pb.collection('requests').getFullList({ expand: 'requester', sort: '-created' })
export const createRequest = (data: any) => pb.collection('requests').create(data)
export const updateRequest = (id: string, data: any) => pb.collection('requests').update(id, data)
export const deleteRequest = (id: string) => pb.collection('requests').delete(id)
