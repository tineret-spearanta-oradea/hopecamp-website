"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

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
      <section className="relative bg-frost-light py-20 sm:py-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Frost radial gradient */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />

          {/* Decorative ice crystals */}
          <div className="absolute top-20 left-[5%] w-3 h-3 bg-cyan-300/30 rotate-45 animate-float-slow" />
          <div className="absolute bottom-32 right-[10%] w-2.5 h-2.5 bg-blue-300/30 rotate-45 animate-drift animation-delay-500" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <span className="text-primary/70 text-sm font-medium tracking-wider uppercase">
                Susținere
              </span>
            </div>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
              Donează pentru Hope Camp
            </h1>
            <p className="font-nunito text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Susține tabăra de tineret prin una din metodele de plată disponibile
            </p>
          </div>

          {/* Payment Methods */}
          <div className="grid gap-6 mb-12">
            {/* Bank Account */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl text-primary mb-1">
                  Cont bancar
                </h3>
                <p className="font-nunito text-sm text-foreground/60">
                  Transferuri bancare prin IBAN
                </p>
              </div>
              <div className="relative">
                <div className="border border-primary/20 rounded-xl p-4 bg-background/50 font-mono text-base relative overflow-hidden flex items-center justify-between">
                  <p className="mr-2 select-all text-foreground">{iban}</p>
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
                <p className="font-nunito text-xs text-foreground/50 mt-2">
                  Click pe cod pentru a-l selecta sau pe iconița de copiere pentru a-l copia
                </p>
              </div>
            </div>

            {/* Revolut */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl text-primary mb-1">
                  Revolut
                </h3>
                <p className="font-nunito text-sm text-foreground/60">
                  Transfer rapid și simplu
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <p className="font-nunito text-foreground/70 mb-3">
                    Poți trimite bani instant prin Revolut utilizând link-ul de mai jos:
                  </p>
                  <a
                    href={revolutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    revolut.me/eugennathan{" "}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div>
                  <Button
                    onClick={() => window.open(revolutLink, "_blank")}
                    className="mt-2 md:mt-0"
                  >
                    Deschide Revolut
                  </Button>
                </div>
              </div>
            </div>

            {/* BT Pay */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl text-primary mb-1">
                  BT Pay
                </h3>
                <p className="font-nunito text-sm text-foreground/60">
                  Transfer către telefon
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <p className="font-nunito text-foreground/70 mb-2">
                    Pentru transfer prin BT Pay, poți trimite către numărul:
                  </p>
                  <p className="font-poppins font-semibold text-lg select-all text-foreground">
                    +40 774 608 791
                  </p>
                  <p className="font-nunito text-sm text-foreground/60 mt-1">
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
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="font-poppins font-bold text-2xl text-primary mb-4">
              Ai întrebări?
            </h2>
            <p className="font-nunito text-foreground/70 mb-6">
              Pentru orice întrebări legate de donații, contactează-ne:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`tel:${contactInfo.phone}`}
                className="glass-card rounded-xl p-4 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <i className="bi bi-telephone-fill text-lg text-green-700"></i>
                </div>
                <span className="font-medium text-foreground">
                  {contactInfo.phone}
                </span>
              </Link>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="glass-card rounded-xl p-4 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                  <i className="bi bi-envelope-fill text-lg text-primary"></i>
                </div>
                <span className="font-medium text-foreground">
                  {contactInfo.email}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
