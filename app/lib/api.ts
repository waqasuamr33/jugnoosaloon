const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://software.jugnussaloon.com/api';

export interface ProductItem {
  id: number;
  title: string;
  price: number;
  discount?: number;
  discounted_price?: number;
  stock?: number;
  image_url?: string | null;
  created_at?: string;
}

export interface ServiceCategoryItem {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  services_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description?: string;
  price: number;
  discount?: number;
  discounted_price?: number;
  category?: {
    id: number;
    title: string;
  };
  image_url?: string | null;
  created_at?: string;
}

export interface AppointmentPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  service_ids: number[];
  notes?: string;
  receipt_image?: File | null;
}

export interface AppointmentResponseData {
  booking_no: string;
  customer_name?: string;
  customer_phone?: string;
  appointment_date: string;
  start_time: string;
  net_amount?: number;
  status: string;
}

export interface AppointmentResponse {
  success: boolean;
  message?: string;
  data?: AppointmentResponseData;
  error?: string;
}

export interface BankAccountItem {
  id: number;
  bank_name?: string;
  title?: string;
  account_name?: string;
  account_title?: string;
  account_number?: string;
  account_no?: string;
  iban?: string;
  iban_no?: string;
  branch_code?: string;
  branch?: string;
  qr_code?: string;
  qr_image?: string;
  image_url?: string | null;
  description?: string;
  instructions?: string;
  is_active?: boolean | number;
  created_at?: string;
}

export interface CustomerProfile {
  id: number;
  name: string;
  username: string;
  phone_no1: string;
  phone_no2?: string | null;
  father_name?: string | null;
  address?: string | null;
  card_type?: string | null;
  card_no?: string | null;
  date_of_birth?: string | null;
  date_of_anniversary?: string | null;
  balance?: number;
  created_at?: string;
}

export interface CustomerSignupPayload {
  name: string;
  phone_no1: string;
  username: string;
  password: string;
  father_name?: string;
  address?: string;
  date_of_birth?: string;
  date_of_anniversary?: string;
  card_type?: string;
  card_no?: string;
  phone_no2?: string;
}

export interface CustomerLoginPayload {
  username: string; // username or phone_no1
  password: string;
}

export interface CustomerAuthResponse {
  success: boolean;
  message?: string;
  data?: CustomerProfile;
  error?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  data?: {
    id?: number;
    created_at?: string;
  };
  error?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category?: string;
  image_path?: string;
  image_url?: string;
  file_name?: string;
  file_size?: number;
  formatted_size?: string;
  sort_order?: number;
  created_at?: string;
}

/**
 * Fetch Product Catalog from Backend API
 */
export async function getProducts(search?: string): Promise<ProductItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/products`);
    if (search) url.searchParams.append('search', search);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[API] getProducts returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.warn('[API] Unable to fetch products from backend:', error);
    return [];
  }
}

/**
 * Fetch Services Catalog from Backend API
 */
export async function getServices(categoryId?: number, search?: string): Promise<ServiceItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/services`);
    if (categoryId) url.searchParams.append('category_id', String(categoryId));
    if (search) url.searchParams.append('search', search);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[API] getServices returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.warn('[API] Unable to fetch services from backend:', error);
    return [];
  }
}

/**
 * Fetch Service Categories from Backend API
 */
export async function getServiceCategories(): Promise<ServiceCategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[API] getServiceCategories returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.warn('[API] Unable to fetch categories from backend:', error);
    return [];
  }
}

/**
 * Normalizes backend image URLs (handles localhost dev URLs, relative paths, etc.)
 */
export function normalizeImageUrl(url?: string | null, path?: string | null): string {
  if (url) {
    if (url.startsWith('http://127.0.0.1:8000') || url.startsWith('http://localhost:8000')) {
      return url.replace(/^http:\/\/(127\.0\.0\.1|localhost):8000/, 'https://software.jugnussaloon.com');
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `https://software.jugnussaloon.com${url}`;
    }
    return `https://software.jugnussaloon.com/${url}`;
  }

  if (path) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://software.jugnussaloon.com${cleanPath}`;
  }

  return '/images/hero_salon.png';
}

/**
 * Fetch Showcase Gallery from Backend API
 */
export async function getGalleries(category?: string, search?: string): Promise<GalleryItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/galleries`);
    if (category && category !== 'All') url.searchParams.append('category', category);
    if (search) url.searchParams.append('search', search);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[API] getGalleries returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('[API] Error in getGalleries:', error);
    return [];
  }
}

/**
 * Submit Appointment Booking to Backend API
 */
export async function bookAppointment(payload: AppointmentPayload): Promise<AppointmentResponse> {
  try {
    if (payload.receipt_image && typeof window !== 'undefined' && payload.receipt_image instanceof File) {
      const formData = new FormData();
      formData.append('customer_name', payload.customer_name);
      formData.append('customer_phone', payload.customer_phone);
      if (payload.customer_email) formData.append('customer_email', payload.customer_email);
      formData.append('appointment_date', payload.appointment_date);
      formData.append('start_time', payload.start_time);
      payload.service_ids.forEach((id, index) => {
        formData.append(`service_ids[${index}]`, String(id));
      });
      if (payload.notes) formData.append('notes', payload.notes);
      formData.append('receipt_image', payload.receipt_image);

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: json.message || `Server returned HTTP ${res.status}`,
        };
      }
      return json;
    }

    const { receipt_image, ...jsonPayload } = payload;
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonPayload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.message || `Server returned HTTP ${res.status}`,
      };
    }

    return json;
  } catch (error: any) {
    console.error('[API] Error in bookAppointment:', error);
    return {
      success: false,
      error: error?.message || 'Failed to connect to backend server',
    };
  }
}

/**
 * Customer Sign Up
 */
export async function customerSignup(payload: CustomerSignupPayload): Promise<CustomerAuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || json.success === false) {
      return {
        success: false,
        error: json.message || `Registration failed (HTTP ${res.status})`,
      };
    }

    return json;
  } catch (error: any) {
    console.error('[API] Error in customerSignup:', error);
    return {
      success: false,
      error: error?.message || 'Failed to connect to backend registration server',
    };
  }
}

/**
 * Customer Login
 */
export async function customerLogin(payload: CustomerLoginPayload): Promise<CustomerAuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || json.success === false) {
      return {
        success: false,
        error: json.message || 'Invalid login credentials.',
      };
    }

    return json;
  } catch (error: any) {
    console.error('[API] Error in customerLogin:', error);
    return {
      success: false,
      error: error?.message || 'Failed to connect to authentication server',
    };
  }
}

/**
 * Submit Contact Form Inquiry to Backend API
 */
export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.message || `Server returned HTTP ${res.status}`,
      };
    }

    return json;
  } catch (error: any) {
    console.error('[API] Error in submitContact:', error);
    return {
      success: false,
      error: error?.message || 'Failed to submit contact request',
    };
  }
}

/**
 * Fetch Official Bank Accounts from Backend API
 */
export async function getBankAccounts(): Promise<BankAccountItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/bank-accounts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[API] getBankAccounts returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.warn('[API] Unable to fetch bank accounts from backend (using fallback):', error);
    return [];
  }
}

