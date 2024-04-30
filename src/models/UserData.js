import { transportOptions } from "./Options";
import { churchOptions } from "./Options";
import { payTaxToOptions } from "./Options";
import { dateRange } from "./Options";

const retrieveDefaultOption = (options) => {
  const defaultOption = options.find((option) => option.isDefault);
  return defaultOption ? defaultOption.value : undefined;
};

class UserData {
  constructor(
    email,
    name,
    phone,
    age,
    payTaxTo = retrieveDefaultOption(payTaxToOptions),
    church = retrieveDefaultOption(churchOptions),
    transport = retrieveDefaultOption(transportOptions),
    uid = null,
    startDate = dateRange.startDate,
    endDate = dateRange.endDate,
    amountPaid = 0,
    imageUrl = "",
    isSuperAdmin = false,
    isAdmin = false,
    isConfirmed = false,
    withFamilyMember = false,
    preferences = "",
    signupDate = new Date()
  ) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.age = age;
    this.imageUrl = imageUrl;
    this.amountPaid = amountPaid;
    this.payTaxTo = payTaxTo;
    this.church = church;
    this.transport = transport;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isSuperAdmin = isSuperAdmin;
    this.isAdmin = isAdmin;
    this.isConfirmed = isConfirmed;
    this.withFamilyMember = withFamilyMember;
    this.preferences = preferences;
    this.signupDate = signupDate;
  }
}

export default UserData;
