from datetime import timedelta
import random
import string
from django.conf import settings
from django.utils import timezone

from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from .models import CodigoRedefinicaoSenha, Usuario, Medicamento, Legislacao, LogAcao
import requests
import bcrypt
import json
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import SessionAuthentication
from django.core.mail import send_mail

# Função para verificar se o usuário é administrador
def is_admin(user):
    return user.is_admin


# RF-01: Validação de Receitas - Consultar medicamentos por nome ou princípio ativo
@csrf_exempt
def validar_receita(request):
    if request.method == 'GET':
        nome = request.GET.get('nome', '')
        principio_ativo = request.GET.get('principio_ativo', '')

        if nome:
            medicamento = Medicamento.objects.filter(nome_medicamento__icontains=nome).first()
        elif principio_ativo:
            medicamento = Medicamento.objects.filter(principio_ativo__icontains=principio_ativo).first()

        if medicamento:
            dados = {
                "nome_medicamento": medicamento.nome_medicamento,
                "principio_ativo": medicamento.principio_ativo,
                "tipo": medicamento.tipo,
                "legislacao": {
                    "requisitos": medicamento.legislacao.requisitos,
                    "tempo_tratamento": medicamento.legislacao.tempo_tratamento,
                    "validade_receituario": medicamento.legislacao.validade_receituario,
                }
            }
            return JsonResponse(dados)

        return JsonResponse({"erro": "Medicamento não encontrado"}, status=404)
    return JsonResponse({"erro": "Método HTTP inválido, use GET"}, status=405)


# RF-02: Identificação de Medicamentos - Sugestão de medicamentos ao digitar 3 ou mais caracteres
@csrf_exempt
def sugerir_medicamento(request):
    if request.method == 'GET':
        termo = request.GET.get('termo', '')
        if len(termo) < 3:
            return JsonResponse({"erro": "Informe pelo menos 3 caracteres para busca"}, status=400)

        medicamentos = Medicamento.objects.filter(nome_medicamento__icontains=termo)[:10]
        sugestoes = [{"nome": med.nome_medicamento, "principio_ativo": med.principio_ativo} for med in medicamentos]
        return JsonResponse({"sugestoes": sugestoes})

    return JsonResponse({"erro": "Método HTTP inválido, use GET"}, status=405)


# RF-03: Consulta e Explicação de Legislação
@csrf_exempt
def consulta_legislacao(request):
    if request.method == 'GET':
        legislacao_id = request.GET.get('legislacao_id')
        if legislacao_id:
            legislacao = Legislacao.objects.filter(id=legislacao_id).first()
            if legislacao:
                dados = {
                    "titulo": legislacao.titulo,
                    "requisitos": legislacao.requisitos,
                    "tempo_tratamento": legislacao.tempo_tratamento,
                    "validade_receituario": legislacao.validade_receituario,
                }
                return JsonResponse(dados)

            return JsonResponse({"erro": "Legislação não encontrada"}, status=404)

        return JsonResponse({"erro": "ID da legislação não informado"}, status=400)
    return JsonResponse({"erro": "Método HTTP inválido, use GET"}, status=405)


# RF-04: Cadastro de Medicamentos (somente administradores)
@csrf_exempt
@login_required
@user_passes_test(is_admin)
def cadastro_medicamento(request):
    if request.method == 'POST':
        nome = request.POST.get('nome_medicamento')
        principio_ativo = request.POST.get('principio_ativo')
        dosagem = request.POST.get('dosagem')
        tipo = request.POST.get('tipo')
        fabricante = request.POST.get('fabricante')
        legislacao_id = request.POST.get('legislacao_id')

        if not nome or not principio_ativo or not dosagem or not tipo or not fabricante or not legislacao_id:
            return JsonResponse({"erro": "Campos obrigatórios ausentes."}, status=400)

        legislacao = Legislacao.objects.get(id=legislacao_id)

        medicamento = Medicamento.objects.create(
            nome_medicamento=nome,
            principio_ativo=principio_ativo,
            dosagem=dosagem,
            tipo=tipo,
            fabricante=fabricante,
            legislacao=legislacao
        )

        # Log da ação de cadastro
        LogAcao.objects.create(usuario=request.user, acao=f"Medicamento {medicamento.nome_medicamento} cadastrado com sucesso!")

        return JsonResponse({"mensagem": f"Medicamento {medicamento.nome_medicamento} cadastrado com sucesso!"})

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


