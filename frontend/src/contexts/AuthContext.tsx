import { createContext, useContext, useState, type ReactNode } from "react";

type AuthUser = {
  token: string;
  email?: string;
  rol?: string;
  empresaId?: string;
  usuarioId?: string;
  nombre?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isAuthenticated: boolean;
  loginUser: (data: AuthUser) => void;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol") ?? undefined;
    const email = localStorage.getItem("email") ?? undefined;
    const empresaId = localStorage.getItem("empresaId") ?? undefined;
    const usuarioId = localStorage.getItem("usuarioId") ?? undefined;
    const nombre = localStorage.getItem("nombre") ?? undefined;

    return token ? { token, rol, email, empresaId, usuarioId, nombre } : null;
  });

  function loginUser(data: AuthUser) {
    localStorage.setItem("token", data.token);

    if (data.rol) localStorage.setItem("rol", data.rol);
    if (data.email) localStorage.setItem("email", data.email);
    if (data.empresaId) localStorage.setItem("empresaId", data.empresaId);
    if (data.usuarioId) localStorage.setItem("usuarioId", data.usuarioId);
    if (data.nombre) localStorage.setItem("nombre", data.nombre);

    setUser(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");
    localStorage.removeItem("empresaId");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("nombre");
    setUser(null);
  }

  function hasRole(...roles: string[]) {
    if (!user?.rol) return false;
    return roles.includes(user.rol);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: Boolean(user?.token),
        loginUser,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}