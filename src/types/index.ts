export type ServiceType = 'portaria' | 'entrega';

export type PaymentMethod = 'pix' | 'cartao_debito' | 'cartao_credito' | 'dinheiro';

export type OrderStatus = 'pendente' | 'separacao' | 'a_caminho' | 'entregue' | 'cancelado';

export interface ExtraProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'gas' | 'agua' | 'acessorio';
  imageIcon: string;
  available: boolean;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: string; // ex: "Moto Honda Fan 160", "Furgão Fiorino"
  phone: string;
  active: boolean;
  currentDeliveriesCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  reference?: string;
  city: string;
  state?: string;
}

export interface Order {
  id: string; // e.g. PANT-8492
  code: string;
  createdAt: string; // ISO date string
  customerName: string;
  customerPhone: string;
  serviceType: ServiceType;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address?: OrderAddress;
  scheduledDate: string; // YYYY-MM-DD or 'hoje'
  scheduledTimeSlot: string; // e.g. "Entrega Expressa (30-45 min)", "08:00 - 10:00"
  preferredDriverId?: string;
  assignedDriverId?: string;
  paymentMethod: PaymentMethod;
  needChangeFor?: number; // Se dinheiro, valor para troco
  status: OrderStatus;
  notes?: string;
}

export interface SystemConfig {
  companyName: string;
  companyPhone: string; // WhatsApp para receber os pedidos
  companyAddress: string;
  portariaPrice: number;
  entregaPrice: number;
  defaultDeliveryFee: number;
  pixKey: string;
  pixKeyType: string; // CNPJ, Celular, CPF, Random
  pixReceiverName: string;
  openingHours: string;
  adminPasswordHash: string; // Senha do painel admin
  enableAutoWhatsAppRedirect: boolean;
}
