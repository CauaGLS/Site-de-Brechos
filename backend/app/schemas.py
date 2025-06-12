from core.schemas import UserSchema
from ninja import Schema, ModelSchema
from datetime import datetime
from typing import Optional

from .models import Expositor, Peca, Ingresso


class ExpositorSchema(ModelSchema):
    id: int
    nome: str
    descricao: str = ""
    rede_social: str = ""
    created_by: UserSchema

    class Meta:
        model = Expositor
        fields = "__all__"


class CreateExpositorSchema(Schema):
    nome: str
    descricao: str
    rede_social: str



class PecaSchema(ModelSchema):
    id: int
    nome: str
    preco: float
    descricao: str = ""
    reservada: bool = False
    created_by: UserSchema
    expositor_id: int
    created_by: UserSchema

    class Meta:
        model = Peca
        fields = "__all__"



class CreatePecaSchema(Schema):
    nome: str
    preco: float
    descricao: str = ""
    reservada: bool = False
    expositor_id: int


class UpdatePecaSchema(Schema):
    nome: str = None  # Opcional na atualização
    preco: float = None
    descricao: str = None
    reservada: bool = None
    expositor_id: int = None


class IngressoSchema(ModelSchema):
    id: str  # Forçando conversão para string
    nome: str
    email: str
    cpf: str
    data_compra: datetime
    utilizado: bool
    data_utilizacao: Optional[datetime] = None

    class Meta:
        model = Ingresso
        fields = "__all__"

    @staticmethod
    def resolve_id(obj):
        return str(obj.id)  # Converte UUID para string

class CreateIngressoSchema(Schema):
    nome: str
    email: str
    cpf: str

class ValidateIngressoSchema(Schema):
    ingresso_id: str
    cpf: str  # Para validação adicional
