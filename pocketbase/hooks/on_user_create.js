onRecordCreate((e) => {
  // Marca novos usuários como verificados automaticamente para não exigir confirmação de email
  e.record.setVerified(true)
  e.next()
}, 'users')