# RF-05: Cadastro de Legislação (somente administradores)
@csrf_exempt
@login_required
@user_passes_test(is_admin)
def cadastro_legislacao(request):
    if request.method == 'POST':
        titulo = request.POST.get('titulo')
        requisitos = request.POST.get('requisitos')
        tempo_tratamento = request.POST.get('tempo_tratamento')
        validade_receituario = request.POST.get('validade_receituario')
        intercambialidade_med = request.POST.get('intercambialidade_med')

        if not titulo or not requisitos or not tempo_tratamento or not validade_receituario or not intercambialidade_med:
            return JsonResponse({"erro": "Campos obrigatórios ausentes."}, status=400)

        legislacao = Legislacao.objects.create(
            titulo=titulo,
            requisitos=requisitos,
            tempo_tratamento=tempo_tratamento,
            validade_receituario=validade_receituario,
            intercambialidade_med=intercambialidade_med
        )

        # Log da ação de cadastro
        LogAcao.objects.create(usuario=request.user, acao=f"Legislação {legislacao.titulo} cadastrada com sucesso!")

        return JsonResponse({"mensagem": f"Legislação {legislacao.titulo} cadastrada com sucesso!"})

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


# RF-07: Cadastro do Usuário (Cliente ou Atendente)
@csrf_exempt
def cadastro_usuario(request):
    if request.method == 'POST':
        try:
            # Recebendo dados no formato JSON
            data = json.loads(request.body)
            print("Dados recebidos:", data)  # Para debug

            nome = data.get('nome')
            cpf = data.get('cpf')  # Para clientes
            cnpj = data.get('cnpj')  # Para atendentes
            email = data.get('email')
            senha = data.get('senha')

            # Verificando campos obrigatórios
            if not nome or not email or not senha:
                return JsonResponse({"erro": "Campos obrigatórios ausentes."}, status=400)

            # Validação para garantir que CNPJ ou CPF seja enviado corretamente
            if cnpj and cpf:
                return JsonResponse({"erro": "Não é permitido preencher CNPJ e CPF ao mesmo tempo."}, status=400)

            if cnpj:
                # Caso seja atendente, criar usuário com CNPJ
                usuario = Usuario.objects.create_user(
                    nome=nome, email=email, senha=senha, cnpj=cnpj)
            elif cpf:
                # Caso seja cliente, criar usuário com CPF
                usuario = Usuario.objects.create_user(
                    nome=nome, email=email, senha=senha, cpf=cpf)
            else:
                return JsonResponse({"erro": "CNPJ ou CPF é obrigatório."}, status=400)

            return JsonResponse({"mensagem": f"Usuário {nome} cadastrado com sucesso!"})

        except json.JSONDecodeError:
            return JsonResponse({"erro": "Dados inválidos ou malformados."}, status=400)

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


# RF-08: Login de Usuário
@csrf_exempt
def login_cliente(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        cpf = data.get('cpf')
        senha = data.get('senha')

        if not cpf or not senha:
            return JsonResponse({"erro": "Campos de CPF e senha são obrigatórios."}, status=400)

        usuario = Usuario.objects.filter(cpf=cpf).first()

        if usuario and usuario.check_password(senha):
            # Django irá automaticamente criar e manter a sessão do usuário
            login(request, usuario)

            # Não precisamos gerar o token, pois a sessão já foi criada.
            return JsonResponse({"mensagem": f"Login realizado com sucesso, {usuario.nome}!"})

        return JsonResponse({"erro": "Credenciais inválidas."}, status=400)

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


@csrf_exempt
def login_atendente(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data.get('email')
        senha = data.get('senha')

        if not email or not senha:
            return JsonResponse({"erro": "Campos de email e senha são obrigatórios."}, status=400)

        usuario = Usuario.objects.filter(email=email).first()

        if usuario and usuario.check_password(senha):
            # Django irá automaticamente criar e manter a sessão do usuário
            login(request, usuario)

            # Não precisamos gerar o token, pois a sessão já foi criada.
            return JsonResponse({"mensagem": f"Login realizado com sucesso, {usuario.nome}!"})

        return JsonResponse({"erro": "Credenciais inválidas."}, status=400)

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


# RF-10: Validação do Cadastro de Atendente (Validação de CNPJ)
@csrf_exempt
def validar_cnpj(request):
    cnpj = request.GET.get('cnpj')
    if not cnpj:
        return JsonResponse({"erro": "CNPJ não informado"}, status=400)

    url = f'https://open.cnpja.com/office/{cnpj}'
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return JsonResponse({"validado": True})
        else:
            return JsonResponse({"validado": False, "erro": "CNPJ inválido ou não encontrado"}, status=400)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"erro": f"Erro na validação do CNPJ: {str(e)}"}, status=500)


# RF-11: Atualização de Dados do Usuário
@csrf_exempt
@login_required
def atualizar_usuario(request):
    if request.method == 'POST':
        nome = request.POST.get('nome', request.user.nome)
        email = request.POST.get('email', request.user.email)
        telefone = request.POST.get('telefone', request.user.telefone)
        cnpj = request.POST.get('cnpj', request.user.cnpj)

        usuario = request.user
        usuario.nome = nome
        usuario.email = email
        usuario.telefone = telefone
        usuario.cnpj = cnpj
        usuario.save()

        # Log da ação de atualização
        LogAcao.objects.create(usuario=request.user, acao=f"Dados do usuário {usuario.nome} atualizados.")

        return JsonResponse({"mensagem": "Dados atualizados com sucesso!"})

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


