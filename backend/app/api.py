from ninja import PatchDict, Router
from .models import Expositor, Peca
from django.shortcuts import get_object_or_404
from .schemas import (
    ExpositorSchema,
    CreateExpositorSchema,
    PecaSchema,
    CreatePecaSchema
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
def listar_pecas(request):
    return Peca.objects.select_related("created_by").all()


@router.get("/pecas/{peca_id}", response=PecaSchema)
def obter_peca(request, peca_id: int):
    return get_object_or_404(Peca, id=peca_id)


@router.post("/pecas", response=PecaSchema)
def criar_peca(request, peca: CreatePecaSchema):
    return Peca.objects.create(**peca.dict(), created_by=request.auth)


@router.put("/pecas/{peca_id}", response=PecaSchema)
def atualizar_peca(request, peca_id: int, payload: PatchDict[PecaSchema]):
    peca = get_object_or_404(Peca, id=peca_id)

    for attr, value in payload.items():
        setattr(peca, attr, value)
    peca.save()
    return peca



@router.delete("/pecas/{peca_id}", response={204: None})
def deletar_peca(request, peca_id: int):
    peca = get_object_or_404(Peca, id=peca_id)
    peca.delete()
    return 204, None
