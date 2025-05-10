"use client";

import { contactInfo, title } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center mt-10">
          Politica de Confidențialitate
        </h1>
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Cine Suntem</h2>
            <p>
              Acest site web este administrat de Biserica Speranța Oradea, cu
              sediul în Oradea, România. Acționăm în calitate de Operator de
              Date în conformitate cu Regulamentul General privind Protecția
              Datelor (GDPR).
            </p>
            <p className="mt-2">
              Pentru orice întrebări legate de confidențialitate, vă rugăm să ne
              contactați la:
              <br />
              📧 {contactInfo.email}
              <br />
              📞 {contactInfo.phone}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Ce Date Colectăm</h2>
            <p>La înscrierea în tabără, colectăm următoarele date personale:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Numele complet</li>
              <li>Vârsta</li>
              <li>Numărul de telefon</li>
              <li>Afilierea bisericească</li>
              <li>Fotografie de profil (opțional)</li>
              <li>Preferințe de transport</li>
              <li>Preferințe pentru activități</li>
              <li>
                Informații tehnice (de ex., dispozitiv, tip de browser, adresă
                IP — colectate automat)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. De Ce Colectăm Aceste Date
            </h2>
            <p>Colectăm și procesăm aceste date pentru:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Înregistrarea și gestionarea participării la tabără</li>
              <li>Identificarea participanților</li>
              <li>
                Asigurarea siguranței și îngrijirii adecvate în timpul taberei
              </li>
              <li>
                Contactarea dumneavoastră (sau a tutorelui) dacă este necesar
              </li>
              <li>Organizarea transportului și a activităților</li>
              <li>
                Respectarea obligațiilor legale (în special pentru minori)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Baza Legală pentru Procesare
            </h2>
            <p>
              În conformitate cu GDPR, ne bazăm pe următoarele temeiuri legale:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Consimțământ – pentru colectarea și stocarea fotografiilor și a
                oricăror informații opționale
              </li>
              <li>Necesitate contractuală – pentru procesarea înregistrării</li>
              <li>Obligație legală – pentru protejarea minorilor</li>
              <li>
                Interes legitim – pentru a asigura desfășurarea în bune condiții
                și siguranța evenimentului
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Consimțământul Părinților
            </h2>
            <p>
              Dacă participantul are sub 16 ani, solicităm consimțământul unui
              părinte sau tutore legal înainte de a colecta și procesa date
              personale. Acest lucru poate implica confirmarea consimțământului
              prin intermediul unei căsuțe de bifat sau a unui formular semnat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Unde și Cum Sunt Stocate Datele Dumneavoastră
            </h2>
            <p>
              Datele dumneavoastră sunt stocate în siguranță pe platforma
              Supabase, găzduită în Uniunea Europeană (UE). De asemenea, folosim
              Vercel pentru a găzdui aplicația noastră frontend.
            </p>
            <p className="mt-2">
              Aplicăm măsuri tehnice și organizaționale adecvate pentru a vă
              proteja datele, inclusiv:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>HTTPS (transmisie de date criptată)</li>
              <li>Control de acces bazat pe roluri</li>
              <li>
                Stocare criptată (acolo unde este suportată de instrumentele
                terțe)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. Cât Timp Păstrăm Datele Dumneavoastră
            </h2>
            <p>
              Păstrăm datele dumneavoastră doar atât timp cât este necesar
              pentru administrarea taberei și conformitatea legală. În mod
              tipic:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Datele personale vor fi păstrate până la sfârșitul taberei + 1
                an
              </li>
              <li>
                Fotografiile pot fi șterse mai devreme dacă nu mai sunt necesare
              </li>
              <li>
                Puteți solicita ștergerea mai devreme (vezi secțiunea de mai
                jos)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Cine Are Acces la Datele Dumneavoastră
            </h2>
            <p>
              Doar personalul autorizat al bisericii și organizatorii taberei de
              tineret au acces la datele dumneavoastră personale. Nu vindem, nu
              închiriem și nu partajăm datele dumneavoastră cu nicio organizație
              externă.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Procesatori Terți</h2>
            <p>Folosim servicii de încredere pentru a alimenta site-ul web:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Supabase – bază de date, autentificare și stocare de fișiere
                (găzduită în UE)
              </li>
              <li>
                Vercel – găzduire frontend (poate procesa IP-uri și jurnale)
              </li>
            </ul>
            <p className="mt-2">
              Acești furnizori sunt procesatori de date în conformitate cu GDPR
              și sunt obligați să vă protejeze datele.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              10. Drepturile Dumneavoastră
            </h2>
            <p>În conformitate cu GDPR, aveți dreptul să:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Accesați datele dumneavoastră</li>
              <li>Corectați datele inexacte</li>
              <li>
                Solicitați ștergerea (&ldquo;dreptul de a fi uitat&rdquo;)
              </li>
              <li>Retrageți consimțământul în orice moment</li>
              <li>Obiectați la prelucrare, unde este cazul</li>
              <li>
                Depuneți o plângere la autoritatea română pentru protecția
                datelor (ANSPDCP)
              </li>
            </ul>
            <p className="mt-2">
              Pentru a exercita aceste drepturi, trimiteți-ne un e-mail la{" "}
              {contactInfo.email}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              11. Modificări ale Acestei Politici
            </h2>
            <p>
              Putem actualiza această politică după cum este necesar. Dacă facem
              modificări importante, vă vom notifica pe site înainte ca acestea
              să intre în vigoare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contactați-ne</h2>
            <p>
              Pentru întrebări sau nelămuriri, contactați-ne la:
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
