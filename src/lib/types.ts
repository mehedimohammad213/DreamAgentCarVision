export interface CarPhoto {
  id: number;
  car_id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Car {
  id: number;
  category_id: number;
  ref_no?: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  mileage_km?: number;
  engine_cc?: number;
  transmission?: string;
  drive?: string;
  steering?: string;
  fuel?: string;
  color?: string;
  seats?: number;
  grade_overall?: number | string;
  grade_exterior?: string;
  grade_interior?: string;
  price_amount?: number;
  price_currency: string;
  status: string;
  location?: string;
  country_origin?: string;
  body?: string;
  type?: string;
  package?: string;
  keys_feature?: string;
  chassis_no_masked?: string;
  engine_number?: string;
  number_of_keys?: number;
  notes?: string;
  category?: { id: number; name: string };
  subcategory?: { id: number; name: string };
  photos?: CarPhoto[];
  primary_photo?: CarPhoto;
  primary_photo_url?: string;
  price_formatted?: string;
}

export interface PaginatedCars {
  data: Car[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CarsApiResponse {
  success: boolean;
  data: PaginatedCars | Car[];
  message?: string;
}
