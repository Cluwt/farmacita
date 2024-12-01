from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import bcrypt

# Gerenciador de Usuário Personalizado
class UsuarioManager(BaseUserManager):
    def create_user(self, cpf=None, cnpj=None, senha=None, nome=None, email=None, telefone=None):
        """Cria e retorna um usuário (cliente ou atendente)."""
        
        if not cpf and not cnpj:
            raise ValueError('É necessário preencher o CPF ou o CNPJ')
        
        if cpf and cnpj:
            raise ValueError('Não é permitido preencher CPF e CNPJ ao mesmo tempo')
        
        usuario = self.model(
            cpf=cpf, nome=nome, email=email, telefone=telefone, cnpj=cnpj
        )
        usuario.set_password(senha)  # Encriptando a senha com bcrypt
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, cpf=None, cnpj=None, senha=None, nome=None, email=None, telefone=None):
        """Cria e retorna um superusuário (administrador)."""
        usuario = self.create_user(cpf=cpf, cnpj=cnpj, senha=senha, nome=nome, email=email, telefone=telefone)
        usuario.is_admin = True
        usuario.is_staff = True  # Tornar o superusuário também um staff
        usuario.save(using=self._db)
        return usuario


# Modelo de Usuário (Cliente ou Atendente)
class Usuario(AbstractBaseUser):
    cpf = models.CharField(max_length=11, unique=True, null=True, blank=True)  # CPF obrigatório para clientes
    nome = models.CharField(max_length=255, null=False)
    email = models.EmailField(max_length=255, null=True, blank=True)
    telefone = models.CharField(max_length=15, null=True, blank=True)
    cnpj = models.CharField(max_length=14, unique=True, null=True, blank=True)  # CNPJ obrigatório para atendentes
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'cpf'  # CPF é usado como identificador único
    REQUIRED_FIELDS = ['nome', 'senha']  # Campos obrigatórios para o cadastro

    objects = UsuarioManager()  # Usando o gerenciador customizado

    def __str__(self):
        return self.nome

    def clean(self):
        """
        Validação para garantir que um usuário tenha ou CPF ou CNPJ, mas não ambos.
        """
        if self.cpf and self.cnpj:
            raise ValueError("Não é permitido preencher CPF e CNPJ ao mesmo tempo.")
        if not self.cpf and not self.cnpj:
            raise ValueError("É necessário preencher pelo menos o CPF ou CNPJ.")

    def set_password(self, senha):
        """Sobrescreve o método para encriptar a senha usando bcrypt."""
        self.senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, senha):
        """Verifica se a senha fornecida corresponde à senha armazenada, usando bcrypt."""
        return bcrypt.checkpw(senha.encode('utf-8'), self.senha.encode('utf-8'))

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin


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
