import NextAuth, { type NextAuthConfig, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import crypto from 'crypto';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
  interface User {
    id: string;
    username: string;
    role: string;
  }
}

function hashPassword(password: string): string {
  // Using a fixed salt for consistency
  const FIXED_SALT = 'trek-mapper-salt';
  return crypto.createHash('sha256').update(password + FIXED_SALT).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Define authorized users (in production, query from database)
const AUTHORIZED_USERS = {
  admin: {
    id: 'admin-1',
    username: 'admin',
    role: 'admin',
    passwordHash: 'e4ae6e8363fce7076f69cdce2a655516c0a22f89008027633c6e2001cb1b3c37', // admin123! with salt 'trek-mapper-salt'
  },
  agency: {
    id: 'agency-1',
    username: 'agency',
    role: 'agency',
    passwordHash: '1f41d8716d4964201737e48c2a318ed9902d9e1fb0bf92c7c17582f5e28b98d4', // agency123! with salt 'trek-mapper-salt'
  },
};

const credentialsSchema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
});

const config = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production',
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const parsed = credentialsSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error('Validation error:', parsed.error);
            return null;
          }

          const { username, password } = parsed.data;

          // Find user
          const user = AUTHORIZED_USERS[username as keyof typeof AUTHORIZED_USERS];
          if (!user) {
            console.warn(`Login attempt with unknown username: ${username}`);
            return null;
          }

          // Verify password
          if (!verifyPassword(password, user.passwordHash)) {
            console.warn(`Failed login attempt for user: ${username}`);
            return null;
          }

          // Return user object (never include password)
          return {
            id: user.id,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Add role to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Add role to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Redirect after login
    async redirect({ url, baseUrl }) {
      // Prevent open redirect vulnerability
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.username} (${user.role})`);
    },
    async signOut() {
      console.log('User signed out');
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update every 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // Security: Enable secure cookies in production
  useSecureCookies: process.env.NODE_ENV === 'production',
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
