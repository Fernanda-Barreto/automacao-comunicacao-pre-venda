import { NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

export async function GET() {
  try {
    // Carregar credenciais do arquivo JSON
    const credentials = require("../../../../google-credentials.json")

    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth)

    await doc.loadInfo()
    console.log("Planilha carregada:", doc.title)

    const sheet = doc.sheetsByIndex[0] // Primeira aba
    const rows = await sheet.getRows()

    console.log("Número de linhas encontradas:", rows.length)
    console.log("Headers da planilha:", sheet.headerValues)

    const products = rows
      .map((row, index) => {
        try {
          // Mapear as colunas da sua planilha
          const id = row.get("ID") || row.get("id") || ""
          const nome = row.get("Nome") || row.get("nome") || ""
          const categoria = row.get("Categoria") || row.get("categoria") || "Geral"
          const estoque = Number.parseInt(row.get("Estoque") || row.get("estoque") || "0")

          // Campos opcionais - se não existirem na planilha, usar valores padrão
          const preco = Number.parseFloat(row.get("Preco") || row.get("preco") || row.get("Preço") || "50.00")
          const imagem =
            row.get("Imagem") ||
            row.get("imagem") ||
            `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(nome)}`
          const descricao =
            row.get("Descricao") || row.get("descricao") || row.get("Descrição") || `${nome} - ${categoria}`

          console.log(`Produto ${index + 1}:`, { id, nome, categoria, estoque, preco })

          return {
            id,
            nome,
            preco,
            estoque,
            imagem,
            categoria,
            descricao,
          }
        } catch (error) {
          console.error(`Erro ao processar linha ${index + 1}:`, error)
          return null
        }
      })
      .filter((product) => product && product.id && product.nome) // Remove produtos inválidos

    console.log(`${products.length} produtos válidos carregados`)

    return NextResponse.json({
      products,
      success: true,
      message: `${products.length} produtos carregados com sucesso`,
    })
  } catch (error) {
    console.error("Erro detalhado ao buscar produtos:", error)

    return NextResponse.json(
      {
        products: [],
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        message: "Erro ao conectar com Google Sheets. Verifique as credenciais e ID da planilha.",
      },
      { status: 500 },
    )
  }
}
