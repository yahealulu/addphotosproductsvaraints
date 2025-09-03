export interface Product {
  id: number;
  product_code: string;
  name_translations: {
    en: string;
    ar: string;
    fr?: string;
    de?: string;
    tr?: string;
    fa?: string;
    ru?: string;
    zh?: string;
    da?: string;
  };
  description_translations: {
    en: string;
    ar: string;
    fr?: string;
    de?: string;
    tr?: string;
    fa?: string;
    ru?: string;
    zh?: string;
    da?: string;
  };
  material_property: string;
  product_category: string;
  weight_unit: string;
  barcode: string;
  country_origin_name: string;
  image: string | null;
  in_stock: boolean;
  is_hidden: boolean;
  is_new: boolean;
  variants: Variant[];
}

export interface Variant {
  id: number;
  product_id: number;
  size: string;
  box_dimensions: string;
  standard_weight: string;
  image: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  status: boolean;
  message: string;
  data: Product[];
}