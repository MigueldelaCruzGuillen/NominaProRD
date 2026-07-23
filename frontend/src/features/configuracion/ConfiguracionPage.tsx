import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { Tab, Tabs } from "@mui/material";
import { getEmpresas, updateEmpresa, type Empresa } from "../../services/empresaService";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useConfiguracion } from "../../contexts/ConfiguracionContext";
import {
  getConfiguracionNomina,
  updateConfiguracionNomina,
} from "../../services/configuracionNominaService";

export function ConfiguracionPage() {
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [tab, setTab] = useState(0);
    const { showMessage } = useSnackbar();
    
    const { configuracion, guardarConfiguracion } = useConfiguracion();
    const [configSistema, setConfigSistema] = useState(configuracion);
    const [configNomina, setConfigNomina] = useState({
        porcentajeAfp: 2.87,
        porcentajeSfs: 3.04,
        aplicarIsr: true,
        diaPago: 30,
        decimales: 2,
    });

    useEffect(() => {
        getEmpresas()
            .then((data) => setEmpresa(data[0]))
            .catch(() => showMessage("No se pudo cargar la empresa.", "error"));

        getConfiguracionNomina()
            .then(setConfigNomina)
            .catch(() =>
                showMessage(
                    "No se pudo cargar la configuración de nómina.",
                    "error"
                )
            );
    }, [showMessage]);

    // Mantener sincronizado con el contexto
    useEffect(() => {
        setConfigSistema(configuracion);
    }, [configuracion]);

    if (!empresa) return <Typography>Cargando...</Typography>;

    async function handleGuardar() {
        if (!empresa) return;

        try {
            await updateEmpresa(empresa.id, empresa);
            showMessage("Empresa actualizada correctamente.", "success");
        } catch (error) {
            showMessage("Error al actualizar la empresa.", "error");
        }
    }

    async function handleGuardarConfiguracionSistema() {
        try {
            await guardarConfiguracion(configSistema);
            showMessage(
                "Configuración del sistema actualizada correctamente.",
                "success"
            );
        } catch (error: any) {
            showMessage(
                error.response?.data?.message ??
                    "No se pudo actualizar la configuración.",
                "error"
            );
        }
    }

    async function handleGuardarConfiguracionNomina() {
        try {
            const actualizada = await updateConfiguracionNomina(configNomina);
            setConfigNomina(actualizada);
            showMessage(
                "Configuración de nómina actualizada correctamente.",
                "success"
            );
        } catch (error: any) {
            showMessage(
                error.response?.data?.message ??
                    "No se pudo actualizar la configuración de nómina.",
                "error"
            );
        }
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Configuración
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Datos generales de la empresa.
            </Typography>

            <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                sx={{ mb: 3 }}
            >
                <Tab label="Empresa" />
                <Tab label="Sistema" />
                <Tab label="Nómina" />
                <Tab label="Plantillas" />
                <Tab label="Seguridad" />
            </Tabs>

            {tab === 0 && (
                <Card sx={{ maxWidth: 760 }}>
                    <CardContent
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField 
                            label="Nombre" 
                            value={empresa.nombre} 
                            onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })} 
                        />
                        <TextField 
                            label="RNC" 
                            value={empresa.rnc} 
                            onChange={(e) => setEmpresa({ ...empresa, rnc: e.target.value })} 
                        />
                        <TextField 
                            label="Dirección" 
                            value={empresa.direccion} 
                            onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })} 
                        />
                        <TextField 
                            label="Teléfono" 
                            value={empresa.telefono} 
                            onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })} 
                        />
                        <TextField 
                            label="Correo" 
                            value={empresa.correo} 
                            onChange={(e) => setEmpresa({ ...empresa, correo: e.target.value })} 
                        />

                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Button variant="contained" onClick={handleGuardar}>
                                Guardar cambios
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {tab === 1 && (
                <Card sx={{ maxWidth: 760 }}>
                    <CardContent
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            select
                            label="Idioma"
                            value={configSistema.idioma}
                            onChange={(e) =>
                                setConfigSistema({
                                    ...configSistema,
                                    idioma: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="es-DO">Español — República Dominicana</MenuItem>
                            <MenuItem value="en-US">Inglés</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Zona horaria"
                            value={configSistema.zonaHoraria}
                            onChange={(e) =>
                                setConfigSistema({
                                    ...configSistema,
                                    zonaHoraria: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="America/Santo_Domingo">
                                Santo Domingo
                            </MenuItem>
                            <MenuItem value="America/New_York">
                                Nueva York
                            </MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Formato de fecha"
                            value={configSistema.formatoFecha}
                            onChange={(e) =>
                                setConfigSistema({
                                    ...configSistema,
                                    formatoFecha: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="dd/MM/yyyy">DD/MM/AAAA</MenuItem>
                            <MenuItem value="MM/dd/yyyy">MM/DD/AAAA</MenuItem>
                            <MenuItem value="yyyy-MM-dd">AAAA-MM-DD</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Moneda"
                            value={configSistema.moneda}
                            onChange={(e) =>
                                setConfigSistema({
                                    ...configSistema,
                                    moneda: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="DOP">Peso dominicano — DOP</MenuItem>
                            <MenuItem value="USD">Dólar estadounidense — USD</MenuItem>
                        </TextField>

                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Button
                                variant="contained"
                                onClick={handleGuardarConfiguracionSistema}
                            >
                                Guardar configuración
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {tab === 2 && (
                <Card sx={{ maxWidth: 760 }}>
                    <CardContent
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="AFP empleado (%)"
                            type="number"
                            value={configNomina.porcentajeAfp}
                            onChange={(e) =>
                                setConfigNomina({
                                    ...configNomina,
                                    porcentajeAfp: Number(e.target.value),
                                })
                            }
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: 0.01,
                                },
                            }}
                        />

                        <TextField
                            label="SFS empleado (%)"
                            type="number"
                            value={configNomina.porcentajeSfs}
                            onChange={(e) =>
                                setConfigNomina({
                                    ...configNomina,
                                    porcentajeSfs: Number(e.target.value),
                                })
                            }
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: 0.01,
                                },
                            }}
                        />

                        <TextField
                            select
                            label="Día habitual de pago"
                            value={configNomina.diaPago}
                            onChange={(e) =>
                                setConfigNomina({
                                    ...configNomina,
                                    diaPago: Number(e.target.value),
                                })
                            }
                        >
                            {[15, 20, 25, 30].map((dia) => (
                                <MenuItem key={dia} value={dia}>
                                    Día {dia}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Decimales"
                            value={configNomina.decimales}
                            onChange={(e) =>
                                setConfigNomina({
                                    ...configNomina,
                                    decimales: Number(e.target.value),
                                })
                            }
                        >
                            <MenuItem value={0}>0 decimales</MenuItem>
                            <MenuItem value={2}>2 decimales</MenuItem>
                        </TextField>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={configNomina.aplicarIsr}
                                    onChange={(e) =>
                                        setConfigNomina({
                                            ...configNomina,
                                            aplicarIsr: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Calcular ISR automáticamente"
                            sx={{ gridColumn: "1 / -1" }}
                        />

                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Button
                                variant="contained"
                                onClick={handleGuardarConfiguracionNomina}
                            >
                                Guardar configuración
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {tab === 3 && (
                <Typography color="text.secondary">
                    Las plantillas de reportes y recibos se configurarán aquí.
                </Typography>
            )}

            {tab === 4 && (
                <Typography color="text.secondary">
                    Las opciones de seguridad se configurarán aquí.
                </Typography>
            )}
        </Box>
    );
}