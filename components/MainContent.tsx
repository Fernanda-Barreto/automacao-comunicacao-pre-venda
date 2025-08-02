// components/MainContent.tsx
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "./ProductCard"
import { Badge } from "./ui/badge"
import type { Product } from "../types"

interface MainContentProps {
  products: Product[]
  addToCart: (product: Product) => void
  error: string | null
  fetchProducts: () => void
  categories: string[]
  loading: boolean
}

export default function MainContent({ products, addToCart, error, fetchProducts, categories, loading }: MainContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título e subtítulo */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Bijuterias</h2>
        
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <Alert className="mb-6 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erro ao carregar produtos:</strong> {error}
            <br />
            <Button variant="link" className="p-0 h-auto mt-2" onClick={fetchProducts}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Mensagem de Catálogo Vazio */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum produto encontrado na planilha</p>
          <Button onClick={fetchProducts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
        </div>
      )}

      {/* Filtros de Categoria */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Badge variant="secondary" className="cursor-pointer hover:bg-pink-100">
            Todos ({products.length})
          </Badge>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="cursor-pointer hover:bg-pink-50">
              {category} ({products.filter((p) => p.categoria === category).length})
            </Badge>
          ))}
        </div>
      )}

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </main>
  )
}