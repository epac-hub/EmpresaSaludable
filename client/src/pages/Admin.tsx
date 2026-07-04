import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { Loader2, Trash2, Mail, Building, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [adminPassword, setAdminPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password gate for non-admin users or as extra security
  const ADMIN_PASSWORD = "EmpresaSaludable2026";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#66BB6A]" />
      </div>
    );
  }

  // If user is logged in and is admin, skip password gate
  const isAdmin = user?.role === "admin";

  if (!authenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#66BB6A]/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#66BB6A]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Panel de Administración
          </h1>
          <p className="text-white/50 text-center text-sm mb-8">
            Ingrese la contraseña de administrador para acceder.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminPassword === ADMIN_PASSWORD) {
                setAuthenticated(true);
              } else {
                toast.error("Contraseña incorrecta");
              }
            }}
          >
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#66BB6A]/50 focus:ring-1 focus:ring-[#66BB6A]/30 transition-all mb-4"
            />
            <Button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#66BB6A] to-[#43A047] text-white font-semibold hover:shadow-lg hover:shadow-[#43A047]/30 transition-all"
            >
              Acceder
            </Button>
          </form>
          <a
            href="/"
            className="flex items-center justify-center gap-2 mt-6 text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al sitio
          </a>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { data: submissions, isLoading, refetch } = trpc.admin.listSubmissions.useQuery();
  const deleteMutation = trpc.admin.deleteSubmission.useMutation({
    onSuccess: () => {
      toast.success("Mensaje eliminado");
      refetch();
    },
    onError: () => {
      toast.error("Error al eliminar");
    },
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#66BB6A]/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#66BB6A]" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Admin Panel
              </h1>
              <p className="text-xs text-white/40">Empresa Saludable</p>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al sitio
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mensajes de Contacto
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {submissions?.length ?? 0} mensaje{(submissions?.length ?? 0) !== 1 ? "s" : ""} recibido{(submissions?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
          >
            Actualizar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#66BB6A]" />
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
            <Mail className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/40 text-lg">No hay mensajes aún</p>
            <p className="text-white/20 text-sm mt-2">Los mensajes del formulario de contacto aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300"
              >
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#66BB6A]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#66BB6A] font-bold text-sm">
                        {sub.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{sub.name}</p>
                      <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {sub.email}
                        </span>
                        {sub.company && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" /> {sub.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-white/30 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("es-PR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "—"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("¿Eliminar este mensaje?")) {
                          deleteMutation.mutate({ id: sub.id });
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedId === sub.id && (
                  <div className="px-6 pb-5 pt-0 border-t border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed mt-4 whitespace-pre-wrap">
                      {sub.message}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`mailto:${sub.email}?subject=Re: Consulta Empresa Saludable`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#66BB6A]/10 text-[#66BB6A] text-sm hover:bg-[#66BB6A]/20 transition-all"
                      >
                        <Mail className="w-4 h-4" /> Responder
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
