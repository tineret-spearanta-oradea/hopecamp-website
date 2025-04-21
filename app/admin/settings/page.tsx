"use client";

import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/use-users";
import { Check, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

// Helper function to get file extension from mime type
const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };
  return mimeToExt[mimeType] || "jpg";
};

export default function SettingsPage() {
  const { users, fetchUsers } = useUsers();
  const { userData: currentUser } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [hasCopiedNames, setHasCopiedNames] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const copyNamesToClipboard = () => {
    let finalString = "";
    let index = 1;
    for (const name of users
      .filter((user) => !!!user.imageUrl)
      .map((user) => user.name)) {
      finalString += `${index}. ${name}\n`;
      index++;
    }

    navigator.clipboard.writeText(finalString);
    setHasCopiedNames(true);
  };

  const downloadImages = async () => {
    if (!currentUser?.isSuperAdmin) {
      toast.error("Nu ai permisiunea necesară pentru această acțiune");
      return;
    }

    setIsDownloading(true);
    try {
      const usersWithImages = users.filter((user) => user.imageUrl);
      console.log("Users with images:", usersWithImages);

      for (const user of usersWithImages) {
        if (!user.imageUrl) continue;

        try {
          const response = await fetch(user.imageUrl);
          const blob = await response.blob();
          console.log(`Blob type for ${user.name}:`, blob.type);

          // Get extension from blob mime type
          const extension = getExtensionFromMimeType(blob.type);

          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${user.name}_${user.userId}.${extension}`;

          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          setDownloadCount((prevCount) => prevCount + 1);

          // Add a small delay between downloads to prevent browser throttling
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(
            `Failed to download image for user ${user.name}:`,
            error
          );
        }
      }

      setDownloadCount(0);

      toast.success(`Successfully downloaded ${downloadCount} images`);
    } catch (error) {
      console.error("Error downloading images:", error);
      toast.error("Failed to download some images");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4">User Images</h2>
            <div className="flex flex-row gap-4">
              <div className="">
                <p className="text-sm text-muted-foreground mb-4">
                  {isDownloading ? `Downloading ${downloadCount}/` : "Count: "}
                  {users.filter((user) => user.imageUrl).length}
                </p>
                <Button
                  onClick={downloadImages}
                  disabled={isDownloading || !currentUser?.isSuperAdmin}
                  className="w-fit"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading
                    ? "Downloading..."
                    : "Download All User Images"}
                </Button>
                {!currentUser?.isSuperAdmin && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Doar superadminii pot descărca imaginile utilizatorilor.
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilizatori fără imagine:{" "}
                  {users.filter((user) => !user.imageUrl).length}
                </p>
                <Button
                  onClick={copyNamesToClipboard}
                  variant="outline"
                  className="w-fit"
                >
                  {hasCopiedNames ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {hasCopiedNames ? "Copiat!" : "Copiază numele în clipboard"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
