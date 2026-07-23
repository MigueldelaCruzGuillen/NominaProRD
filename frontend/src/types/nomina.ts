export type NominaDetalle = {
  empleadoId: string;
  empleadoNombre: string;
  departamento: string;
  puesto: string;
  salarioBase: number;
  horasExtras?: number;
  afp: number;
  sfs: number;
  isr: number;
  totalIngresos: number;
  totalDeducciones: number;
  netoPagar: number;
};

export type Nomina = {
  id: string;
  periodoNominaId: string;
  periodoNombre: string;  
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
  estado: string;
  fechaGeneracion: string;
  pagadaPorUsuarioId?: string | null;
  fechaPago?: string | null;  
  pagadaPorUsuario?: string | null;  // ✅ Agregado
  detalles: NominaDetalle[];
};

export type NominaResumen = {
  id: string;
  periodoNominaId: string;
  periodoNombre: string;  
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
  estado: string;
  fechaGeneracion: string;
  pagadaPorUsuarioId?: string | null;
  fechaPago?: string | null;
  pagadaPorUsuario?: string | null;  // ✅ Agregado (opcional para consistencia)
};