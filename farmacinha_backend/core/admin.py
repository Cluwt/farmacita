from django.contrib import admin
from .models import Usuario, Cliente, Atendente, Medicamento, Legislacao, Bulario, LogAcao, ClienteMedicamento, AtendenteMedicamento

# Registro dos modelos no admin
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'cpf', 'cnpj', 'is_admin', 'is_active', 'is_staff')  # Campos exibidos na lista
    list_filter = ('is_admin', 'is_active', 'is_staff')  # Filtros na sidebar
    search_fields = ('nome', 'email', 'cpf', 'cnpj')  # Campos pesquisáveis
    ordering = ('nome',)  # Ordenação padrão

class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'cpf', 'is_active')  # Campos exibidos na lista
    search_fields = ('nome', 'email', 'cpf')
    ordering = ('nome',)

class AtendenteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'cnpj', 'is_active')  # Campos exibidos na lista
    search_fields = ('nome', 'email', 'cnpj')
    ordering = ('nome',)

class MedicamentoAdmin(admin.ModelAdmin):
    list_display = ('nome_medicamento', 'principio_ativo', 'tipo', 'fabricante')  # Campos exibidos na lista
    search_fields = ('nome_medicamento', 'principio_ativo', 'fabricante')
    ordering = ('nome_medicamento',)

class LegislacaoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'requisitos', 'tempo_tratamento', 'validade_receituario')  # Campos exibidos na lista
    search_fields = ('titulo',)
    ordering = ('titulo',)

class BularioAdmin(admin.ModelAdmin):
    list_display = ('nome_medicamento', 'principio_ativo', 'dosagem', 'tipo', 'registro_anvisa')  # Campos exibidos na lista
    search_fields = ('nome_medicamento', 'registro_anvisa')
    ordering = ('nome_medicamento',)

class LogAcaoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'acao', 'data')  # Campos exibidos na lista
    search_fields = ('usuario__nome', 'acao')
    list_filter = ('data',)
    ordering = ('-data',)  # Ordenação pela data mais recente

class ClienteMedicamentoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'medicamento')  # Campos exibidos na lista
    search_fields = ('cliente__nome', 'medicamento__nome_medicamento')
    ordering = ('cliente',)

class AtendenteMedicamentoAdmin(admin.ModelAdmin):
    list_display = ('atendente', 'medicamento')  # Campos exibidos na lista
    search_fields = ('atendente__nome', 'medicamento__nome_medicamento')
    ordering = ('atendente',)

# Registro dos modelos no admin
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Medicamento, MedicamentoAdmin)
admin.site.register(Legislacao, LegislacaoAdmin)
admin.site.register(Bulario, BularioAdmin)
admin.site.register(LogAcao, LogAcaoAdmin)