# RF-11: Exclusão de Conta do Usuário
@csrf_exempt
@login_required
def excluir_usuario(request):
    if request.method == 'POST':
        senha = request.POST.get('senha')
        usuario = request.user

        if bcrypt.checkpw(senha.encode('utf-8'), usuario.password.encode('utf-8')):  # Verificar senha
            usuario.delete()
            # Log da ação de exclusão
            LogAcao.objects.create(usuario=request.user, acao=f"Usuário {usuario.nome} excluído.")
            return JsonResponse({"mensagem": "Usuário excluído com sucesso!"})

        return JsonResponse({"erro": "Senha incorreta"}, status=400)

    return JsonResponse({"erro": "Método HTTP inválido, use POST"}, status=405)


@login_required
def perfil_usuario(request):
    """Retorna os dados do perfil do usuário logado"""
    usuario = request.user
    dados = {
        "nome": usuario.nome,
        "cpf": usuario.cpf,
        "email": usuario.email,
        "telefone": usuario.telefone,
        "cnpj": usuario.cnpj if usuario.cnpj else None,  # CNPJ só existe para atendentes
    }
    return JsonResponse(dados)


class PacienteView(APIView):
    # Define que o usuário deve estar autenticado para acessar o endpoint
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Obtemos o usuário autenticado do request (a partir do JWT)
        user = request.user
        
        # Verificamos se o usuário tem as informações necessárias
        if user.is_authenticated:
            # Aqui você pode pegar o nome do paciente do modelo User ou de um modelo relacionado
            nome_paciente = user.get_full_name()  # Caso o nome esteja no User, por exemplo.
            return Response({"nome": nome_paciente})
        else:
            return Response({"error": "Usuário não autenticado"}, status=401)
        

class PerfilUsuarioView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({
                'nome': user.nome,
                'email': user.email,
                'cpf': user.cpf,
                'cnpj': user.cnpj,
            })
        else:
            return Response({"error": "Usuário não autenticado"}, status=401)


@api_view(['GET'])
@permission_classes([])  # Garante que apenas usuários autenticados podem acessar
def perfil_usuario(request):
    # Aqui você retorna os dados do usuário logado
    user = request.user
    return Response({
        'nome': user.nome,  # Retorna o nome do usuário, assumindo que o modelo Usuario tem um campo 'nome'
    })
    
class PerfilUsuarioView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem acessar

    def get(self, request):
        user = request.user  # O usuário autenticado é obtido diretamente do request
        # Retorna as informações do usuário logado
        return Response({
            'nome': user.nome,  # Você pode retornar mais campos, como email, etc
            'email': user.email,
            'cpf': user.cpf,
            'cnpj': user.cnpj,
        })
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Função para gerar o código de redefinição
def gerar_codigo_redefinicao():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@api_view(['POST'])
def gerar_codigo_redefinicao_senha(request):
    """Recebe o CPF, gera o código de redefinição e envia para o e-mail do usuário"""
    cpf = request.data.get('cpf')

    try:
        usuario = Usuario.objects.get(cpf=cpf)
    except Usuario.DoesNotExist:
        return Response({"error": "Usuário não encontrado!"}, status=404)

    # Gerar código de redefinição
    codigo = gerar_codigo_redefinicao()

    # Criar código de redefinição no banco de dados
    CodigoRedefinicaoSenha.objects.create(
        usuario=usuario,
        codigo=codigo,
        data_geracao=timezone.now(),
        data_expiracao=timezone.now() + timedelta(hours=1)
    )

    # Enviar o código para o e-mail do usuário
    send_mail(
        'Código de Redefinição de Senha',
        f'O seu código de redefinição é: {codigo}',
        'from@example.com',  # E-mail de origem
        [usuario.email],  # E-mail de destino
        fail_silently=False,
    )

    return Response({"message": "Código de redefinição enviado para o e-mail!"}, status=200)

@api_view(['POST'])
def validar_codigo_redefinicao(request):
    """Valida o código de redefinição de senha e permite ao usuário definir uma nova senha"""
    cpf = request.data.get('cpf')
    codigo_informado = request.data.get('codigo')
    nova_senha = request.data.get('nova_senha')

    try:
        usuario = Usuario.objects.get(cpf=cpf)
    except Usuario.DoesNotExist:
        return Response({"error": "Usuário não encontrado!"}, status=404)

    # Buscar o código de redefinição no banco
    try:
        codigo_redefinicao = CodigoRedefinicaoSenha.objects.get(usuario=usuario, codigo=codigo_informado)
    except CodigoRedefinicaoSenha.DoesNotExist:
        return Response({"error": "Código de redefinição inválido!"}, status=400)

    # Verificar se o código expirou
    if codigo_redefinicao.data_expiracao < timezone.now():
        return Response({"error": "O código de redefinição expirou!"}, status=400)

    # Redefinir a senha
    usuario.set_password(nova_senha)
    usuario.save()

    # Deletar o código de redefinição após usá-lo
    codigo_redefinicao.delete()

    return Response({"message": "Senha redefinida com sucesso!"}, status=200)
