class UserData {
  constructor(
    uid = null,
    email,
    name,
    phone,
    imageUrl,
    amountPaid = 0,
    payTaxTo,
    age,
    church,
    transport,
    startDate,
    endDate,
    isAdmin = false,
    isConfirmed = false,
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
    this.preferences = preferences;
    this.signupDate = signupDate;
  }
}

export default UserData;
