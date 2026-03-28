import { Property, Owner, Agent, Buyer, Listing, Transaction, Inspection } from '@/types';

export const properties: Property[] = [
  { property_id: 'p1', title: 'Sunrise Apartments 3BHK', type: 'apartment', address: '12 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', area_sqft: 1200, price: 8500000, status: 'available', description: 'Spacious 3BHK apartment with sea view', listed_date: '2024-01-15' },
  { property_id: 'p2', title: 'Green Valley Villa', type: 'villa', address: '45 Palm Drive', city: 'Bangalore', state: 'Karnataka', pincode: '560001', area_sqft: 3500, price: 25000000, status: 'available', description: 'Luxury villa with private garden', listed_date: '2024-02-20' },
  { property_id: 'p3', title: 'Downtown Commercial Space', type: 'commercial', address: '78 Business Park', city: 'Delhi', state: 'Delhi', pincode: '110001', area_sqft: 5000, price: 45000000, status: 'sold', description: 'Prime commercial space in business district', listed_date: '2024-03-10' },
  { property_id: 'p4', title: 'Lakeview Plot', type: 'plot', address: '23 Lake Road', city: 'Pune', state: 'Maharashtra', pincode: '411001', area_sqft: 2400, price: 12000000, status: 'available', description: 'Residential plot near lake', listed_date: '2024-04-05' },
  { property_id: 'p5', title: 'Skyline 2BHK', type: 'apartment', address: '56 Ring Road', city: 'Hyderabad', state: 'Telangana', pincode: '500001', area_sqft: 950, price: 5500000, status: 'rented', description: 'Modern 2BHK with amenities', listed_date: '2024-05-12' },
  { property_id: 'p6', title: 'Royal Heritage Villa', type: 'villa', address: '89 Heritage Lane', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', area_sqft: 4200, price: 32000000, status: 'available', description: 'Heritage style villa', listed_date: '2024-06-01' },
];

export const owners: Owner[] = [
  { owner_id: 'o1', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '9876543210', address: 'Mumbai, Maharashtra', id_proof_type: 'Aadhaar', id_proof_number: 'XXXX-XXXX-1234' },
  { owner_id: 'o2', name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543211', address: 'Bangalore, Karnataka', id_proof_type: 'PAN', id_proof_number: 'ABCDE1234F' },
  { owner_id: 'o3', name: 'Amit Patel', email: 'amit@email.com', phone: '9876543212', address: 'Delhi, Delhi', id_proof_type: 'Aadhaar', id_proof_number: 'XXXX-XXXX-5678' },
];

export const agents: Agent[] = [
  { agent_id: 'a1', name: 'Vikram Singh', email: 'vikram@realty.com', phone: '9876543220', license_number: 'REA2024001', agency_name: 'Singh Realty', commission_rate: 2.5, joined_date: '2023-01-15' },
  { agent_id: 'a2', name: 'Neha Gupta', email: 'neha@homes.com', phone: '9876543221', license_number: 'REA2024002', agency_name: 'Dream Homes', commission_rate: 2.0, joined_date: '2023-06-20' },
  { agent_id: 'a3', name: 'Arjun Reddy', email: 'arjun@properties.com', phone: '9876543222', license_number: 'REA2024003', agency_name: 'Reddy Properties', commission_rate: 3.0, joined_date: '2022-11-01' },
];

export const buyers: Buyer[] = [
  { buyer_id: 'b1', name: 'Suresh Menon', email: 'suresh@email.com', phone: '9876543230', budget_min: 5000000, budget_max: 10000000, preferred_city: 'Mumbai', preferred_type: 'apartment' },
  { buyer_id: 'b2', name: 'Kavita Joshi', email: 'kavita@email.com', phone: '9876543231', budget_min: 20000000, budget_max: 35000000, preferred_city: 'Bangalore', preferred_type: 'villa' },
  { buyer_id: 'b3', name: 'Ravi Prasad', email: 'ravi@email.com', phone: '9876543232', budget_min: 10000000, budget_max: 50000000, preferred_city: 'Delhi', preferred_type: 'commercial' },
];

export const listings: Listing[] = [
  { listing_id: 'l1', property_id: 'p1', agent_id: 'a1', owner_id: 'o1', listing_type: 'sale', asking_price: 8500000, listing_date: '2024-01-20', expiry_date: '2024-07-20', status: 'active' },
  { listing_id: 'l2', property_id: 'p2', agent_id: 'a2', owner_id: 'o2', listing_type: 'sale', asking_price: 25000000, listing_date: '2024-02-25', expiry_date: '2024-08-25', status: 'active' },
  { listing_id: 'l3', property_id: 'p3', agent_id: 'a3', owner_id: 'o3', listing_type: 'sale', asking_price: 45000000, listing_date: '2024-03-15', expiry_date: '2024-09-15', status: 'closed' },
  { listing_id: 'l4', property_id: 'p5', agent_id: 'a1', owner_id: 'o1', listing_type: 'rent', asking_price: 25000, listing_date: '2024-05-15', expiry_date: '2024-11-15', status: 'active' },
];

export const transactions: Transaction[] = [
  { transaction_id: 't1', listing_id: 'l3', buyer_id: 'b3', agent_id: 'a3', sale_price: 44000000, transaction_date: '2024-04-10', payment_mode: 'Bank Transfer', status: 'completed' },
  { transaction_id: 't2', listing_id: 'l1', buyer_id: 'b1', agent_id: 'a1', sale_price: 8200000, transaction_date: '2024-05-20', payment_mode: 'Home Loan', status: 'pending' },
];

export const inspections: Inspection[] = [
  { inspection_id: 'i1', property_id: 'p1', buyer_id: 'b1', scheduled_date: '2024-05-10', status: 'completed', notes: 'Buyer satisfied with property condition' },
  { inspection_id: 'i2', property_id: 'p2', buyer_id: 'b2', scheduled_date: '2024-06-15', status: 'scheduled', notes: 'First visit scheduled' },
  { inspection_id: 'i3', property_id: 'p4', buyer_id: 'b1', scheduled_date: '2024-06-20', status: 'scheduled', notes: 'Plot inspection with surveyor' },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function getPropertyById(id: string) { return properties.find(p => p.property_id === id); }
export function getOwnerById(id: string) { return owners.find(o => o.owner_id === id); }
export function getAgentById(id: string) { return agents.find(a => a.agent_id === id); }
export function getBuyerById(id: string) { return buyers.find(b => b.buyer_id === id); }
export function getListingById(id: string) { return listings.find(l => l.listing_id === id); }
