const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function send() {
  const senderName = "Gabriel (Convidado de Teste)";
  const guestMessage = "Parabéns ao casal! Que essa nova fase seja repleta de muito amor e alegria. Essa é a mensagem de teste que deixei no site para validar o sistema!";
  const giftName = "🎁 Teste de PIX (R$ 1,00)";
  const giftPrice = 1.0;

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
              O convidado <strong>${senderName}</strong> acabou de pagar via PIX Automático a compra de um presente na sua lista!
            </p>
            
            <div style="background-color: #fcfbf9; border-left: 4px solid #C1A78B; padding: 20px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
              <h3 style="margin-top: 0; color: #333333; font-size: 18px; margin-bottom: 10px;">Detalhes do Presente</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="100">Presente:</td>
                  <td style="padding: 5px 0; color: #333333; font-size: 15px; font-weight: bold;">${giftName}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #777777; font-size: 15px;" width="100">Valor Pago:</td>
                  <td style="padding: 5px 0; color: #C1A78B; font-size: 16px; font-weight: bold;">${formattedPrice}</td>
                </tr>
              </table>
            </div>
            
            ${guestMessage ? `
            <div style="background-color: #f7f3ee; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; border: 1px dashed #C1A78B;">
              <p style="color: #8a7a6b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">Mensagem do Convidado</p>
              <p style="color: #555555; font-size: 17px; line-height: 1.5; font-style: italic; margin: 0;">"${guestMessage}"</p>
            </div>
            ` : ''}
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
              O valor já foi creditado automaticamente na sua conta do Mercado Pago!
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

  try {
    const res = await resend.emails.send({
      from: "Lista de Casamento <onboarding@resend.dev>", 
      to: ["mijmsilva@hotmail.com"],
      subject: `🎉 Novo Presente PIX de ${senderName}: ${giftName}`,
      html: htmlTemplate,
    });
    console.log("SUCCESS:", res);
  } catch(e) {
    console.error("ERROR:", e);
  }
}

send();
