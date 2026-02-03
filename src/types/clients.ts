export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  address: string;
  image_path: string;
  tags?: string[];
}
