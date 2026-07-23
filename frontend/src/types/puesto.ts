export type Puesto = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  empresaId: string;
  departamentoId: string;
  departamentoNombre: string;
  activo: boolean;
  totalEmpleados: number;
};