import { type NextRequest, NextResponse } from "next/server"

// Esta rota recebe os pedidos e os envia para o n8n
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mensagem, cliente_id } = body

    // Validações básicas
    if (!mensagem || !cliente_id) {
      return NextResponse.json({ error: "Mensagem e cliente_id são obrigatórios" }, { status: 400 })
    }

    // Aqui você enviaria para o webhook do n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/pedido-cliente"

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mensagem,
        cliente_id,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Erro ao enviar para n8n")
    }

    return NextResponse.json({
      success: true,
      message: "Pedido enviado com sucesso",
    })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
