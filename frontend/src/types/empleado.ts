export type Empleado = {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  fechaIngreso: string;
  salarioBase: number;
  estado: string;
  tipoContrato: string;

  empresaId: string;
  departamentoId: string;
  puestoId: string;

  empresaNombre: string;
  departamentoNombre: string;
  puestoNombre: string;
};