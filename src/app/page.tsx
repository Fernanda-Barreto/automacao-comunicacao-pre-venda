// app/page.tsx
"use client"

import { Toaster } from "sonner"
import Header from "../../components/Header"
import MainContent from "../../components/MainContent"
import useCatalog from "../../hocks/use-catalog"

export default function CatalogPage() {
  const {
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
  } = useCatalog()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos da planilha...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header
        getTotalItems={getTotalItems}
        cart={cart}
        updateQuantity={updateQuantity}
        products={products}
        getTotalPrice={getTotalPrice}
        clienteWhatsApp={clienteWhatsApp}
        setClienteWhatsApp={setClienteWhatsApp}
        handleSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmitting}
        fetchProducts={fetchProducts}
        loading={loading}
      />
      <MainContent
        products={products}
        addToCart={addToCart}
        error={error}
        fetchProducts={fetchProducts}
        categories={categories}
        loading={loading}
      />
      <Toaster />
    </div>
  )
}