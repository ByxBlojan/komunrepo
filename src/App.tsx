import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { AppSidebar, type Page } from "@/components/AppSidebar";
import { LoginPage } from "@/components/LoginPage";
import { HandelsplatsPage } from "@/components/HandelsplatsPage";
import { ObjektPage } from "@/components/ObjektPage";
import { RegistreraPage } from "@/components/RegistreraPage";
import { MinaInventarierPage } from "@/components/MinaInventarierPage";
import { ForfragningarPage } from "@/components/ForfragningarPage";
import { SkannaPage } from "@/components/SkannaPage";
import { SaFungerarDetPage } from "@/components/SaFungerarDetPage";
import { Vallista } from "@/components/ui/primitiver";
import { useKommunCirkular } from "@/lib/state";

function lasObjektIdFranHash(): string | null {
  const traff = window.location.hash.match(/^#\/objekt\/(.+)$/);
  return traff ? decodeURIComponent(traff[1]) : null;
}

export default function App() {
  const state = useKommunCirkular();
  const [sida, setSida] = useState<Page>("handelsplats");
  const [objektId, setObjektId] = useState<string | null>(null);

  const oppnaObjekt = useCallback((id: string) => {
    setObjektId(id);
    setSida("objekt");
    window.location.hash = `#/objekt/${id}`;
  }, []);

  const navigera = useCallback((ny: Page) => {
    setSida(ny);
    setObjektId(null);
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const fran = lasObjektIdFranHash();
    if (fran) {
      setObjektId(fran);
      setSida("objekt");
    }

    const vidHashByte = () => {
      const id = lasObjektIdFranHash();
      if (id) {
        setObjektId(id);
        setSida("objekt");
      }
    };

    window.addEventListener("hashchange", vidHashByte);
    return () => window.removeEventListener("hashchange", vidHashByte);
  }, []);

  if (!state.arInloggad) {
    return (
      <LoginPage
        onInloggad={(anvandare) => {
          state.loggaIn(anvandare);
          setSida("sa-fungerar-det");
        }}
      />
    );
  }

  return (
    <div className="flex h-full">
      <AppSidebar aktivSida={sida} onNavigera={navigera} antalAttGodkanna={state.antalAttGodkanna} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-white px-6 py-2.5">
          <p className="text-[13px] text-slate-500">
            Demoläge — byt identitet för att se båda sidor av ett övertagande
          </p>

          <div className="flex items-center gap-3">
            <Vallista
              aria-label="Inloggad som"
              value={state.aktivAnvandare?.id ?? ""}
              onChange={(e) => {
                const ny = state.anvandare.find((a) => a.id === e.target.value);
                if (ny) state.loggaIn(ny);
              }}
              className="w-[280px]"
            >
              {state.anvandare.map((a) => {
                const avdelning = state.avdelningar.find((av) => av.id === a.avdelningId);
                return (
                  <option key={a.id} value={a.id}>
                    {a.namn} — {avdelning?.namn}
                  </option>
                );
              })}
            </Vallista>

            <button
              onClick={() => {
                state.loggaUt();
                navigera("handelsplats");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={15} />
              Logga ut
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {sida === "sa-fungerar-det" && (
            <SaFungerarDetPage onTillHandelsplats={() => navigera("handelsplats")} />
          )}

          {sida === "handelsplats" && <HandelsplatsPage state={state} onOppnaObjekt={oppnaObjekt} />}

          {sida === "objekt" && (
            <ObjektPage state={state} objektId={objektId} onTillbaka={() => navigera("handelsplats")} />
          )}

          {sida === "registrera" && <RegistreraPage state={state} onOppnaObjekt={oppnaObjekt} />}

          {sida === "mina" && (
            <MinaInventarierPage
              state={state}
              onOppnaObjekt={oppnaObjekt}
              onRegistrera={() => navigera("registrera")}
            />
          )}

          {sida === "forfragningar" && <ForfragningarPage state={state} onOppnaObjekt={oppnaObjekt} />}

          {sida === "skanna" && <SkannaPage state={state} onOppnaObjekt={oppnaObjekt} />}
        </main>
      </div>
    </div>
  );
}
