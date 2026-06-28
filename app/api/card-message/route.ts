import { Resend } from "resend";
import { NextResponse } from "next/server";
import { rateLimit } from "@/utils/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    const { senderName: senderNameRaw, guestMessage: guestMessageRaw, giftName: giftNameRaw, giftPrice, cardPaidPrice } = await request.json();

    if (!senderNameRaw) {
      return NextResponse.json(
        { error: "Faltam dados obrigatórios (Nome)." },
        { status: 400 }
      );
    }

    // Sanitização simples para evitar injeção de HTML no e-mail
    const escapeHtml = (unsafe: string) => {
      if (!unsafe) return "";
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br>");
    };

    const senderName = escapeHtml(senderNameRaw);
    const guestMessage = escapeHtml(guestMessageRaw);
    const giftName = escapeHtml(giftNameRaw);

    const formattedOriginalPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(giftPrice));

    const formattedPaidPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(cardPaidPrice || giftPrice));

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Presente Recebido</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f3ee; margin: 0; padding: 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 0 auto;">
          <tr>
            <td style="background-color: #C1A78B; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 1px;">Você recebeu um presente! 🎁</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Olá, Mirlene e Leandro!
              </p>
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                O convidado <strong>${senderName}</strong> acabou de presentear vocês através do site (Pago via Cartão de Crédito Mercado Pago)!
              </p>
              
              <div style="background-color: #fcfbf9; border-left: 4px solid #C1A78B; padding: 20px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
                <h3 style="margin-top: 0; color: #333333; font-size: 18px; margin-bottom: 10px;">Detalhes do Presente</h3>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="180">Presente:</td>
                    <td style="padding: 5px 0; color: #333333; font-size: 15px; font-weight: bold;">${giftName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="180">Valor Original:</td>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;">${formattedOriginalPrice}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="180">Pago com Taxa MP:</td>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;">${formattedPaidPrice}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0 5px 0; color: #333333; font-size: 16px; font-weight: bold;" width="180">Vocês receberão:</td>
                    <td style="padding: 10px 0 5px 0; color: #22c55e; font-size: 18px; font-weight: bold;">${formattedOriginalPrice}</td>
                  </tr>
                </table>
              </div>
              
              ${guestMessage ? `
              <div style="background-color: #f7f3ee; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; border: 1px dashed #C1A78B;">
                <p style="color: #8a7a6b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">Mensagem do Convidado</p>
                <p style="color: #555555; font-size: 17px; line-height: 1.5; font-style: italic; margin: 0;">"${guestMessage}"</p>
              </div>
              ` : ''}
              
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 13px; margin: 0;">
                Este e-mail foi gerado automaticamente pelo seu site de casamento.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Mirlene e Leandro <no-reply@mirleneeleandro.com.br>", 
      to: ["mijmsilva@hotmail.com"],
      subject: `🎉 Novo Presente (Cartão) de ${senderName}: ${giftName}`,
      html: htmlTemplate,
    });

    if (error) {
      console.error("Erro no Resend:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Erro interno no envio de mensagem do cartão:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno ao processar a mensagem." },
      { status: 500 }
    );
  }
}
