import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  auth,
  fetchMe,
  mockEmailSignIn,
  mockEmailSignUp,
  type AuthProvider,
  type AuthUser,
} from '../lib/auth'

// Holds the signed-in user (= L.POINT member). Persisted to localStorage so the
// session survives reloads. `connecting` drives the provider redirect overlay.

interface AuthState {
  user: AuthUser | null
  status: 'idle' | 'connecting'
  pendingProvider: AuthProvider | null
  signIn: (provider: AuthProvider) => Promise<AuthUser>
  signInEmail: (email: string, password: string) => Promise<AuthUser>
  signUpEmail: (email: string, name: string, password: string) => Promise<AuthUser>
  signOut: () => void
  /** Hydrate from the BFF session cookie after an OAuth redirect returns. */
  hydrate: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: 'idle',
      pendingProvider: null,
      signIn: async (provider) => {
        set({ status: 'connecting', pendingProvider: provider })
        try {
          const user = await auth.signIn(provider)
          set({ user, status: 'idle', pendingProvider: null })
          return user
        } catch (e) {
          set({ status: 'idle', pendingProvider: null })
          throw e
        }
      },
      signInEmail: async (email, _password) => {
        set({ status: 'connecting', pendingProvider: 'email' })
        try {
          const user = await mockEmailSignIn(email)
          set({ user, status: 'idle', pendingProvider: null })
          return user
        } catch (e) {
          set({ status: 'idle', pendingProvider: null })
          throw e
        }
      },
      signUpEmail: async (email, name, _password) => {
        set({ status: 'connecting', pendingProvider: 'email' })
        try {
          const user = await mockEmailSignUp(email, name)
          set({ user, status: 'idle', pendingProvider: null })
          return user
        } catch (e) {
          set({ status: 'idle', pendingProvider: null })
          throw e
        }
      },
      signOut: () => set({ user: null, status: 'idle', pendingProvider: null }),
      hydrate: async () => {
        const user = await fetchMe()
        if (user) set({ user })
      },
    }),
    {
      name: 'lr.auth',
      storage: createJSONStorage(() => localStorage),
      // never persist a transient connecting state
      partialize: (s) => ({ user: s.user }),
      // Start every session logged out: bump the version to drop any stale
      // persisted mock session from earlier testing.
      version: 1,
      migrate: () => ({ user: null }) as Partial<AuthState>,
    },
  ),
)
