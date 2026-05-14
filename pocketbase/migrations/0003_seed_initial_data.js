migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let admin
    try {
      admin = app.findAuthRecordByEmail('_pb_users_auth_', 'rbetasim@yahoo.com.br')
    } catch (_) {
      admin = new Record(users)
      admin.setEmail('rbetasim@yahoo.com.br')
      admin.setPassword('Skip@Pass')
      admin.setVerified(true)
      admin.set('name', 'Admin Skip')
      admin.set('role', 'Administrador do Sistema')
      app.save(admin)
    }

    let manager
    try {
      manager = app.findAuthRecordByEmail('_pb_users_auth_', 'manager@example.com')
    } catch (_) {
      manager = new Record(users)
      manager.setEmail('manager@example.com')
      manager.setPassword('Skip@Pass')
      manager.setVerified(true)
      manager.set('name', 'Gerente Financeiro')
      manager.set('role', 'Aprovador por Alçada')
      app.save(manager)
    }

    const approvalRules = app.findCollectionByNameOrId('approval_rules')
    try {
      app.findFirstRecordByData('approval_rules', 'name', 'Gerente Financeiro')
    } catch (_) {
      const rule1 = new Record(approvalRules)
      rule1.set('name', 'Gerente Financeiro')
      rule1.set('category', 'Geral')
      rule1.set('min_amount', 0)
      rule1.set('max_amount', 5000)
      rule1.set('approver', manager.id)
      rule1.set('active', true)
      app.save(rule1)
    }

    try {
      app.findFirstRecordByData('approval_rules', 'name', 'Diretoria')
    } catch (_) {
      const rule2 = new Record(approvalRules)
      rule2.set('name', 'Diretoria')
      rule2.set('category', 'Geral')
      rule2.set('min_amount', 5001)
      rule2.set('max_amount', 9999999)
      rule2.set('approver', admin.id)
      rule2.set('active', true)
      app.save(rule2)
    }

    const requests = app.findCollectionByNameOrId('requests')
    try {
      app.findFirstRecordByData('requests', 'title', 'Compra de Laptops')
    } catch (_) {
      const req1 = new Record(requests)
      req1.set('title', 'Compra de Laptops')
      req1.set('description', '5 laptops para equipe de dev')
      req1.set('amount', 25000)
      req1.set('status', 'pending')
      req1.set('requester', admin.id)
      app.save(req1)
    }

    try {
      app.findFirstRecordByData('requests', 'title', 'Material de Escritório')
    } catch (_) {
      const req2 = new Record(requests)
      req2.set('title', 'Material de Escritório')
      req2.set('description', 'Canetas e cadernos')
      req2.set('amount', 500)
      req2.set('status', 'approved')
      req2.set('requester', admin.id)
      app.save(req2)
    }

    try {
      app.findFirstRecordByData('requests', 'title', 'Assinatura Software')
    } catch (_) {
      const req3 = new Record(requests)
      req3.set('title', 'Assinatura Software')
      req3.set('description', 'Licenças anuais')
      req3.set('amount', 1200)
      req3.set('status', 'rejected')
      req3.set('requester', admin.id)
      app.save(req3)
    }
  },
  (app) => {},
)
