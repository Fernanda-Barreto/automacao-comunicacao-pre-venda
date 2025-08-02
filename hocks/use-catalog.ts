// hooks/use-catalog.ts
import { useState, useEffect } from "react"
import { toast } from "sonner" 

// Definições de tipos (sugiro mover para types/index.ts)
interface Product {
  id: string
  nome: string
  preco: number
  estoque: number
  imagem: string
  categoria: string
  descricao?: string
}

interface CartItem extends Product {
  quantidade: number
}

const useCatalog = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clienteWhatsApp, setClienteWhatsApp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Função para buscar os produtos
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Buscando produtos da planilha...")
      const response = await fetch("/api/sheets")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
        toast.success("Produtos carregados!", {
          description: data.message,
        })
      } else {
        throw new Error(data.message || "Erro ao carregar produtos")
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")

      toast.error("Erro ao carregar produtos", {
        description: "Verifique a conexão com Google Sheets",
      })
    } finally {
      setLoading(false)
    }
  }

  // 2. useEffect para carregar os produtos na montagem
  useEffect(() => {
    fetchProducts()
  }, [])

  // 3. Função para adicionar ao carrinho
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        if (existingItem.quantidade < product.estoque) {
          return prevCart.map((item) => (item.id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item))
        } else {
          toast.error("Estoque insuficiente", {
            description: `Apenas ${product.estoque} unidades disponíveis`,
          })
          return prevCart
        }
      } else {
        return [...prevCart, { ...product, quantidade: 1 }]
      }
    })

    toast.success("Produto adicionado!", {
      description: `${product.nome} foi adicionado ao carrinho`,
    })
  }

  // 4. Função para atualizar a quantidade de um item no carrinho
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.estoque) {
      toast.error("Estoque insuficiente", {
        description: `Apenas ${product.estoque} unidades disponíveis`,
      })
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantidade: newQuantity } : item)))
  }

  // 5. Função para calcular o preço total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  // 6. Função para calcular o número total de itens
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantidade, 0)
  }

  // 7. Função para enviar o pedido
  const handleSubmitOrder = async () => {
    if (!clienteWhatsApp.trim()) {
      toast.error("WhatsApp obrigatório", {
        description: "Por favor, informe seu número do WhatsApp",
      })
      return
    }

    if (cart.length === 0) {
      toast.error("Carrinho vazio", {
        description: "Adicione produtos ao carrinho antes de finalizar",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Formatar mensagem no padrão esperado pelo n8n: "ID1:Qtd1,ID2:Qtd2"
      const mensagem = cart.map((item) => `${item.id}:${item.quantidade}`).join(",")

      const payload = {
        mensagem,
        cliente_id: clienteWhatsApp.replace(/\D/g, ""), // Remove caracteres não numéricos
      }

      console.log("Enviando pedido:", payload)

      // Chamada para o webhook do n8n
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Pedido enviado com sucesso!", {
          description: "Você receberá uma confirmação no WhatsApp em breve",
        })
        // Limpar carrinho e WhatsApp
        setCart([])
        setClienteWhatsApp("")
      } else {
        throw new Error("Erro ao enviar pedido")
      }
    } catch (err) {
      toast.error("Erro ao enviar pedido", {
        description: "Tente novamente em alguns instantes",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 8. Lógica para extrair categorias
  const categories = [...new Set(products.map((p) => p.categoria))]

  // 9. Retornar todas as variáveis e funções para serem usadas no componente
  return {
    products,
    cart,
    loading,
    error,
    fetchProducts,
    addToCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    handleSubmitOrder,
    isSubmitting,
    clienteWhatsApp,
    setClienteWhatsApp,
    categories,
  }
}

export default useCatalog