class UserData {
  constructor(
    uid = null,
    email,
    password,
    confirmPassword,
    name,
    phone,
    imageUrl
  ) {
    this.uid = uid;
    this.email = email;
    this.password = password;
    this.name = name;
    this.phone = phone;
    this.imageUrl = imageUrl;
    this.confirmPassword = confirmPassword;
  }
}

export default UserData;
