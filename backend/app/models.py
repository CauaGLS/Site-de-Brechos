from django.contrib.auth.models import AbstractBaseUser
from django.db import models
import uuid
from django.core.validators import MinLengthValidator


class User(AbstractBaseUser):
    username = None
    password = None

    id = models.CharField(primary_key=True, max_length=36)
    name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    image = models.URLField(null=True, blank=True)
    admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self) -> str:
        return self.name


class Session(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    ip_address = models.CharField(max_length=255, null=True)
    user_agent = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sessions"


class Account(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_id = models.CharField(max_length=255)
    provider_id = models.CharField(max_length=255)
    access_token = models.CharField(max_length=255, null=True)
    refresh_token = models.CharField(max_length=255, null=True)
    access_token_expires_at = models.DateTimeField(null=True)
    refresh_token_expires_at = models.DateTimeField(null=True)
    scope = models.CharField(max_length=255, null=True)
    id_token = models.TextField(null=True)
    password = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "accounts"


class Verification(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    identifier = models.TextField()
    value = models.TextField()
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "verifications"


class Expositor(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True)
    rede_social = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class Peca(models.Model):
    nome = models.CharField(max_length=255)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField(blank=True)
    expositor = models.ForeignKey(Expositor, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reservada = models.BooleanField(default=False)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    expositor = models.ForeignKey(
        Expositor, on_delete=models.CASCADE, related_name="pecas", db_column="expositor_id"
    )

    def __str__(self):
        return self.nome
    
    class Meta:
        db_table = "pecas"
        verbose_name = "peca"
        verbose_name_plural = "pecas"
        ordering = ["created_at"]


class Ingresso(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    email = models.EmailField()
    cpf = models.CharField(max_length=14, validators=[MinLengthValidator(11)])
    data_compra = models.DateTimeField(auto_now_add=True)
    utilizado = models.BooleanField(default=False)
    data_utilizacao = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Ingresso de {self.nome} ({self.email})"

    class Meta:
        db_table = "ingressos"
        verbose_name = "ingresso"
        verbose_name_plural = "ingressos"
        ordering = ["-data_compra"]
