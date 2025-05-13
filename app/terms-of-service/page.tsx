"use client";

import { contactInfo, title } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center mt-10">
          Termeni și Condiții
        </h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <p className="mb-4">
              Organizație: Biserica Speranța Oradea, Oradea, România
            </p>

            <p className="mb-4">
              Vă rugăm să citiți cu atenție acești Termeni și Condiții
              (&ldquo;Termeni&rdquo;) înainte de a utiliza acest site web pentru
              înscrierea la tabăra noastră de tineret. Prin accesarea sau
              utilizarea site-ului, sunteți de acord să respectați acești
              Termeni.
            </p>

            <p className="mb-4">
              Dacă aveți sub 16 ani, trebuie să aveți un părinte sau tutore
              legal care să analizeze și să accepte acești termeni în numele
              dumneavoastră.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Scopul Site-ului</h2>
            <p>
              Acest site web există exclusiv pentru a gestiona înscrierile
              pentru tabăra de vară, organizată de Biserica Speranța Oradea.
              Toate informațiile trimise vor fi utilizate pentru a procesa și
              gestiona participarea la acest eveniment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Eligibilitate</h2>
            <p>Trebuie să fiți:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Un participant la tabăra de tineret, sau</li>
              <li>
                Un părinte/tutore legal care trimite o înscriere în numele unui
                minor
              </li>
            </ul>
            <p className="mt-2">
              Ne rezervăm dreptul de a respinge sau elimina orice înscriere care
              furnizează informații false sau încalcă acești termeni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. Informații Necesare
            </h2>
            <p>Pentru a vă înscrie, va trebui să furnizați:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Numele și datele de contact (de ex., număr de telefon)</li>
              <li>Răspunsuri la întrebările obligatorii din formular</li>
              <li>O fotografie de profil</li>
            </ul>
            <p className="mt-2">
              Confirmați că toate informațiile pe care le trimiteți sunt
              adevărate și exacte. Dacă trimiteți în numele unui minor,
              confirmați că sunteți autorizat să furnizați informațiile acestuia
              și să vă dați consimțământul.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Cont și Comunicare
            </h2>
            <p>
              Folosim autentificarea prin număr de telefon pentru a vă confirma
              identitatea. Sunteți de acord să primiți mesaje SMS sau apeluri
              legate de înscrierea la tabără și comunicare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Consimțământul Părinților pentru Minori
            </h2>
            <p>
              Dacă participantul are sub 16 ani, un părinte sau tutore legal
              trebuie să aprobe înscrierea. Este posibil să contactăm tutorele
              pentru a verifica acest consimțământ.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Utilizarea Fotografiilor
            </h2>
            <p>
              Colectăm fotografii de profil exclusiv în scopuri de identificare
              și administrative în cadrul echipei taberei. Aceste imagini nu vor
              fi publicate sau partajate public prin intermediul acestui site
              web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cod de Conduită</h2>
            <p>Prin înregistrare, sunteți de acord să:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Trimiteți doar conținut veridic, adecvat și neofensator (în
                special fotografii)
              </li>
              <li>
                Utilizați site-ul web doar în scopul pentru care a fost creat
              </li>
              <li>
                Nu utilizați greșit sau nu încercați să compromiteți
                funcționalitatea sau datele site-ului web
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Limitarea Răspunderii
            </h2>
            <p>
              Ne străduim să vă protejăm datele și să asigurăm accesul
              neîntrerupt la site-ul web. Cu toate acestea, nu suntem
              responsabili pentru:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Întreruperi temporare</li>
              <li>
                Acces neautorizat datorat factorilor în afara controlului nostru
              </li>
              <li>
                Probleme tehnice legate de furnizorii noștri de găzduire sau
                autentificare (Vercel și Supabase)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              9. Gestionarea Datelor
            </h2>
            <p>
              Toate datele personale sunt procesate în conformitate cu
              <Link
                href="/privacy-policy"
                className="mx-1 text-blue-600 hover:underline"
              >
                Politica noastră de Confidențialitate
              </Link>
              , care face parte din acești Termeni. Vă rugăm să o citiți cu
              atenție înainte de a trimite înscrierea.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Încetare</h2>
            <p>Ne rezervăm dreptul să:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Refuzăm sau să ștergem înscrierile care încalcă politicile
                noastre
              </li>
              <li>Suspendăm sau întrerupem platforma în orice moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Legea Aplicabilă</h2>
            <p>
              Acești Termeni sunt guvernați de legile României și de
              reglementările aplicabile ale Uniunii Europene privind protecția
              datelor (GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
            <p>
              Pentru orice întrebări despre acești Termeni sau despre înscrierea
              la tabără, vă rugăm să ne contactați la:
              <br />
              📧 {contactInfo.email}
              <br />
              📞 {contactInfo.phone}
              <br />
              📍 Biserica Speranța Oradea
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
