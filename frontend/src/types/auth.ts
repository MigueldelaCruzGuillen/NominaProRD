export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  usuarioId: string;
  email: string;
  rol: string;
  empresaId: string;
  nombre: string;
};