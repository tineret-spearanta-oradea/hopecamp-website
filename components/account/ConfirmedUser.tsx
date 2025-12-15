"use client";

import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";
import Link from "next/link";
import {differenceInHours, format} from "date-fns";
import {CheckCircle2, Circle, AlertCircle, CreditCard} from "lucide-react";
import {getLastUserMessage, insertMessage} from "@/lib/supabase/database/message";
import {getCurrentDebtForRegistration} from "@/lib/supabase/database/marketTransaction";
import {formatAmount} from "@/types/marketTransaction";
import {RegistrationWithProfile} from "@/types/registrationWithProfile";
import {Edition} from "@/types/edition";
import RegistrationDetailsCard from "./RegistrationDetailsCard";
import RegistrationHistory from "./RegistrationHistory";

type ConfirmedUserProps = {
    userRegistrationData: RegistrationWithProfile;
    edition: Edition;
};

const MESSAGE_COOLDOWN_HOURS = 24;

export default function ConfirmedUser({userRegistrationData, edition}: ConfirmedUserProps) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
    const [lastMessageText, setLastMessageText] = useState<string | null>(null);
    const [lastMessageIsRead, setLastMessageIsRead] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDebt, setCurrentDebt] = useState<number | null>(null);
    const [debtLoading, setDebtLoading] = useState(true);
    const {toast} = useToast();

    // Fetch last message time on component mount
    useEffect(() => {
        async function fetchLastMessageTime() {
            try {
                // Use the userId prop here
                const lastUserMessage = await getLastUserMessage(userRegistrationData.id);
                if (lastUserMessage) {
                    setLastMessageTime(lastUserMessage.sentDate);
                    setLastMessageText(lastUserMessage.text);
                    setLastMessageIsRead(lastUserMessage.isRead);
                }
            } catch (error) {
                console.error("Error fetching last message time:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLastMessageTime();
        // Depend on userId prop
    }, [userRegistrationData.id]);

    // Fetch current debt on component mount
    useEffect(() => {
        async function fetchCurrentDebt() {
            try {
                const debt = await getCurrentDebtForRegistration(userRegistrationData.id);
                setCurrentDebt(debt);
            } catch (error) {
                console.error("Error fetching current debt:", error);
                setCurrentDebt(null);
            } finally {
                setDebtLoading(false);
            }
        }

        fetchCurrentDebt();
    }, [userRegistrationData.id]);

    const getHoursUntilNextMessage = () => {
        if (!lastMessageTime) return null;

        const now = new Date();
        const hoursDiff = differenceInHours(now, lastMessageTime);

        if (hoursDiff >= MESSAGE_COOLDOWN_HOURS) return null;

        const hoursLeft = MESSAGE_COOLDOWN_HOURS - hoursDiff;
        return Math.max(1, hoursLeft); // Always show at least 1 hour
    };

    const canSendMessage = () => {
        if (!lastMessageTime) return true;
        const hoursLeft = getHoursUntilNextMessage();
        return !hoursLeft;
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast({
                title: "Eroare",
                description: "Mesajul nu poate fi gol",
                variant: "destructive",
            });
            return;
        }

        if (!canSendMessage()) {
            const hoursLeft = getHoursUntilNextMessage();
            toast({
                title: "Nu poți trimite mesaj încă",
                description: `Mai așteaptă ${hoursLeft} ore până să poți trimite alt mesaj.`,
                variant: "destructive",
            });
            return;
        }

        setIsSending(true);
        try {
            // Use the userId prop here
            const insertedMessage = await insertMessage({registrationId: userRegistrationData.id, text: message});
            console.log("Added message", insertedMessage)
            setLastMessageTime(new Date());
            setLastMessageText(message);
            setLastMessageIsRead(false);

            toast({
                title: "Succes",
                description: "Mesajul a fost trimis cu succes",
            });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Eroare",
                description:
                    "Nu am putut trimite mesajul. Te rugăm să încerci din nou.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    const hoursUntilNext = getHoursUntilNextMessage();

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <p>✅ Contul tău este confirmat!</p>
                <p>
                    📝 În curând vei primi mai multe informații despre tabără și următorii
                    pași.
                </p>
            </div>

            {/* Registration Details Card */}
            <RegistrationDetailsCard
                registration={userRegistrationData}
                edition={edition}
            />

            <div className="space-y-4">
                {/* Market Debt Section */}
                <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">Market:</span>
                        </div>
                        {debtLoading ? (
                            <span className="text-sm text-muted-foreground">Se încarcă...</span>
                        ) : currentDebt !== null ? (
                            currentDebt === 0 ? (
                                <span className="text-sm text-green-600 font-medium">Fără datorii</span>
                            ) : currentDebt > 0 ? (
                                <span className="text-sm text-red-600 font-medium">
                                    Datorie: {formatAmount(currentDebt)} RON
                                </span>
                            ) : (
                                <span className="text-sm text-blue-600 font-medium">
                                    Credit: {formatAmount(Math.abs(currentDebt))} RON
                                </span>
                            )
                        ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                    </div>
                </div>

                {/* Show admin link if user is admin (from registration) OR super admin (from profile) */}
                {(userRegistrationData.isAdmin || userRegistrationData.isSuperAdmin) && (
                    <div className="pt-2">
                        <Link href="/admin">
                            <Button variant="outline" className="w-full">
                                Deschide panoul de administrare →
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Ai întrebări? Trimite-ne un mesaj:</h3>
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Se încarcă...</p>
                ) : (
                    <div className="space-y-4">
                        {lastMessageText && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Ultimul tău mesaj:
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {lastMessageIsRead ? (
                                            <div className="flex items-center gap-1 text-emerald-600">
                                                <CheckCircle2 className="h-4 w-4"/>
                                                <span className="text-xs">Citit</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-yellow-600">
                                                <Circle className="h-4 w-4"/>
                                                <span className="text-xs">Necitit</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        value={lastMessageText}
                                        className="min-h-[100px] resize-none bg-muted"
                                        disabled
                                    />
                                    <div className="absolute bottom-2 right-2">
                    <span className="text-xs text-muted-foreground">
                      {lastMessageTime &&
                          format(lastMessageTime, "dd MMM yyyy HH:mm")}
                    </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {hoursUntilNext ? (
                            <p className="text-sm text-muted-foreground">
                                Mai poți trimite un mesaj în {hoursUntilNext}{" "}
                                {hoursUntilNext === 1 ? "oră" : "ore"}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Scrie mesajul tău aici..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={isSending}
                                    className="w-full"
                                >
                                    {isSending ? "Se trimite..." : "Trimite mesaj"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Registration History */}
            <RegistrationHistory
                userId={userRegistrationData.userId}
                currentEditionId={userRegistrationData.editionId}
            />
        </div>
    );
}
