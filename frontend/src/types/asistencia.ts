export type Asistencia = {
  id: string;
  empleadoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string | null;
  horasTrabajadas: number;
  horasExtras: number;
  estado: string;
};