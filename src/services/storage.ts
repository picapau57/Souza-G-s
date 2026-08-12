import { Order, SystemConfig, ExtraProduct, Driver, OrderStatus } from '../types';

const STORAGE_KEYS = {
  ORDERS: 'pantaleao_orders_v1',
  CONFIG: 'pantaleao_config_v1',
  PRODUCTS: 'pantaleao_products_v1',
  DRIVERS: 'pantaleao_drivers_v1',
  AUTH: 'pantaleao_admin_auth_v1',
};

export const DEFAULT_CONFIG: SystemConfig = {
  companyName: 'Depósito de Gás Pantaleão',
  companyPhone: '5567999887766', // Exemplo do número com DDD (67 Pantanal/MS)
  companyAddress: 'Av. Pantanal, 1050 - Bairro Centro, Corumbá/Campo Grande - MS',
  portariaPrice: 89.90,
  entregaPrice: 105.90,
  defaultDeliveryFee: 0, // Inclusa no preço de entrega
  pixKey: '12.345.678/0001-90',
  pixKeyType: 'CNPJ',
  pixReceiverName: 'Pantaleao Distribuidora de Gas Ltda',
  openingHours: 'Segunda a Sábado: 07:00 as 19:30 | Domingos: 08:00 as 13:00',
  adminPasswordHash: 'pantaleao123', // Senha padrão inicial fácil para o proprietário
  enableAutoWhatsAppRedirect: true,
};

export const DEFAULT_PRODUCTS: ExtraProduct[] = [
  {
    id: 'gas-13kg-portaria',
    name: 'Botijão de Gás P13 (Retirada)',
    price: 89.90,
    description: 'Botijão de gás Ultragaz/Nacional 13kg para retirar na portaria do depósito.',
    category: 'gas',
    imageIcon: 'Flame',
    available: true,
  },
  {
    id: 'gas-13kg-entrega',
    name: 'Botijão de Gás P13 (Entrega)',
    price: 105.90,
    description: 'Botijão de gás 13kg entregue rápido na sua residência ou comércio.',
    category: 'gas',
    imageIcon: 'Truck',
    available: true,
  },
  {
    id: 'agua-20l',
    name: 'Garrafão de Água Mineral 20L',
    price: 14.00,
    description: 'Água mineral purificada 20 Litres. Retirada ou entrega junto com o gás.',
    category: 'agua',
    imageIcon: 'Droplet',
    available: true,
  },
  {
    id: 'regulador-mangueira',
    name: 'Kit Mangueira 1.25m + Regulador de Gás',
    price: 45.00,
    description: 'Kit com validade de 5 anos, mangueira reforçada e abraçadeiras de aço.',
    category: 'acessorio',
    imageIcon: 'ShieldCheck',
    available: true,
  },
  {
    id: 'anel-vedacao',
    name: 'Válvula de Vedação Adicional',
    price: 5.00,
    description: 'Anel de vedação de borracha nitrílica para evitar pequenos vazamentos.',
    category: 'acessorio',
    imageIcon: 'Disc',
    available: true,
  },
];

