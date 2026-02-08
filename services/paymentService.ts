import { User } from '../types';

const ACCESS_TOKEN = 'APP_USR-2028294536116664-020323-6cd677880a20d8c24ac12a297178c743-753231933';

export interface PaymentResponse {
  id: number;
  status: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string; // Copia e Cola
      qr_code_base64: string; // Imagem
      ticket_url: string;
    }
  }
}

export const createPixPayment = async (amount: number, user: User, description: string): Promise<PaymentResponse | null> => {
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID() // Evita duplicidade
      },
      body: JSON.stringify({
        transaction_amount: Number(amount.toFixed(2)),
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: user.email,
          first_name: user.name.split(' ')[0],
          last_name: user.name.split(' ').slice(1).join(' ') || 'User',
          identification: {
            type: 'CPF',
            number: '19119119100' // Em prod, pedir CPF real. MP exige CPF válido para Pix.
          }
        },
        notification_url: 'https://webhook.site/retorno-fake' // Apenas placeholder
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mercado Pago Error:', errorData);
      return null;
    }

    const data = await response.json();
    return data as PaymentResponse;
  } catch (error) {
    console.error('Erro na requisição de pagamento:', error);
    return null;
  }
};
