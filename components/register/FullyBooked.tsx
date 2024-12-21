import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function FullyBooked() {
  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-hope-orange">Ne pare rău</h1>
          <p className="text-lg">
            Locurile din tabără au fost ocupate!
            <br />
            Vestea bună e că ne poți vizita pe timp de zi!
          </p>
          <Link href="/">
            <Button>Înapoi la pagina principală</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
