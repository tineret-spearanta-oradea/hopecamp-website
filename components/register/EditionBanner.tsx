import { Edition } from "@/types/edition";
import { Button } from "../ui/button";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface EditionBannerProps {
  edition: Edition;
  isReturningUser: boolean;
  phoneNumber?: string;
}

export default function EditionBanner({
  edition,
  isReturningUser,
  phoneNumber,
}: EditionBannerProps) {
  const handleLogout = async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      toast.error("Eroare la deconectare");
    } else {
      toast.success("Te-ai deconectat cu succes!");
      window.location.href = "/";
    }
  };

  return (
    <div className="text-hope-darkcyan  rounded-2xl p-4 shadow-lg">
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h2 className="text-xl font-semibold">{edition.title || edition.name}</h2>

        {/* Phone and Logout - only show if returning user */}
        {isReturningUser && phoneNumber && (
          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-90">
              Autentificat cu numărul <span className="font-medium">{phoneNumber}</span>.
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={handleLogout}
              className="text-hope-darkcyan hover:bg-hope-darkcyan/20 h-auto p-1"
            >
              Log out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
