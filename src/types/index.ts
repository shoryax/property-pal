export interface Property {
  property_id: string;
  title: string;
  type: 'apartment' | 'villa' | 'plot' | 'commercial';
  address: string;
  city: string;
  state: string;
  pincode: string;
  area_sqft: number;
  price: number;
  status: 'available' | 'sold' | 'rented';
  description: string;
  listed_date: string;
}

export interface Owner {
  owner_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  id_proof_type: string;
  id_proof_number: string;
}

export interface Agent {
  agent_id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  agency_name: string;
  commission_rate: number;
  joined_date: string;
}

export interface Buyer {
  buyer_id: string;
  name: string;
  email: string;
  phone: string;
  budget_min: number;
  budget_max: number;
  preferred_city: string;
  preferred_type: string;
}

export interface Listing {
  listing_id: string;
  property_id: string;
  agent_id: string;
  owner_id: string;
  listing_type: 'sale' | 'rent';
  asking_price: number;
  listing_date: string;
  expiry_date: string;
  status: string;
  // Joined fields
  property?: Property;
  agent?: Agent;
  owner?: Owner;
}

export interface Transaction {
  transaction_id: string;
  listing_id: string;
  buyer_id: string;
  agent_id: string;
  sale_price: number;
  transaction_date: string;
  payment_mode: string;
  status: 'pending' | 'completed' | 'cancelled';
  // Joined
  listing?: Listing;
  buyer?: Buyer;
  agent?: Agent;
}

export interface Inspection {
  inspection_id: string;
  property_id: string;
  buyer_id: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  // Joined
  property?: Property;
  buyer?: Buyer;
}
