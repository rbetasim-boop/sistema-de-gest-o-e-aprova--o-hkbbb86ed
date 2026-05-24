import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
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
  const [attachments, setAttachments] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const validFiles = files.filter((f) => f.size <= 5242880) // 5MB limit
      if (validFiles.length < files.length) {
        toast({
          title: 'Aviso',
          description: 'Alguns arquivos excedem 5MB e foram ignorados.',
          variant: 'destructive',
        })
      }
      setAttachments((prev) => [...prev, ...validFiles])
    }
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('amount', amount.toString())
      formData.append('status', 'pending')
      formData.append('requester', user.id)
      attachments.forEach((file) => formData.append('attachments', file))

      await createRequest(formData)
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
            <div className="space-y-2 pt-2">
              <Label>Anexar Orçamentos (Máx. 5MB por arquivo)</Label>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm p-2 bg-muted rounded-md"
                    >
                      <span className="truncate max-w-[300px] font-medium text-muted-foreground">
                        {file.name}{' '}
                        <span className="font-normal opacity-70">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFile(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
