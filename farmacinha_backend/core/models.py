from datetime import timedelta
from django.utils import timezone  # Correção na importação
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import bcrypt

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UsuarioManager(BaseUserManager):
    def create_user(self, nome, email, senha, cpf=None, cnpj=None):
        if not email:
            raise ValueError("O email é obrigatório")
        
        if cpf and cnpj:
            raise ValueError("Não é permitido preencher CPF e CNPJ ao mesmo tempo")
        
        usuario = self.model(
            nome=nome,
            email=email,
            senha=senha,
            cpf=cpf,
            cnpj=cnpj
        )
        usuario.set_password(senha)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, nome, email, senha, cpf=None, cnpj=None):
        usuario = self.create_user(nome, email, senha, cpf, cnpj)
        usuario.is_admin = True
        usuario.save(using=self._db)
        return usuario


class Usuario(AbstractBaseUser):
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    senha = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    cpf = models.CharField(max_length=11, null=True, blank=True, unique=True)  # Usado por clientes
    cnpj = models.CharField(max_length=14, null=True, blank=True, unique=True)  # Usado por atendentes

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'senha']

    objects = UsuarioManager()

    def __str__(self):
        return self.nome


# Modelo de Cliente, herda de Usuario
class Cliente(Usuario):
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"


# Modelo de Atendente, herda de Usuario
class Atendente(Usuario):
    class Meta:
        verbose_name = "Atendente"
        verbose_name_plural = "Atendentes"

# Modelo de Medicamento
class Medicamento(models.Model):
    nome_medicamento = models.CharField(max_length=100, null=False)
    principio_ativo = models.CharField(max_length=100, null=False)
    dosagem = models.CharField(max_length=50, null=False)
    tipo = models.CharField(max_length=50, null=False)  # Exemplo: psicotrópico, antibiótico, isento de prescrição
    fabricante = models.CharField(max_length=20, null=False)
    legislacao = models.ForeignKey('Legislacao', on_delete=models.CASCADE)

    def __str__(self):
        return self.nome_medicamento

    class Meta:
        ordering = ['nome_medicamento']  # Ordenar medicamentos por nome


# Modelo de Legislação
class Legislacao(models.Model):
    titulo = models.CharField(max_length=30, null=False)
    requisitos = models.TextField(null=False)
    tempo_tratamento = models.CharField(max_length=10, null=False)
    validade_receituario = models.CharField(max_length=10, null=False)
    intercambialidade_med = models.CharField(max_length=10, null=False)

    def __str__(self):
        return self.titulo


# Modelo de Bulario (informações sobre medicamentos e suas indicações)
class Bulario(models.Model):
    nome_medicamento = models.CharField(max_length=100, null=False)
    principio_ativo = models.CharField(max_length=100, null=False)
    dosagem = models.CharField(max_length=50, null=False)
    tipo = models.CharField(max_length=50, null=False)
    registro_anvisa = models.CharField(max_length=50, null=False, unique=True)

    def __str__(self):
        return self.nome_medicamento


# Modelo de Log de Ação do Usuário (para auditoria)
class LogAcao(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    acao = models.CharField(max_length=255)  # Descrição da ação realizada
    data = models.DateTimeField(auto_now_add=True)  # Quando a ação foi realizada

    def __str__(self):
        return f"Ação {self.acao} realizada por {self.usuario.nome} em {self.data}"

    class Meta:
        ordering = ['-data']  # Ordenar ações pela data (mais recentes primeiro)


# Modelo de Relacionamento: Cliente e Medicamento (muitos para muitos)
class ClienteMedicamento(models.Model):
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'cnpj': ''})  # Limitado a clientes (sem CNPJ)
    medicamento = models.ForeignKey(Medicamento, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('cliente', 'medicamento')  # Garantir que um cliente não possa ter o mesmo medicamento mais de uma vez


# Modelo de Relacionamento: Atendente e Medicamento (muitos para muitos)
class AtendenteMedicamento(models.Model):
    atendente = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'cnpj__isnull': False})  # Limitado a atendentes (com CNPJ)
    medicamento = models.ForeignKey(Medicamento, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('atendente', 'medicamento')  # Garantir que um atendente não possa ter o mesmo medicamento mais de uma vez


class CodigoRedefinicaoSenha(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Relaciona ao usuário
    codigo = models.CharField(max_length=6)  # Código de redefinição (geralmente 6 dígitos)
    data_geracao = models.DateTimeField(default=timezone.now)  # Quando o código foi gerado
    data_expiracao = models.DateTimeField(default=timezone.now() + timedelta(hours=1))  # Expira em 1 hora

    def is_expirado(self):
        """Verifica se o código expirou"""
        return timezone.now() > self.data_expiracao

    def __str__(self):
        return f"Código de redefinição para {self.usuario.email}"