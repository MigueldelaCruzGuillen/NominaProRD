export interface Asistencia {
  id: string;

  empleadoId: string;
  empleadoNombre: string;

  departamentoId?: string | null;
  departamentoNombre: string;

  puestoId?: string | null;
  puestoNombre: string;

  fecha: string;
  horaEntrada: string;
  horaSalida?: string | null;

  horasTrabajadas: number;
  horasExtras: number;

  estado: string;
}