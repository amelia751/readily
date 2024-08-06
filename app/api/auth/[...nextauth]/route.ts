import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from "@/models/User";
import connect from "@/utils/db";
import { User as UserType } from '@/types/User'; 

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserType['role']; 
    };
  }

  interface User {
    role?: UserType['role']; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserType['role']; 
  }
}

// Configuration options for NextAuth
const authOptions: NextAuthOptions = {
  providers: [
    // Configure Google as an authentication provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!, // Google client ID from environment variables
      clientSecret: process.env.GOOGLE_SECRET!, // Google client secret from environment variables
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Secret used for signing tokens
  callbacks: {
    // Callback to handle user sign in
    async signIn({ user, account }) {
      if (account?.provider === "google") { 
        await connect(); 
        try {
          const existingUser = await User.findOne({ email: user.email }); // Find user in the database by email
          if (!existingUser) { // If user doesn't exist, create a new user
            const newUser = new User({
              email: user.email,
              role: 'user', // Assign default role as 'user'
            });

            await newUser.save(); // Save the new user to the database
          }
          return true; // Sign in successful
        } catch (err) {
          console.log("Error saving user", err); 
          return false; 
        }
      }
      return false; 
    },
    // Callback to handle JWT token
    async jwt({ token, user }) {
      if (user) { // If user exists
        await connect(); // Connect to the database
        const dbUser = await User.findOne({ email: user.email }); // Find user in the database by email
        if (dbUser) {
          token.role = dbUser.role; // Assign user's role from the database to the token
        }
      }
      return token; 
    },
    // Callback to handle session
    async session({ session, token }) {
      if (token) { // If token exists
        session.user = session.user || {}; // Initialize session user if not already initialized
        session.user.role = token.role; // Assign user's role from the token to the session
      }
      return session; // Return the session
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
