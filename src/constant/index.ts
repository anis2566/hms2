export const AUTH_COOKIE = "access-token"

export enum ROLE {
  ADMIN = "ADMIN",
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
}

export enum STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
