// components/Header.tsx
"use client"

import { ShoppingCart, RefreshCw, Plus, Minus, Send } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Separator } from "./ui/separator"
import type { Product, CartItem } from "../types" // Assumindo que você tem um arquivo de tipos

interface HeaderProps {
  getTotalItems: () => number
  cart: CartItem[]
  updateQuantity: (productId: string, newQuantity: number) => void
  products: Product[]
  getTotalPrice: () => number
  clienteWhatsApp: string
  setClienteWhatsApp: (value: string) => void
  handleSubmitOrder: () => void
  isSubmitting: boolean
  fetchProducts: () => void
  loading: boolean
}

export default function Header({
  getTotalItems,
  cart,
  updateQuantity,
  products,
  getTotalPrice,
  clienteWhatsApp,
  setClienteWhatsApp,
  handleSubmitOrder,
  isSubmitting,
  fetchProducts,
  loading,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ✨ Bijuterias Elegantes
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading} className="bg-transparent">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative bg-transparent">
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Carrinho
                  </div>
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-pink-600">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Seu Carrinho</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? "Seu carrinho está vazio" : `${getTotalItems()} item(s) selecionado(s)`}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={item.imagem || "/placeholder.svg"}
                        alt={item.nome}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.nome}</h4>
                        <p className="text-pink-600 font-semibold">R$ {item.preco.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{item.categoria}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantidade}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {cart.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-pink-600">R$ {getTotalPrice().toFixed(2)}</span>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="whatsapp">WhatsApp para contato</Label>
                          <Input
                            id="whatsapp"
                            placeholder="(11) 99999-9999"
                            value={clienteWhatsApp}
                            onChange={(e) => setClienteWhatsApp(e.target.value)}
                          />
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                          onClick={handleSubmitOrder}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Enviando...
                            </div>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Finalizar Pedido
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-gray-500 text-center">
                          Você receberá uma confirmação no WhatsApp e terá até 24h para confirmar o pagamento
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}