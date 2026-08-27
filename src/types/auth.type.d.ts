interface ITokenUser {
  userId: string;
  name?: string;
  fullName?: string;
  profileImage: string;
  email: string;
  role: string;
  driverProfile: string;
  country: string;
  iat: number;
  exp: number;
}
