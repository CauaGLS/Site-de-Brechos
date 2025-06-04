// src/pages/locais/page.tsx
import { Card, CardContent } from "@/components/ui/card"

export default function LocaisPage() {

  return (
    <div className="p-6 flex flex-col space-y-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Locais</h1>
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">Restaurante Beirute</h1>
            <p className="text-muted-foreground text-center">SHCS CLS 109 Bloco A1 Loja 2/4 - Asa Sul, Brasília - DF, 70200-050</p>

            <Card className="mt-4 shadow-lg">
                <CardContent className="p-0">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245676.8126751382!2d-48.212513923645!3d-15.819754502744479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2551dde92b4b%3A0xe1ca3e48634e5432!2sBar%20Beirute%3A%20Bar%2C%20Comida%20Arabe%2C%20Chopp%2C%20Happy%20Hour%2C%20petiscos%2C%20Asa%20Sul%20DF!5e0!3m2!1spt-BR!2sbr!4v1748905468380!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="350"
                    className="rounded-b-xl w-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                </CardContent>
            </Card>
        </div>
      
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">Centro Comercial Boulevard (Conic)</h1>
            <p className="text-muted-foreground text-center">Sds bloco E loja 3, SHCS, Brasília - DF, 70300-970</p>

            <Card className="mt-4 shadow-lg">
                <CardContent className="p-0">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.15243154584!2d-47.884499899999994!3d-15.795914499999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3b4c6fe0c163%3A0x96a54c4f9289142a!2sBirosca%20do%20Conic!5e0!3m2!1spt-BR!2sbr!4v1748904968629!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="350"
                    className="rounded-b-xl w-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">Galeria dos Estados</h1>
            <p className="text-muted-foreground text-center">SBS Q.02 LOJA 46 GALERIA DOS ESTADOS, SBS - Asa Sul, Brasília - DF, 70310-500</p>

            <Card className="mt-4 shadow-lg">
                <CardContent className="p-0">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.100450937826!2d-47.8854926!3d-15.798656499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3b044d7a4afb%3A0xbd3260e12b9e276!2sGaleria%20dos%20Estados!5e0!3m2!1spt-BR!2sbr!4v1748905645691!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="350"
                    className="rounded-b-xl w-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                </CardContent>
            </Card>            
        </div>
    </div>
  )
}