export const DEFAULT_DRIVERS: Driver[] = [
  {
    id: 'driver-1',
    name: 'Carlos Silva',
    vehicle: 'Moto Honda Cargo 160 (Placa H3J-9210)',
    phone: '(67) 99811-2233',
    active: true,
    currentDeliveriesCount: 0,
  },
  {
    id: 'driver-2',
    name: 'Marcos Oliveira',
    vehicle: 'Furgão Fiorino Express (Placa K8P-1044)',
    phone: '(67) 99744-5566',
    active: true,
    currentDeliveriesCount: 0,
  },
  {
    id: 'driver-3',
    name: 'Renato Pantaneiro',
    vehicle: 'Triciclo Utilitário Gas (Placa M5F-3022)',
    phone: '(67) 99633-8899',
    active: true,
    currentDeliveriesCount: 0,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    code: 'PANT-9481',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 min atrás
    customerName: 'Dona Maria Lurdes',
    customerPhone: '(67) 99922-3344',
    serviceType: 'entrega',
    items: [
      { productId: 'gas-13kg-entrega', name: 'Botijão de Gás P13 (Entrega)', price: 105.90, quantity: 1 },
      { productId: 'agua-20l', name: 'Garrafão de Água Mineral 20L', price: 14.00, quantity: 1 },
    ],
    subtotal: 119.90,
    deliveryFee: 0,
    total: 119.90,
    address: {
      street: 'Rua das Palmeiras',
      number: '420',
      neighborhood: 'Bairro Maria Leite',
      complement: 'Casa com portão dourado',
      reference: 'Próximo ao Mercado do Zé',
      city: 'Corumbá',
    },
    scheduledDate: 'hoje',
    scheduledTimeSlot: 'Entrega Expressa (30-45 min)',
    assignedDriverId: 'driver-1',
    paymentMethod: 'pix',
    status: 'a_caminho',
    notes: 'Entregar na porta da cozinha.',
  },
  {
    id: 'ord-1002',
    code: 'PANT-9482',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min atrás
    customerName: 'Seu João Batista',
    customerPhone: '(67) 98122-8899',
    serviceType: 'portaria',
    items: [
      { productId: 'gas-13kg-portaria', name: 'Botijão de Gás P13 (Retirada)', price: 89.90, quantity: 1 }
    ],
    subtotal: 89.90,
    deliveryFee: 0,
    total: 89.90,
    scheduledDate: 'hoje',
    scheduledTimeSlot: 'Atendimento Imediato na Portaria',
    paymentMethod: 'dinheiro',
    needChangeFor: 100.00,
    status: 'pendente',
    notes: 'Vem buscar de carro azul.',
  },
  {
    id: 'ord-1003',
    code: 'PANT-9475',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 Horas atrás
    customerName: 'Ana Paula Santos',
    customerPhone: '(67) 99233-1100',
    serviceType: 'entrega',
    items: [
      { productId: 'gas-13kg-entrega', name: 'Botijão de Gás P13 (Entrega)', price: 105.90, quantity: 2 }
    ],
    subtotal: 211.80,
    deliveryFee: 0,
    total: 211.80,
    address: {
      street: 'Av. Rio Branco',
      number: '1250',
      neighborhood: 'Centro',
      complement: 'Apto 302',
      reference: 'Frente ao Banco',
      city: 'Corumbá',
    },
    scheduledDate: 'hoje',
    scheduledTimeSlot: '14:00 - 16:00',
    assignedDriverId: 'driver-2',
    paymentMethod: 'cartao_credito',
    status: 'entregue',
  }
];

export const storageService = {
  getConfig(): SystemConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
      }
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  saveConfig(config: SystemConfig): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    window.dispatchEvent(new Event('pantaleao_config_changed'));
  },

  getProducts(): ExtraProduct[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(products: ExtraProduct[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('pantaleao_products_changed'));
  },

  getDrivers(): Driver[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(DEFAULT_DRIVERS));
        return DEFAULT_DRIVERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_DRIVERS;
    }
  },

  saveDrivers(drivers: Driver[]): void {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    window.dispatchEvent(new Event('pantaleao_drivers_changed'));
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrder(order: Order): Order {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('pantaleao_orders_changed'));
    return order;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, assignedDriverId?: string): Order | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return null;

    const updated = {
      ...orders[orderIndex],
      status,
      ...(assignedDriverId ? { assignedDriverId } : {}),
    };
    orders[orderIndex] = updated;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('pantaleao_orders_changed'));
    return updated;
  },

  getOrderByCodeOrPhone(codeOrPhone: string): Order | undefined {
    const orders = this.getOrders();
    const term = codeOrPhone.trim().toLowerCase();
    const cleanTerm = term.replace(/\D/g, '');

    return orders.find((o) => {
      const matchCode = o.code.toLowerCase().includes(term) || o.id.toLowerCase().includes(term);
      const cleanPhone = o.customerPhone.replace(/\D/g, '');
      const matchPhone = cleanPhone.length >= 8 && cleanTerm.length >= 8 && cleanPhone.includes(cleanTerm);
      return matchCode || matchPhone;
    });
  },

  // Autenticação Admin
  isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  setAdminLoggedIn(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.AUTH, status ? 'true' : 'false');
    window.dispatchEvent(new Event('pantaleao_auth_changed'));
  },

  generateOrderCode(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PANT-${random}`;
  }
};
