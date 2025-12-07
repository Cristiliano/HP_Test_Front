export interface BrasilApiCepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  location?: {
    type: string;
    coordinates: {
      longitude: number;
      latitude: number;
    };
  };
}

export interface BrasilApiError {
  name: string;
  message: string;
  type: string;
}
