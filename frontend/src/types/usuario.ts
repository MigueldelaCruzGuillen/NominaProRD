export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  empresaId: string;
  activo: boolean;
};

export type CreateUsuarioRequest = {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  empresaId: string;
};

export type UpdateUsuarioRequest = {
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
};