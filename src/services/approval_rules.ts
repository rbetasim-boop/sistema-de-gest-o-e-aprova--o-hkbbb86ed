import pb from '@/lib/pocketbase/client'

export const getRules = () => pb.collection('approval_rules').getFullList({ expand: 'approver' })
export const createRule = (data: any) => pb.collection('approval_rules').create(data)
export const updateRule = (id: string, data: any) =>
  pb.collection('approval_rules').update(id, data)
export const deleteRule = (id: string) => pb.collection('approval_rules').delete(id)
