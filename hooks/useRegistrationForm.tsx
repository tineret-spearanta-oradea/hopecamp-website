import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateAuthFields, validateUserFields } from "@/utils/validation";
import { dateRange, payTaxToOptions, transportOptions, churchOptions } from "@/lib/constants";
import { createUserAccount } from "@/lib/firebase/auth";
import { createUserDocument } from "@/lib/firebase/firestore";
import { toast } from "@/hooks/use-toast";

const initialFormData: FormData = {
  authData: {
    email: "",
    password: "",
    confirmPassword: "",
  },
  userData: {
    name: "",
    age: "",
    phone: "",
    church: churchOptions[0].value,
    payTaxTo: payTaxToOptions[0].value,
    transport: transportOptions[0].value,
    preferences: "",
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    imageUrl: "",
    slopeActivity: "no",
  },
};

    imageUrl: "",
    slopeActivity: "",
  },
};
