import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { AppSidebar, type Page } from "@/components/AppSidebar";
import { LoginPage } from "@/components/LoginPage";
import { ValjLagePage } from "@/components/ValjLagePage";
import { HandelsplatsPage } from "@/components/HandelsplatsPage";
import { ObjektPage } from "@/components/ObjektPage";
import { RegistreraPage } from "@/components/RegistreraPage";
import { MinaInventarierPage } from "@/components/MinaInventarierPage";
import { ForfragningarPage } from "@/components/ForfragningarPage";
import { SkannaPage } from "@/components/SkannaPage";
import { SaFungerarDetPage } from "@/components/SaFungerarDetPage";
import { KommandePage } from "@/components/KommandePage";
import { Vallista } from "@/components/ui/primitiver";
import { useKommunCirkular } from "@/lib/state";

function lasObjektIdFranHash(): string | null {
  const traff = window.location.hash.match(/^#\/objekt\/(.+)$/);
  return traff ? decodeURIComponent(traff[1]) : null;
}

export default function App() {
  const state = useKommunCirkular();
  const [sida, setSida] = useState<Page>("valj-lage");
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

  if (!state.arInloggad || !state.aktivAnvandare) {
    return (
      <LoginPage
        onInloggad={(anvandare) => {
          state.loggaIn(anvandare);
          setSida("valj-lage");
        }}
      />
    );
  }

  const anvandartyp = state.aktivAnvandare.typ;

  return (
    <div className="flex h-full">
      <AppSidebar
        aktivSida={sida}
        anvandartyp={anvandartyp}
        onNavigera={navigera}
        antalAttGodkanna={state.antalAttGodkanna}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-white px-6 py-2.5">
          <p className="text-[13px] text-slate-500">
            Demoläge — byt identitet för att se båda sidor av ett övertagande
          </p>

          <div className="flex items-center gap-3">
            <Vallista
              aria-label="Inloggad som"
              value={state.aktivAnvandare.id}
              onChange={(e) => {
                const ny = state.anvandare.find((a) => a.id === e.target.value);
                if (ny) {
                  state.loggaIn(ny);
                  navigera("valj-lage");
                }
              }}
              className="w-[300px]"
            >
              {state.anvandare.map((a) => {
                const avdelning = state.avdelningar.find((av) => av.id === a.avdelningId);
                const under = a.typ === "kommun" ? avdelning?.namn : (a.organisation ?? a.roll);
                return (
                  <option key={a.id} value={a.id}>
                    {a.namn} — {under}
                  </option>
                );
              })}
            </Vallista>

            <button
              onClick={() => {
                state.loggaUt();
                setSida("valj-lage");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={15} />
              Logga ut
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {sida === "valj-lage" && (
            <ValjLagePage
              anvandartyp={anvandartyp}
              namn={state.aktivAnvandare.namn}
              onValj={navigera}
              onSaFungerarDet={() => navigera("sa-fungerar-det")}
            />
          )}

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

          {sida === "leverans" && (
            <KommandePage
              rubrik="Leverans"
              ingress="När ett övertagande är godkänt behöver objektet flyttas. Leveransen bokas i samma flöde, med den utförare som passar uppdragets storlek."
              punkter={[
                "Gig-tjänster som TiptApp för enstaka möbler — ofta samma dag och till låg kostnad",
                "Privatperson med släp eller skåpbil, för hämtningar som inte kräver bärhjälp",
                "Upphandlat transportbolag för större flyttar och tunga lyft",
                "Hämta själv, när verksamheterna ligger nära varandra",
                "Pris och tidsfönster jämförs innan bokning, så valet går att motivera i efterhand",
                "QR-koden skannas vid hämtning och leverans oavsett vem som kör",
              ]}
              fas="Planerad till fas 2. Integration mot externa förmedlingstjänster kräver avtal och beslut om ansvar vid skada."
              onTillbaka={() => navigera("valj-lage")}
            />
          )}

          {sida === "renovera" && (
            <KommandePage
              rubrik="Renovera"
              ingress="Rusta upp slitna inventarier i stället för att kassera dem. Ett renoverat skrivbord kostar en bråkdel av ett nytt."
              punkter={[
                "Beställ omklädsel, lagning eller rekonditionering på ett objekt som redan finns i registret",
                "Välj bland kommunens upphandlade renoveringsleverantörer",
                "Följ status från beställning till återlämning, med samma QR-kod som tidigare",
                "Objektets skick uppdateras automatiskt när renoveringen är klar",
                "Historiken visar vad som gjorts, vad det kostade och vad ett nyinköp hade kostat",
              ]}
              fas="Planerad till fas 2, efter att det interna återbruket är i drift."
              onTillbaka={() => navigera("valj-lage")}
            />
          )}

          {sida === "upphandla" && (
            <KommandePage
              rubrik="Upphandla"
              ingress="För behov som inte kan täckas av det kommunen redan äger. Underlaget bygger på registret, så ett nyinköp föregås alltid av kontrollen att inget befintligt duger."
              punkter={[
                "Skapa ett behov och se direkt om något liknande finns internt",
                "Samla behov från flera verksamheter till en gemensam upphandling",
                "Underlag som visar vad som redan prövats internt — användbart vid revision",
                "Avrop mot ramavtal, med leverans registrerad direkt i inventarieregistret",
                "Uppföljning av hur stor andel av behoven som täcktes med återbruk",
              ]}
              fas="Planerad till fas 2, när fler förvaltningar är anslutna."
              onTillbaka={() => navigera("valj-lage")}
            />
          )}

          {sida === "transportuppdrag" && (
            <KommandePage
              rubrik="Transportuppdrag"
              ingress="Hämtningar och leveranser som kommunen lagt ut på transportbolag."
              punkter={[
                "Se tilldelade uppdrag med hämtnings- och leveransadress",
                "Kontaktpersoner, antal objekt och bärförutsättningar",
                "Skanna objektets QR-kod vid hämtning och vid leverans",
                "Fotografera och rapportera eventuella skador direkt i uppdraget",
                "Statusen syns i realtid för både avlämnande och mottagande verksamhet",
              ]}
              fas="Planerad till fas 2. I fas 1 skapas transportuppdrag som order eller PDF."
              onTillbaka={() => navigera("valj-lage")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
