from core.schemas import UserSchema
from ninja import Schema, ModelSchema

from .models import Expositor, Peca


class ExpositorSchema(ModelSchema):
    id: int
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
