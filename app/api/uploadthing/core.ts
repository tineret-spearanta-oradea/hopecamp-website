import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "firebase/auth";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // Allow unauthenticated uploads for registration
      return { userId: "registration" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
