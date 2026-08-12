import { Order, SystemConfig } from '../types';

export const whatsappService = {
  formatOrderMessage(order: Order, config: SystemConfig): string {
    const isEntrega = order.serviceType === 'entrega';
    const itemsList = order.items
      .map((item) => `  ▫️ *${item.quantity}x* ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`)
      .join('\n');

    let addressSection = '';
    if (isEntrega && order.address) {
      addressSection = `
📍 *ENDEREÇO DE ENTREGA:*
  • *Rua:* ${order.address.street}, ${order.address.number}
  • *Bairro:* ${order.address.neighborhood}
  ${order.address.complement ? `• *Comp.:* ${order.address.complement}\n` : ''}  ${order.address.reference ? `• *Ref.:* ${order.address.reference}\n` : ''}  • *Cidade:* ${order.address.city}`;
    } else {
      addressSection = `
🏬 *MODALIDADE:* Retirada Direta na Portaria
📍 *Local:* ${config.companyAddress}`;
    }

    let paymentSection = '';
    if (order.paymentMethod === 'pix') {
      paymentSection = `💳 *PAGAMENTO:* PIX (Chave: ${config.pixKey})`;
    } else if (order.paymentMethod === 'dinheiro') {
      paymentSection = `💵 *PAGAMENTO:* Dinheiro${order.needChangeFor ? ` (Troco para R$ ${order.needChangeFor.toFixed(2).replace('.', ',')})` : ' (Sem troco)'}`;
    } else if (order.paymentMethod === 'cartao_debito') {
      paymentSection = `💳 *PAGAMENTO:* Cartão de Débito (Levar maquininha)`;
    } else {
      paymentSection = `💳 *PAGAMENTO:* Cartão de Crédito (Levar maquininha)`;
    }

    const text = `🔥 *PEDIDO DE GÁS - ${config.companyName.toUpperCase()}* 🔥

📌 *Código do Pedido:* #${order.code}
👤 *Cliente:* ${order.customerName}
📞 *Telefone:* ${order.customerPhone}

🛒 *ITENS DO PEDIDO:*
${itemsList}

📦 *SUBTOTAL:* R$ ${order.subtotal.toFixed(2).replace('.', ',')}
${order.deliveryFee > 0 ? `🚚 *TAXA ENTREGA:* R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}\n` : ''}💰 *TOTAL GERAL:* R$ ${order.total.toFixed(2).replace('.', ',')}

⏰ *AGENDAMENTO / HORÁRIO:*
  • *Data:* ${order.scheduledDate === 'hoje' ? 'Hoje' : order.scheduledDate === 'amanha' ? 'Amanhã' : order.scheduledDate}
  • *Janela:* ${order.scheduledTimeSlot}

${addressSection}

${paymentSection}
${order.notes ? `\n📝 *OBSERVAÇÃO:* ${order.notes}` : ''}

Por favor, confirmem o recebimento do pedido! Obrigado!`;

    return text;
  },

  getWhatsAppLink(phone: string, text: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  },

  formatStatusNotifyMessage(order: Order, config: SystemConfig, driverName?: string): string {
    let statusText = '';
    if (order.status === 'separacao') {
      statusText = `Seu pedido *#${order.code}* foi recebido e está em separação na portaria! 🔥`;
    } else if (order.status === 'a_caminho') {
      statusText = `Seu gás saiu para entrega! 🛵💨 ${driverName ? `O entregador *${driverName}*` : 'Nosso entregador'} já está a caminho do seu endereço.`;
    } else if (order.status === 'entregue') {
      statusText = `Seu pedido *#${order.code}* foi concluído com sucesso! Obrigado pela preferência com o *${config.companyName}*! ⭐`;
    } else if (order.status === 'cancelado') {
      statusText = `Seu pedido *#${order.code}* foi cancelado. Se tiver dúvidas, entre em contato conosco.`;
    }

    const text = `Olá, *${order.customerName}*! 👋

${statusText}

📌 *Resumo do Pedido:* #${order.code}
💰 *Total:* R$ ${order.total.toFixed(2).replace('.', ',')}

Atenciosamente,
*${config.companyName}*`;

    return text;
  }
};
