import pb from '@/lib/pocketbase/client'

export const getUsers = () => pb.collection('users').getFullList()
export const createUser = (data: any) => {
  return pb.collection('users').create(data)
}
export const updateUser = (id: string, data: any) => {
  const payload = { ...data }
  if (!payload.password) {
    delete payload.password
    delete payload.passwordConfirm
  }
  return pb.collection('users').update(id, payload)
}
export const deleteUser = (id: string) => pb.collection('users').delete(id)
