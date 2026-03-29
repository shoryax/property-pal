import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions matching database schema
export interface DatabaseOwner {
  owner_id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  id_proof_type: string | null;
  id_proof_number: string | null;
  created_at: string;
}

export interface DatabaseAgent {
  agent_id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  agency_name: string | null;
  commission_rate: number | null;
  joined_date: string | null;
  created_at: string;
}

export interface DatabaseBuyer {
  buyer_id: string;
  name: string;
  email: string;
  phone: string;
  budget_min: number | null;
  budget_max: number | null;
  preferred_city: string | null;
  preferred_type: 'apartment' | 'villa' | 'plot' | 'commercial' | null;
  created_at: string;
}

export interface DatabaseProperty {
  property_id: string;
  owner_id: string;
  title: string;
  type: 'apartment' | 'villa' | 'plot' | 'commercial';
  address: string;
  city: string;
  state: string;
  pincode: string;
  area_sqft: number | null;
  price: number;
  status: 'available' | 'sold' | 'rented';
  description: string | null;
  listed_date: string | null;
  created_at: string;
}

export interface DatabaseListing {
  listing_id: string;
  property_id: string;
  agent_id: string;
  owner_id: string;
  listing_type: 'sale' | 'rent';
  asking_price: number;
  listing_date: string | null;
  expiry_date: string | null;
  status: 'active' | 'closed' | 'expired';
  created_at: string;
}

export interface DatabaseTransaction {
  transaction_id: string;
  listing_id: string;
  buyer_id: string;
  agent_id: string;
  sale_price: number;
  transaction_date: string | null;
  payment_mode: 'cash' | 'bank_transfer' | 'loan' | 'cheque' | null;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DatabaseInspection {
  inspection_id: string;
  property_id: string;
  buyer_id: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

// API Functions

export const ownersApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('owners').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('owners').select('*').eq('owner_id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (owner: Omit<DatabaseOwner, 'owner_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('owners').insert(owner).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseOwner>) => {
    const { data, error } = await supabase.from('owners').update(updates).eq('owner_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('owners').delete().eq('owner_id', id);
    if (error) throw error;
  }
};

export const agentsApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('agents').select('*').eq('agent_id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (agent: Omit<DatabaseAgent, 'agent_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('agents').insert(agent).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseAgent>) => {
    const { data, error } = await supabase.from('agents').update(updates).eq('agent_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('agents').delete().eq('agent_id', id);
    if (error) throw error;
  }
};

export const buyersApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('buyers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('buyers').select('*').eq('buyer_id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (buyer: Omit<DatabaseBuyer, 'buyer_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('buyers').insert(buyer).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseBuyer>) => {
    const { data, error } = await supabase.from('buyers').update(updates).eq('buyer_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('buyers').delete().eq('buyer_id', id);
    if (error) throw error;
  }
};

export const propertiesApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('properties').select('*').eq('property_id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (property: Omit<DatabaseProperty, 'property_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('properties').insert(property).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseProperty>) => {
    const { data, error } = await supabase.from('properties').update(updates).eq('property_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('property_id', id);
    if (error) throw error;
  }
};

export const listingsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        property:properties (property_id, title, type, address, city, price, status),
        agent:agents (agent_id, name),
        owner:owners (owner_id, name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        property:properties (property_id, title, type, address, city, price, status),
        agent:agents (agent_id, name),
        owner:owners (owner_id, name)
      `)
      .eq('listing_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (listing: Omit<DatabaseListing, 'listing_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('listings').insert(listing).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseListing>) => {
    const { data, error } = await supabase.from('listings').update(updates).eq('listing_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('listings').delete().eq('listing_id', id);
    if (error) throw error;
  }
};

export const transactionsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        listing:listings (
          listing_id,
          property:properties (property_id, title, type, address, city, price, status)
        ),
        buyer:buyers (buyer_id, name),
        agent:agents (agent_id, name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        listing:listings (
          listing_id,
          property:properties (property_id, title, type, address, city, price, status)
        ),
        buyer:buyers (buyer_id, name),
        agent:agents (agent_id, name)
      `)
      .eq('transaction_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (transaction: Omit<DatabaseTransaction, 'transaction_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('transactions').insert(transaction).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseTransaction>) => {
    const { data, error } = await supabase.from('transactions').update(updates).eq('transaction_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('transaction_id', id);
    if (error) throw error;
  }
};

export const inspectionsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('inspections')
      .select(`
        *,
        property:properties (property_id, title, type, address, city),
        buyer:buyers (buyer_id, name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('inspections')
      .select(`
        *,
        property:properties (property_id, title, type, address, city),
        buyer:buyers (buyer_id, name)
      `)
      .eq('inspection_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (inspection: Omit<DatabaseInspection, 'inspection_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('inspections').insert(inspection).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, updates: Partial<DatabaseInspection>) => {
    const { data, error } = await supabase.from('inspections').update(updates).eq('inspection_id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('inspections').delete().eq('inspection_id', id);
    if (error) throw error;
  }
};
