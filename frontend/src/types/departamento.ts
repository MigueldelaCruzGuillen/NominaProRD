export type Departamento = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  empresaId: string;
  activo: boolean;
  totalEmpleados: number;
};

