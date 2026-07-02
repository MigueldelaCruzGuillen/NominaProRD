export type NominaResumen = {
  id: string;
  periodoNominaId: string;
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
  estado: string;
  fechaGeneracion: string;
};