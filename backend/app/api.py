from ninja import PatchDict, Router
from django.http import JsonResponse
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from qrcode import make as make_qr
from io import BytesIO
import base64
from datetime import datetime
from .models import Expositor, Peca, Ingresso
from django.shortcuts import get_object_or_404
from .schemas import (
    ExpositorSchema,
    CreateExpositorSchema,
    PecaSchema,
    CreatePecaSchema,
    UpdatePecaSchema,
    IngressoSchema,
    CreateIngressoSchema,
    ValidateIngressoSchema
)
from django.core.exceptions import PermissionDenied

router = Router(tags=["Brecho"])

def check_admin(request):
    if not request.auth or not request.auth.admin:
        raise PermissionDenied("Apenas administradores podem realizar esta ação")

# --- Expositores ---

@router.get("/expositores", response=list[ExpositorSchema])
def listar_expositores(request):
    return Expositor.objects.select_related("created_by").all()


@router.get("/expositores/{expositor_id}", response=ExpositorSchema)
def obter_expositor(request, expositor_id: int):
    return get_object_or_404(Expositor, id=expositor_id)


@router.post("/expositores", response=ExpositorSchema)
def criar_expositor(request, expositor: CreateExpositorSchema):
    check_admin(request)
    return Expositor.objects.create(**expositor.dict(), created_by=request.auth)


@router.put("/expositores/{expositor_id}", response=ExpositorSchema)
def atualizar_expositor(request, expositor_id: int, payload: PatchDict[ExpositorSchema]):
    check_admin(request)
    expositor = get_object_or_404(Expositor, id=expositor_id)

    # Verifica se o usuário é o criador ou admin
    if expositor.created_by != request.auth and not request.auth.admin:
        raise PermissionDenied("Você não tem permissão para editar este expositor")

    for attr, value in payload.items():
        setattr(expositor, attr, value)
    expositor.save()
    return expositor


@router.delete("/expositores/{expositor_id}", response={204: None})
def deletar_expositor(request, expositor_id: int):
    check_admin(request)
    expositor = get_object_or_404(Expositor, id=expositor_id)
    
    # Verifica se o usuário é o criador ou admin
    if expositor.created_by != request.auth and not request.auth.admin:
        raise PermissionDenied("Você não tem permissão para excluir este expositor")
    
    expositor.delete()
    return 204, None


# --- Peças ---

@router.get("/pecas", response=list[PecaSchema])
def listar_pecas(request, expositor_id: int = None):
    query = Peca.objects.select_related("created_by", "expositor")
    if expositor_id:
        query = query.filter(expositor_id=expositor_id)
    return query.all()


@router.get("/pecas/{peca_id}", response=PecaSchema)
def obter_peca(request, peca_id: int):
    return get_object_or_404(Peca, id=peca_id)


@router.post("/pecas", response=PecaSchema)
def criar_peca(request, peca: CreatePecaSchema):
    check_admin(request)
    try:
        expositor = Expositor.objects.get(id=peca.expositor_id)
        
        nova_peca = Peca.objects.create(
            nome=peca.nome,
            preco=peca.preco,
            descricao=peca.descricao,
            reservada=peca.reservada,
            expositor=expositor,
            created_by=request.auth
        )
        return nova_peca
    except Expositor.DoesNotExist:
        return JsonResponse({"error": "Expositor não encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"Erro ao criar peça: {str(e)}"}, status=500)


@router.put("/pecas/{peca_id}", response=PecaSchema)
def atualizar_peca(request, peca_id: int, payload: UpdatePecaSchema):
    check_admin(request)
    peca = get_object_or_404(Peca, id=peca_id)
    
    # Verifica se o usuário é o criador ou admin
    if peca.created_by != request.auth and not request.auth.admin:
        raise PermissionDenied("Você não tem permissão para editar esta peça")
    
    update_data = payload.dict(exclude_unset=True)
    
    for attr, value in update_data.items():
        if attr == 'reservada':
            peca.reservada = value
        elif attr == 'nome':
            peca.nome = value
        elif attr == 'preco':
            peca.preco = value
        elif attr == 'descricao':
            peca.descricao = value
    
    peca.save()
    return peca


@router.delete("/pecas/{peca_id}", response={204: None})
def deletar_peca(request, peca_id: int):
    check_admin(request)
    peca = get_object_or_404(Peca, id=peca_id)
    
    # Verifica se o usuário é o criador ou admin
    if peca.created_by != request.auth and not request.auth.admin:
        raise PermissionDenied("Você não tem permissão para excluir esta peça")
    
    peca.delete()
    return 204, None


# --- Ingressos ---

@router.post("/ingressos", response=IngressoSchema)
def criar_ingresso(request: HttpRequest, payload: CreateIngressoSchema):

    ingresso = Ingresso.objects.create(
        nome=payload.nome,
        email=payload.email,
        cpf=payload.cpf,
        created_by=request.auth if hasattr(request, 'auth') else None
    )
    
    return ingresso

@router.get("/ingressos/{ingresso_id}/qrcode", response={200: str, 404: None})
def gerar_qrcode(request, ingresso_id: str):
    ingresso = get_object_or_404(Ingresso, id=ingresso_id)
    
    # Criar dados para o QR Code (inclui ID e CPF para validação)
    qr_data = f"INGRESSO_ID:{ingresso.id}|CPF:{ingresso.cpf}"
    
    # Gerar QR Code
    img = make_qr(qr_data)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return 200, f"data:image/png;base64,{img_str}"


@router.post("/ingressos/validar", response={200: IngressoSchema, 400: dict, 404: None})
@csrf_exempt
def validar_ingresso(request, payload: ValidateIngressoSchema):
    try:
        ingresso = Ingresso.objects.get(id=payload.ingresso_id, cpf=payload.cpf)
    except Ingresso.DoesNotExist:
        return 404, None
    
    if ingresso.utilizado:
        return 400, {"error": "Este ingresso já foi utilizado"}
    
    # Marcar como utilizado
    ingresso.utilizado = True
    ingresso.data_utilizacao = datetime.now()
    ingresso.save()
    
    return 200, ingresso

@router.get("/ingressos/{ingresso_id}", response=IngressoSchema)
def obter_ingresso(request, ingresso_id: str):
    return get_object_or_404(Ingresso, id=ingresso_id)