class UserData {
  constructor(
    email,
    name,
    phone,
    payTaxTo,
    age,
    church,
    transport,
    uid = null,
    startDate = null,
    endDate = null,
    amountPaid = 0,
    imageUrl = "",
    isAdmin = false,
    isConfirmed = false,
    withFamilyMember = false,
    preferences = "",
    signupDate = new Date().toISOString().slice(0, 10)
  ) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.imageUrl = imageUrl;
    this.amountPaid = amountPaid;
    this.payTaxTo = payTaxTo;
    this.age = age;
    this.church = church;
    this.transport = transport;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isAdmin = isAdmin;
    this.isConfirmed = isConfirmed;
    this.withFamilyMember = withFamilyMember;
    this.preferences = preferences;
    this.signupDate = signupDate;
  }
}

export default UserData;
