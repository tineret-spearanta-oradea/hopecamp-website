"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contactInfo } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

export default function DonatiiPage() {
  const [ibanCopied, setIbanCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const iban = "RO54 REVO 0000 1833 4541 2857";
  const revolutLink = "https://revolut.me/eugennathan";

  const copyToClipboard = (text: string, isPhone = false) => {
    navigator.clipboard.writeText(text);

    if (isPhone) {
      setPhoneCopied(true);
      setTimeout(() => {
        setPhoneCopied(false);
      }, 2000);
    } else {
      setIbanCopied(true);
      setTimeout(() => {
        setIbanCopied(false);
      }, 2000);
    }

    toast({
      title: "Copiat!",
      description: "Textul a fost copiat în clipboard.",
    });
  };

  return (
    <>
      <Navbar />
      <section className="lg:py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto py-16 px-4 md:px-6 max-w-4xl ">
          <h1 className="text-4xl font-bold text-center mb-6">
            Donează pentru Hope Camp
          </h1>
          <p className="text-lg text-center mb-10 text-muted-foreground">
            Susține tabăra de tineret prin una din metodele de plată disponibile
          </p>

          <div className="grid gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle>Cont bancar</CardTitle>
                <CardDescription>Transferuri bancare prin IBAN</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-6">
                  <div className="relative">
                    <div className="border rounded-lg p-4 bg-muted/30 font-mono text-base relative overflow-hidden flex items-center justify-between">
                      <p className="mr-2 select-all">{iban}</p>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(iban)}
                        className="shrink-0"
                      >
                        {ibanCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click pe cod pentru a-l selecta sau pe iconița de copiere
                      pentru a-l copia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle>Revolut</CardTitle>
                <CardDescription>Transfer rapid și simplu</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <p className="mb-3">
                      Poți trimite bani instant prin Revolut utilizând link-ul
                      de mai jos:
                    </p>
                    <a
                      href={revolutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      revolut.me/eugennathan{" "}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div>
                    <Button
                      className="mt-2 md:mt-0"
                      onClick={() => window.open(revolutLink, "_blank")}
                    >
                      Deschide Revolut
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle>BT Pay</CardTitle>
                <CardDescription>Transfer către telefon</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <p className="mb-2">
                      Pentru transfer prin BT Pay, poți trimite către numărul:
                    </p>
                    <p className="font-medium text-lg select-all">
                      +40 774 608 791
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Denisa Șandor
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard("+40 774 608 791", true)}
                      className="mt-2 md:mt-0"
                    >
                      {phoneCopied ? (
                        <>
                          Copiat <Check className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>Copiază numărul</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Ai întrebări?</h2>
            <p className="mb-6">
              Pentru orice întrebări legate de donații, contactează-ne:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-card-foreground text-card hover:bg-primary/90"
              >
                Telefon: {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-card-foreground text-card hover:bg-primary/90"
              >
                Email: {contactInfo.email}
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}
