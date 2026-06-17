import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  ApplicantInfo,
  ProductOptions,
  ReceiveMethodOpt,
  TravelDirection,
} from '../lib/domain'
import type { Network, PlanConfig, SimType } from '../lib/types'
import { defaultOptionsFor, getProduct } from '../lib/shop'

// The whole application funnel accumulates here and mirrors to sessionStorage so
// a refresh mid-flow keeps the user's choices.

const emptyApplicant: ApplicantInfo = {
  name: '',
  email: '',
  phone: '',
  travelStart: '',
  travelEnd: '',
  address: '',
}

interface ApplicationState {
  direction: TravelDirection
  destinationCode: string | null
  productId: string | null
  options: ProductOptions | null
  applicant: ApplicantInfo
  agreedConfirm: boolean

  setDirection: (d: TravelDirection) => void
  setDestination: (code: string | null) => void
  // Country-first selection (roaming plans page): Korea → inbound, else outbound.
  selectCountry: (code: string) => void
  selectProduct: (productId: string) => void
  setSimType: (s: SimType) => void
  setPlan: (p: PlanConfig) => void
  setNetwork: (n: Network) => void
  setReceiveMethod: (m: ReceiveMethodOpt) => void
  patchApplicant: (patch: Partial<ApplicantInfo>) => void
  prefillApplicant: (patch: Partial<ApplicantInfo>) => void
  setAgreedConfirm: (v: boolean) => void
  reset: () => void
}

export const useApplication = create<ApplicationState>()(
  persist(
    (set, get) => ({
      direction: 'inbound', // 한국으로 오는 여행객이 기본
      destinationCode: 'KR', // inbound: Korea is the implicit service area
      productId: null,
      options: null,
      applicant: { ...emptyApplicant },
      agreedConfirm: false,

      setDirection: (direction) =>
        set({
          direction,
          // switching direction resets the destination + selected product
          destinationCode: direction === 'inbound' ? 'KR' : null,
          productId: null,
          options: null,
        }),
      setDestination: (destinationCode) => set({ destinationCode }),

      selectCountry: (code) =>
        set({
          direction: code === 'KR' ? 'inbound' : 'outbound',
          destinationCode: code,
          productId: null,
          options: null,
        }),

      selectProduct: (productId) => {
        const product = getProduct(productId)
        if (!product) return
        const prev = get()
        // Reuse existing options only if they still belong to this product.
        const options =
          prev.productId === productId && prev.options ? prev.options : defaultOptionsFor(product)
        // Keep direction consistent with the selected product.
        const direction = product.directions.includes(prev.direction)
          ? prev.direction
          : product.directions[0]
        set({ productId, options, direction })
      },

      setSimType: (simType) =>
        set((s) => {
          if (!s.options) return s
          const prev = s.options.receiveMethod
          const receiveMethod: ReceiveMethodOpt =
            simType === 'esim'
              ? 'esim_qr'
              : prev && prev !== 'esim_qr'
                ? prev
                : 'delivery'
          return { options: { ...s.options, simType, receiveMethod } }
        }),
      setPlan: (plan) => set((s) => (s.options ? { options: { ...s.options, plan } } : s)),
      setNetwork: (network) => set((s) => (s.options ? { options: { ...s.options, network } } : s)),
      setReceiveMethod: (receiveMethod) =>
        set((s) => (s.options ? { options: { ...s.options, receiveMethod } } : s)),

      patchApplicant: (patch) => set((s) => ({ applicant: { ...s.applicant, ...patch } })),
      prefillApplicant: (patch) =>
        set((s) => {
          // only fill empty fields (don't clobber what the user typed)
          const next = { ...s.applicant }
          for (const [k, v] of Object.entries(patch) as [keyof ApplicantInfo, string][]) {
            if (v && !next[k]) next[k] = v
          }
          return { applicant: next }
        }),
      setAgreedConfirm: (agreedConfirm) => set({ agreedConfirm }),

      reset: () =>
        set({
          direction: 'inbound',
          destinationCode: 'KR',
          productId: null,
          options: null,
          applicant: { ...emptyApplicant },
          agreedConfirm: false,
        }),
    }),
    {
      name: 'lr.application',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
