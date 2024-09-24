import { useState } from "react";
import FormButton from "../components/auth/FormButton";
import FormCard from "../components/auth/FormCard";
import { uploadImageAndGetUrl } from "../firebase/storage";
import { useAuth } from "../contexts/authContext";
import { formatDate } from "../utils";
import { pages } from "../constants";
import { Link } from "react-router-dom";

const UploadPhoto = () => {
  const { userData, userLoggedIn, loading, error } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSuccess, setUploadedSuccess] = useState(false);
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();

  function handleChange(e) {
    console.log(e.target.files);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  async function handleImageSubmit() {
    if (file !== null) {
      setIsUploading(true);
      const formattedDate = formatDate(new Date());
      try {
        await uploadImageAndGetUrl(
          file,
          `${userData.name.replace(" ", "-")}_${Date.now()}`,
          null,
          null,
          formattedDate
        );
        setUploadedSuccess(true);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
      }
      setIsUploading(false);
    }
  }

  return (
    <FormCard>
      <div className="text-center">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {userLoggedIn ? (
          <>
            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl mb-6">
              Selecteaza imaginea
            </h3>
            <input type="file" onChange={handleChange} />
            <img src={filePreview} className="max-w-24 my-6" />
            {uploadedSuccess ? (
              <div>
                <p>Imaginea a fost încărcată cu succes!</p>
                <FormButton
                  action="next"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Încarcă alta
                </FormButton>
              </div>
            ) : isUploading ? (
              <FormButton disabled>Se încarcă...</FormButton>
            ) : file ? (
              <FormButton action="submit" onClick={handleImageSubmit}>
                Încarcă imaginea
              </FormButton>
            ) : (
              <FormButton disabled>Încarcă imaginea</FormButton>
            )}
          </>
        ) : (
          <>
            <p>Loghează-te pentru a încărca o imagine.</p>
            <FormButton
              action="next"
              onClick={() => {
                window.location.href = `${
                  pages.login
                }?origin=${pages.uploadPhoto.replace("/", "")}`;
              }}
              extraStyles="mt-4"
            >
              Loghează-te
            </FormButton>
            <div className="text-right text-sm mt-4">
              <Link
                to={`${pages.resetPassword}?origin=${pages.uploadPhoto.replace(
                  "/",
                  ""
                )}`}
                className="hover:underline font-bold text-hope-darkcyan"
              >
                Am uitat parola
              </Link>
            </div>
          </>
        )}
      </div>
    </FormCard>
  );
};

export default UploadPhoto;
