export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  email: string;
  rol: string;
  empresaId: string;
};