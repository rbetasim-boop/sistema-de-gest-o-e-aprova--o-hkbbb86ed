migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('users')

    collection.listRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    collection.viewRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    collection.createRule = "@request.auth.role = 'Administrador do Sistema'"
    collection.updateRule =
      "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    collection.deleteRule =
      "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('users')

    // Revert back to the rules prior to this migration
    collection.listRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    collection.viewRule = "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    collection.createRule =
      "@request.auth.id = '' || @request.auth.role = 'Administrador do Sistema'"
    collection.updateRule =
      "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"
    collection.deleteRule =
      "id = @request.auth.id || @request.auth.role = 'Administrador do Sistema'"

    app.save(collection)
  },
)
