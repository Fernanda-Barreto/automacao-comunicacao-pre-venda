// components/ProductCard.tsx
import { Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type { Product } from "../types"

interface ProductCardProps {
  product: Product
  addToCart: (product: Product) => void
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <Image
            src={product.imagem || "/placeholder.svg"}
            alt={product.nome}
            width={300}
            height={300}
            priority
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.estoque <= 5 && product.estoque > 0 && (
            <Badge className="absolute top-2 right-2 bg-orange-500">Últimas {product.estoque}</Badge>
          )}
          {product.estoque === 0 && <Badge className="absolute top-2 right-2 bg-red-500">Esgotado</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{product.nome}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {product.categoria}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mb-2">ID: {product.id}</p>
        {product.descricao && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.descricao}</p>}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-pink-600">R$ {product.preco.toFixed(2)}</span>
            <p className="text-xs text-gray-500">{product.estoque} em estoque</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          onClick={() => addToCart(product)}
          disabled={product.estoque === 0}
        >
          {product.estoque === 0 ? (
            "Esgotado"
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}