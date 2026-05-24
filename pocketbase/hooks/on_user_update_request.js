onRecordUpdateRequest((e) => {
  const auth = e.auth
  if (!auth) {
    return e.next()
  }

  const isAdmin = auth.getString('role') === 'Administrador do Sistema'

  if (!isAdmin) {
    const body = e.requestInfo().body
    // Se o usuário não é admin e está tentando modificar o campo 'role', rejeita
    if (body && body.role !== undefined) {
      throw new BadRequestError('Acesso negado', {
        role: new ValidationError(
          'forbidden',
          'Apenas administradores podem alterar o perfil de acesso.',
        ),
      })
    }
  }

  e.next()
}, 'users')
