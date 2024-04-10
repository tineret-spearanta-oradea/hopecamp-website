//TODO: rename this file to MultiFormStep.jsx
import React, { useState } from "react";
import Step from "./Step";

const MultiStepForm = ({ handleSubmit, formData, setFormData }) => {
  const [step, setStep] = useState(1);

  const [agreementChecked, setAgreementChecked] = useState(false); // Define the agreementChecked state

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [objectName]: {
        ...prevData[objectName],
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (validateFields()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleAgreementChange = (e) => {
    const { checked } = e.target;
    setAgreementChecked(checked);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Here you might want to handle the base64 string for previews or direct uploads
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  //uploading image feauture
  //uploading image feauture
  // const uploadImageToStorage = (file) => {
  //   const storageRef = firebase.storage().ref();
  //   const fileRef = storageRef.child('images/' + file.name);
  //   return fileRef.put(file).then(() => {
  //     return fileRef.getDownloadURL();  // This URL can be saved in your database
  //   });
  // };
  // // Call this function when submitting the form, using the original File object
  // uploadImageToStorage(formData.imageFile).then((downloadURL) => {
  //   console.log("Uploaded and got URL:", downloadURL);
  // });

  // const handleSubmit = () => {
  // e.preventDefault();
  // if (validateFields()) {
  //   await doCreateUserWithEmailAndPassword(
  //     formData.email,
  //     formData.password
  //   );
  //   console.log("Form submitted:", formData);
  //  }
  // };

  const validateFields = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Adresa de email este necesară.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Adresa de email este invalidă.";
    }

    if (!formData.password) {
      newErrors.password = "Parola este necesară.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Parola trebuie să aibă cel puțin 8 caractere.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Parolele nu se potrivesc.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {step === 1 && (
        <Step
          stepNumber={1}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          errors={errors}
        />
      )}
      {step === 2 && (
        <Step
          stepNumber={2}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleImageChange={handleImageChange}
        />
      )}
      {step === 3 && (
        <Step
          stepNumber={3}
          formData={formData}
          handlePrev={handlePrev}
          handleSubmit={handleSubmit}
          agreementChecked={agreementChecked}
          handleAgreementChange={handleAgreementChange}
        />
      )}
    </div>
  );
};

export default MultiStepForm;
