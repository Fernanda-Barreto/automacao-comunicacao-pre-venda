// types/index.ts
export interface Product {
  id: string
  nome: string
  preco: number
  estoque: number
  imagem: string
  categoria: string
  descricao?: string
}

export interface CartItem extends Product {
  quantidade: number
}