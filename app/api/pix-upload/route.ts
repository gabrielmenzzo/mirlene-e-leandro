import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const senderNameRaw = formData.get("senderName") as string;
    const giftNameRaw = formData.get("giftName") as string;
    const giftPrice = formData.get("giftPrice") as string;
    const receiptFile = formData.get("receipt") as File;

    if (!senderNameRaw || !receiptFile) {
      return NextResponse.json(
        { error: "Faltam dados obrigatórios (Nome ou Comprovante)." },
        { status: 400 }
      );
    }

    // Sanitização simples para evitar injeção de HTML no e-mail
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const senderName = escapeHtml(senderNameRaw);
    const giftName = escapeHtml(giftNameRaw);

    const buffer = Buffer.from(await receiptFile.arrayBuffer());
    
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(giftPrice));

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Presente PIX</title>
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
                O convidado <strong>${senderName}</strong> acabou de enviar um comprovante PIX confirmando a compra de um presente na sua lista!
              </p>
              
              <div style="background-color: #fcfbf9; border-left: 4px solid #C1A78B; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                <h3 style="margin-top: 0; color: #333333; font-size: 18px; margin-bottom: 10px;">Detalhes do Presente</h3>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="100">Presente:</td>
                    <td style="padding: 5px 0; color: #333333; font-size: 15px; font-weight: bold;">${giftName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="100">Valor:</td>
                    <td style="padding: 5px 0; color: #C1A78B; font-size: 16px; font-weight: bold;">${formattedPrice}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                O comprovante da transferência está <strong>anexado</strong> a este e-mail. Por favor, verifique-o em anexo!
              </p>
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
      from: "Lista de Casamento <onboarding@resend.dev>", 
      to: ["gabrielribeiro8919@gmail.com"],
      subject: `🎉 Novo Presente de ${senderName}: ${giftName}`,
      html: htmlTemplate,
      attachments: [
        {
          filename: receiptFile.name,
          content: buffer,
        },
      ],
    });

    if (error) {
      console.error("Erro no Resend:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Erro interno no envio de pix:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno ao processar o comprovante." },
      { status: 500 }
    );
  }
}
