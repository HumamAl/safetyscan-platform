import { XCircle, CheckCircle2, ShieldOff, ShieldCheck, Lock } from "lucide-react";

interface AuthLayer {
  label: string;
  enforced: boolean;
}

interface AuthScenarioProps {
  title: string;
  variant: "problem" | "solution";
  layers: AuthLayer[];
  verdict: string;
  verdictDetail: string;
}

function AuthScenario({
  title,
  variant,
  layers,
  verdict,
  verdictDetail,
}: AuthScenarioProps) {
  const isSolution = variant === "solution";

  return (
    <div
      className="rounded border p-4 space-y-3"
      style={
        isSolution
          ? {
              backgroundColor:
                "color-mix(in oklch, var(--success) 5%, transparent)",
              borderColor:
                "color-mix(in oklch, var(--success) 18%, transparent)",
            }
          : {
              backgroundColor:
                "color-mix(in oklch, var(--destructive) 5%, transparent)",
              borderColor:
                "color-mix(in oklch, var(--destructive) 18%, transparent)",
            }
      }
    >
      <div className="flex items-center gap-2">
        {isSolution ? (
          <ShieldCheck className="w-4 h-4 text-[color:var(--success)] shrink-0" />
        ) : (
          <ShieldOff className="w-4 h-4 text-destructive shrink-0" />
        )}
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            isSolution ? "text-[color:var(--success)]" : "text-destructive"
          }`}
        >
          {title}
        </p>
      </div>

      <div className="space-y-1.5">
        {layers.map((layer) => (
          <div key={layer.label} className="flex items-center gap-2">
            {layer.enforced ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[color:var(--success)]" />
            ) : (
              <XCircle className="w-3.5 h-3.5 shrink-0 text-destructive" />
            )}
            <span
              className={`text-xs ${
                layer.enforced
                  ? "text-foreground"
                  : "text-muted-foreground line-through"
              }`}
            >
              {layer.label}
            </span>
            {!layer.enforced && (
              <span className="text-[10px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                missing
              </span>
            )}
            {layer.enforced && isSolution && (
              <Lock className="w-2.5 h-2.5 text-[color:var(--success)] opacity-60" />
            )}
          </div>
        ))}
      </div>

      <div
        className={`text-xs rounded px-2.5 py-2 border ${
          isSolution
            ? "border-[color-mix(in_oklch,var(--success)_20%,transparent)] text-[color:var(--success)]"
            : "border-destructive/20 text-destructive"
        }`}
        style={
          isSolution
            ? {
                backgroundColor:
                  "color-mix(in oklch, var(--success) 8%, transparent)",
              }
            : {
                backgroundColor:
                  "color-mix(in oklch, var(--destructive) 8%, transparent)",
              }
        }
      >
        <span className="font-semibold">{verdict}: </span>
        {verdictDetail}
      </div>
    </div>
  );
}

export function AuthEnforcementViz() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Inspector-role user attempts to call{" "}
        <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">
          POST /api/findings/escalate
        </code>{" "}
        (requires <span className="font-medium">safety_manager</span> role)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AuthScenario
          title="Frontend-Only Auth"
          variant="problem"
          layers={[
            { label: "Frontend route guard checks role", enforced: true },
            { label: "API validates Keycloak OIDC token", enforced: false },
            { label: "RBAC check on /findings/escalate", enforced: false },
            { label: "Token claims verified on write", enforced: false },
          ]}
          verdict="Bypassed"
          verdictDetail="Direct API call with valid JWT skips all route guards. Inspector escalates finding — no server-side role check fired."
        />
        <AuthScenario
          title="Boundary-Enforced Auth"
          variant="solution"
          layers={[
            { label: "Frontend route guard checks role", enforced: true },
            { label: "API validates Keycloak OIDC token", enforced: true },
            { label: "RBAC check on /findings/escalate", enforced: true },
            { label: "Token claims verified on write", enforced: true },
          ]}
          verdict="Rejected"
          verdictDetail="API returns 403 Forbidden. Keycloak token accepted but role claim 'inspector' does not satisfy 'safety_manager' requirement."
        />
      </div>
    </div>
  );
}
