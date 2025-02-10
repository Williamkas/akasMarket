export interface UserMetadata {
  name?: string;
  lastname?: string;
}

export interface User {
  id: string;
  email: string;
  metadata?: UserMetadata;
}
