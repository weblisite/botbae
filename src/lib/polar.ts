import { toast } from "@/components/ui/sonner";

// Polar API configuration
const POLAR_API_URL = import.meta.env.VITE_POLAR_API_URL || 'https://api.polar.sh/v1';
const POLAR_ACCESS_TOKEN = import.meta.env.VITE_POLAR_ACCESS_TOKEN;

export interface PolarProduct {
  id: string;
  name: string;
  description: string;
  is_recurring: boolean;
  is_archived: boolean;
  organization_id: string;
  prices: PolarPrice[];
}

export interface PolarPrice {
  id: string;
  created_at: string;
  modified_at: string;
  amount_cents: number;
  currency: string;
  type: 'one_time' | 'recurring';
  recurring_interval?: 'month' | 'year';
  is_archived: boolean;
  product_id: string;
}

export interface PolarCheckoutSession {
  id: string;
  url: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  product_id: string;
  product_price_id: string;
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}

export class PolarAPI {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = POLAR_API_URL;
    this.accessToken = POLAR_ACCESS_TOKEN || '';
    
    if (!this.accessToken) {
      console.warn('Polar access token not configured');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Polar API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Get organization products
  async getProducts(organizationId: string): Promise<PolarProduct[]> {
    try {
      const response = await this.makeRequest(`/products?organization_id=${organizationId}`);
      return response.items || [];
    } catch (error) {
      console.error('Error fetching Polar products:', error);
      return [];
    }
  }

  // Create checkout session
  async createCheckoutSession(params: {
    productPriceId: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    customerName?: string;
    metadata?: Record<string, string>;
  }): Promise<PolarCheckoutSession> {
    const body = {
      product_price_id: params.productPriceId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      customer_name: params.customerName,
      metadata: params.metadata,
    };

    return this.makeRequest('/checkouts/custom', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Get checkout session
  async getCheckoutSession(sessionId: string): Promise<PolarCheckoutSession> {
    return this.makeRequest(`/checkouts/custom/${sessionId}`);
  }
}

// Default instance
export const polar = new PolarAPI();

// Product price mapping for our plans
export const POLAR_PRODUCT_PRICES = {
  'pro': import.meta.env.VITE_POLAR_PRO_PRICE_ID || '',
  'elite': import.meta.env.VITE_POLAR_ELITE_PRICE_ID || '',
};

// Mock Polar checkout for development
export const createMockCheckout = async (planId: string, userEmail: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockCheckoutUrl = `https://checkout.polar.sh/mock/${planId}?email=${encodeURIComponent(userEmail)}`;
  
  return {
    id: `mock_checkout_${Date.now()}`,
    url: mockCheckoutUrl,
    customer_email: userEmail,
    product_id: planId,
  };
};

// Utility function to format price
export const formatPolarPrice = (amountCents: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
};

// Validate webhook signature (for server-side use)
export const validatePolarWebhook = (payload: string, signature: string, secret: string): boolean => {
  // Implementation would depend on Polar's webhook signature validation
  // This is a placeholder for the actual implementation
  return true;
}; 