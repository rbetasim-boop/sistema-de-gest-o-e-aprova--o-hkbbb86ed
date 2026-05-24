migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    users.listRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    users.viewRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    users.createRule = "@request.auth.id = '' || @request.auth.role = 'Administrador do Sistema'"
    users.updateRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    users.deleteRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"

    app.save(users)

    try {
      const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'rbetasim@yahoo.com.br')
      admin.set('role', 'Administrador do Sistema')
      app.save(admin)
    } catch (_) {
      // Ignora silenciosamente se o usuário não existir
    }
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.createRule = ''
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'

    app.save(users)

    try {
      const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'rbetasim@yahoo.com.br')
      admin.set('role', '')
      app.save(admin)
    } catch (_) {
      // Ignora silenciosamente se o usuário não existir
    }
  },
)
