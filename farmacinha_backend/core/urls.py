from django.urls import path
from . import views

urlpatterns = [
    # Cadastro de Usuário
    path('clientes/cadastrar/', views.cadastro_usuario, name='cliente-create'),  # Cadastro de Cliente
    path('atendentes/cadastrar/', views.cadastro_usuario, name='atendente-create'),  # Cadastro de Atendente
    
    # Login de Usuário - Cliente
    path('clientes/login/', views.login_cliente, name='cliente-login'),  # Login de Cliente
    
    # Login de Usuário - Atendente
    path('atendentes/login/', views.login_atendente, name='atendente-login'),  # Login de Atendente

    # Perfil do Usuário (dados do usuário logado)
    path('usuario/perfil/', views.perfil_usuario, name='perfil-usuario'),

    # Redefinir Senha
    path('redefinir-senha/', views.gerar_codigo_redefinicao_senha, name='gerar_codigo_redefinicao_senha'),
    path('validar-codigo/', views.validar_codigo_redefinicao, name='validar_codigo_redefinicao'),

    # Outros endpoints
    path('api/usuario/perfil/', views.PerfilUsuarioView.as_view(), name='perfil-usuario'),
    path('usuario/atualizar/', views.atualizar_usuario, name='atualizar-usuario'),
    path('usuario/excluir/', views.excluir_usuario, name='excluir-usuario'),
    path('validar-cnpj/', views.validar_cnpj, name='validar-cnpj'),
    path('validar-receita/', views.validar_receita, name='validar-receita'),
    path('sugerir-medicamento/', views.sugerir_medicamento, name='sugerir-medicamento'),
    path('medicamento/cadastrar/', views.cadastro_medicamento, name='cadastro-medicamento'),
    path('legislacao/cadastrar/', views.cadastro_legislacao, name='cadastro-legislacao'),
    path('consulta-legislacao/', views.consulta_legislacao, name='consulta-legislacao'),
]
