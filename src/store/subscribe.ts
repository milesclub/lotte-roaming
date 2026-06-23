import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MvnoApplicant, MvnoOptions, PayMethod, PortType } from '../lib/mvno'
import { getPlan } from '../lib/mvno'
import type { SimType } from '../lib/types'

// MVNO sign-up funnel state, mirrored to sessionStorage so a refresh mid-flow
// keeps the user's choices (same pattern as the roaming application store).

const emptyApplicant: MvnoApplicant = {
  name: '',
  birth: '',
  phone: '',
  currentCarrier: '',
  email: '',
  address: '',
  payMethod: 'card',
}

function defaultOptions(): MvnoOptions {
  return { simType: 'usim', portType: 'port', receiveMethod: 'delivery' }
}

interface SubscribeState {
  planId: string | null
  options: MvnoOptions
  applicant: MvnoApplicant
  agreedConfirm: boolean
  selectPlan: (id: string) => void
  setSimType: (s: SimType) => void
  setPortType: (p: PortType) => void
  setPayMethod: (m: PayMethod) => void
  patchApplicant: (patch: Partial<MvnoApplicant>) => void
  setAgreedConfirm: (v: boolean) => void
  reset: () => void
}

export const useSubscribe = create<SubscribeState>()(
  persist(
    (set) => ({
      planId: null,
      options: defaultOptions(),
      applicant: { ...emptyApplicant },
      agreedConfirm: false,
      selectPlan: (id) => {
        if (!getPlan(id)) return
        set({ planId: id })
      },
      setSimType: (simType) =>
        set((st) => ({
          options: {
            ...st.options,
            simType,
            receiveMethod: simType === 'esim' ? 'esim_qr' : 'delivery',
          },
        })),
      setPortType: (portType) => set((st) => ({ options: { ...st.options, portType } })),
      setPayMethod: (payMethod) => set((st) => ({ applicant: { ...st.applicant, payMethod } })),
      patchApplicant: (patch) => set((st) => ({ applicant: { ...st.applicant, ...patch } })),
      setAgreedConfirm: (agreedConfirm) => set({ agreedConfirm }),
      reset: () =>
        set({
          planId: null,
          options: defaultOptions(),
          applicant: { ...emptyApplicant },
          agreedConfirm: false,
        }),
    }),
    { name: 'lr.subscribe', storage: createJSONStorage(() => sessionStorage) },
  ),
)
