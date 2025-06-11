from ninja import PatchDict, Router
from django.http import JsonResponse
from .models import Expositor, Peca
from django.shortcuts import get_object_or_404
from .schemas import (
    ExpositorSchema,
    CreateExpositorSchema,
    PecaSchema,
    CreatePecaSchema,
    UpdatePecaSchema,
)


router = Router(tags=["Brecho"])

# --- Expositores ---

@router.get("/expositores", response=list[ExpositorSchema])
def listar_expositores(request):
    return Expositor.objects.select_related("created_by").all()


@router.get("/expositores/{expositor_id}", response=ExpositorSchema)
def obter_expositor(request, expositor_id: int):
    return get_object_or_404(Expositor, id=expositor_id)


@router.post("/expositores", response=ExpositorSchema)
def criar_expositor(request, expositor: CreateExpositorSchema):
    return Expositor.objects.create(**expositor.dict(), created_by=request.auth)


@router.put("/expositores/{expositor_id}", response=ExpositorSchema)
def atualizar_expositor(request, expositor_id: int, payload: PatchDict[ExpositorSchema]):
    expositor = get_object_or_404(Expositor, id=expositor_id)

    for attr, value in payload.items():
        setattr(expositor, attr, value)
    expositor.save()
    return expositor



@router.delete("/expositores/{expositor_id}", response={204: None})
def deletar_expositor(request, expositor_id: int):
    expositor = get_object_or_404(Expositor, id=expositor_id)
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
    peca = get_object_or_404(Peca, id=peca_id)
    
    update_data = payload.dict(exclude_unset=True)
    
    # Atualiza apenas campos que foram enviados
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
    peca = get_object_or_404(Peca, id=peca_id)
    peca.delete()
    return 204, None
