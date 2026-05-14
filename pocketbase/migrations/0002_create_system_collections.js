migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('department')) {
      users.fields.add(new TextField({ name: 'department' }))
    }
    if (!users.fields.getByName('role')) {
      users.fields.add(new TextField({ name: 'role' }))
    }
    app.save(users)

    const approvalRules = new Collection({
      name: 'approval_rules',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'category', type: 'text' },
        { name: 'min_amount', type: 'number', required: true },
        { name: 'max_amount', type: 'number', required: true },
        {
          name: 'approver',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_approval_rules_approver ON approval_rules (approver)'],
    })
    app.save(approvalRules)

    const requests = new Collection({
      name: 'requests',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'amount', type: 'number', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'approved', 'rejected'],
          maxSelect: 1,
        },
        {
          name: 'requester',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_requests_requester ON requests (requester)',
        'CREATE INDEX idx_requests_status ON requests (status)',
      ],
    })
    app.save(requests)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('approval_rules'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('requests'))
    } catch (_) {}
  },
)
