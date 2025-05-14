import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { contactInfo } from "@/lib/constants";

export default function FullyBooked() {
  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-hope-orange">Ne pare rău</h1>
          <p>
            <h2 className="text-2xl font-bold text-gray-800">
              Locurile din tabără au fost ocupate!
            </h2>
            <br />
            <ul className="list-disc list-inside">
              <li className="mt-2">
                Dacă dorești ne poți contacta la{" "}
                <a
                  className="text-blue-500 hover:underline"
                  href={contactInfo.whatsapp}
                >
                  {contactInfo.phone}
                </a>{" "}
                pentru a te pune pe lista de așteptare
              </li>
              <li className="mb-4">
                Sau ne poti vizita pe timp de zi fără a te înscrie! (se va
                percepe o taxă)
              </li>
            </ul>
          </p>
          <Link className="mt-8" href="/">
            <Button>Înapoi la pagina principală</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
