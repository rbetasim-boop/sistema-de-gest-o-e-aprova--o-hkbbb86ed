import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createRequest } from '@/services/requests'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function NewFSC() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createRequest({
        title,
        description,
        amount: Number(amount),
        status: 'pending',
        requester: user.id,
      })
      toast({ title: 'Sucesso', description: 'Solicitação criada com sucesso.' })
      navigate('/')
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao criar solicitação.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-primary">Nova Solicitação</h1>
      <Card className="shadow-subtle border-transparent">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Título / Evento</Label>
              <Input
                required
                placeholder="Ex: Compra de Material"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Detalhes adicionais da solicitação..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Total Estimado (R$)</Label>
              <Input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/20 border-t mt-4 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Solicitação'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
