export type UserRole = 'ADMIN' | 'USER' | 'SADMIN';

export interface User {
  user_id: string;
  name: string;
  phno: string;
  email: string;
  role: UserRole;
  connected_users?: string[];
  pending_connections?: string[];
  sent_requests?: string[];
}

export interface ChatMessage {
  id?: string;
  sender_id: string;
  text: string;
  timestamp: string;
}

export interface Session {
  session_id: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accesstoken: string;
  refreshtoken: string;
  phone_required?: boolean;
  profile_required?: boolean;
  pwd_change_required?: boolean;
  role: UserRole;
}

export interface DecodedToken {
  exp: number;
  sub: string; // user_id
  session_id: string;
  type: 'access' | 'refresh';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_role: string;
  created_at: string;
  updated_at: string;
  video_links: string[];
  image_links: string[];
}
