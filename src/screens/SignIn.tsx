import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, ChevronLeft, Mail } from 'lucide-react'
import Container from '../components/site/Container'
import CheckoutLayout from '../components/site/CheckoutLayout'
import SummaryCard from '../components/SummaryCard'
import Checkbox from '../components/Checkbox'
import ProviderButton from '../components/ProviderButton'
import TextField from '../components/ui/TextField'
import Button from '../components/Button'
import { useUI } from '../content'
import { useAuth } from '../store/auth'
import { useApplication } from '../store/application'
import {
  PROVIDER_ORDER,
  startOAuth,
  emailAccountExists,
  type AuthProvider,
} from '../lib/auth'
import { USE_BACKEND, USE_OAUTH_REDIRECT } from '../lib/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Phase = 'choose' | 'email' | 'consent'
type EmailMode = 'enter' | 'signin' | 'signup'

// Sign in / sign up (= L.POINT membership). Social or a detailed email flow.
// Terms consent appears only for a first-time account (sign-up). When entered as
// a purchase gate (?next=/apply/...) it shows the order summary.
export default function SignIn() {
  const UI = useUI()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const inFunnel = !!next && next.startsWith('/apply')

  const signIn = useAuth((s) => s.signIn)
  const signInEmail = useAuth((s) => s.signInEmail)
  const signUpEmail = useAuth((s) => s.signUpEmail)
  const signOut = useAuth((s) => s.signOut)
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const pending = useAuth((s) => s.pendingProvider)
  const app = useApplication()

  const [phase, setPhase] = useState<Phase>('choose')
  const [emailMode, setEmailMode] = useState<EmailMode>('enter')

  // email-flow fields
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState<{ email?: string; name?: string; pw?: string; confirm?: string }>({})

  // consent
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [optPush, setOptPush] = useState(true)
  const [optMarketing, setOptMarketing] = useState(false)
  const [touched, setTouched] = useState(false)

  const connecting = status === 'connecting'
  const finish = () => navigate(next || '/applications')
  const prefill = (u: { name: string; email?: string }) =>
    app.prefillApplicant({ name: u.name, email: u.email ?? '' })

  // ── Social ────────────────────────────────────────────────────────────
  const connect = async (provider: AuthProvider) => {
    if (USE_BACKEND && USE_OAUTH_REDIRECT) {
      startOAuth(provider)
      return
    }
    const u = await signIn(provider)
    prefill(u)
    if (u.isNew) setPhase('consent')
    else finish()
  }

  // ── Email ─────────────────────────────────────────────────────────────
  const openEmail = () => {
    setPhase('email')
    setEmailMode('enter')
    setErr({})
  }

  const emailContinue = () => {
    if (!EMAIL_RE.test(email.trim())) {
      setErr({ email: UI.applicant.invalidEmail })
      return
    }
    setErr({})
    setEmailMode(emailAccountExists(email) ? 'signin' : 'signup')
  }

  const doSignIn = async () => {
    if (!password) {
      setErr({ pw: UI.signin.passwordRequired })
      return
    }
    const u = await signInEmail(email.trim(), password)
    prefill(u)
    finish() // returning member → no consent
  }

  const doSignUp = async () => {
    const e: typeof err = {}
    if (!name.trim()) e.name = UI.signin.nameRequired
    if (password.length < 8) e.pw = UI.signin.pwShort
    if (confirm !== password) e.confirm = UI.signin.pwMismatch
    setErr(e)
    if (Object.keys(e).length) return
    const u = await signUpEmail(email.trim(), name.trim(), password)
    prefill(u)
    setPhase('consent') // new account → terms consent
  }

  // ── Consent (new accounts only) ─────────────────────────────────────────
  const completeSignup = () => {
    if (!agreeTerms) {
      setTouched(true)
      return
    }
    finish()
  }

  const resetEmail = () => {
    setName('')
    setPassword('')
    setConfirm('')
    setErr({})
  }
  const useAnother = () => {
    signOut()
    setPhase('choose')
    setEmailMode('enter')
    setEmail('')
    resetEmail()
    setAgreeTerms(false)
    setTouched(false)
  }

  // ── Bodies ──────────────────────────────────────────────────────────────
  const chooseBody = (
    <>
      <div className="auth-providers">
        {PROVIDER_ORDER.map((p) => (
          <ProviderButton
            key={p}
            provider={p}
            label={UI.signin.providers[p]}
            onClick={() => connect(p)}
            disabled={connecting}
            loading={connecting && pending === p}
          />
        ))}
        <div className="auth-divider">{UI.signin.or}</div>
        <button type="button" className="email-cta" onClick={openEmail} disabled={connecting}>
          <Mail size={18} strokeWidth={2.2} />
          {UI.signin.providers.email}
        </button>
      </div>

      <div className="lpoint-note">
        <Sparkles size={18} className="lpoint-note__icon" strokeWidth={2.2} />
        {UI.signin.lpoint}
      </div>
    </>
  )

  const emailEnter = (
    <>
      <TextField
        label={UI.signin.emailLabel}
        value={email}
        onChange={setEmail}
        placeholder={UI.signin.emailPh}
        type="email"
        inputMode="email"
        error={err.email}
        required
      />
      <Button full className="mt-4" onClick={emailContinue} disabled={connecting}>
        {UI.cta.continue}
      </Button>
      <button type="button" className="auth-link" onClick={() => setPhase('choose')}>
        <ChevronLeft size={15} /> {UI.signin.backToOptions}
      </button>
    </>
  )

  const emailRecap = (
    <div className="email-recap">
      <span className="email-recap__addr">
        <Mail size={15} /> {email.trim()}
      </span>
      <button type="button" className="email-recap__change" onClick={() => setEmailMode('enter')}>
        {UI.signin.changeEmail}
      </button>
    </div>
  )

  const emailSignin = (
    <>
      {emailRecap}
      <TextField
        label={UI.signin.passwordLabel}
        value={password}
        onChange={setPassword}
        placeholder={UI.signin.passwordPh}
        type="password"
        error={err.pw}
        required
      />
      <Button full className="mt-4" onClick={doSignIn} disabled={connecting}>
        {connecting ? '…' : UI.signin.signInBtn}
      </Button>
    </>
  )

  const emailSignup = (
    <>
      {emailRecap}
      <TextField
        label={UI.signin.nameLabel}
        value={name}
        onChange={setName}
        placeholder={UI.signin.namePh}
        error={err.name}
        required
      />
      <TextField
        label={UI.signin.passwordLabel}
        value={password}
        onChange={setPassword}
        placeholder={UI.signin.passwordPh}
        type="password"
        error={err.pw}
        required
      />
      <TextField
        label={UI.signin.confirmLabel}
        value={confirm}
        onChange={setConfirm}
        placeholder={UI.signin.passwordPh}
        type="password"
        error={err.confirm}
        required
      />
      <Button full className="mt-4" onClick={doSignUp} disabled={connecting}>
        {connecting ? '…' : UI.signin.createAccount}
      </Button>
    </>
  )

  const emailBody =
    emailMode === 'enter' ? emailEnter : emailMode === 'signin' ? emailSignin : emailSignup

  const consentBody = (
    <>
      {user && (
        <div className="consent-account">
          <span className="consent-account__avatar" aria-hidden>
            {user.name.charAt(0)}
          </span>
          <span className="consent-account__who">
            <span className="consent-account__name">{user.name}</span>
            {user.email && <span className="consent-account__email">{user.email}</span>}
          </span>
        </div>
      )}

      <div className="consents">
        <Checkbox checked={agreeTerms} onChange={setAgreeTerms} label={UI.signin.terms} />
        <Checkbox checked={optPush} onChange={setOptPush} label={UI.signin.push} />
        <Checkbox checked={optMarketing} onChange={setOptMarketing} label={UI.signin.marketing} />
        {touched && !agreeTerms && <div className="consents__error">{UI.signin.termsRequired}</div>}
      </div>

      <div className="lpoint-note">
        <Sparkles size={18} className="lpoint-note__icon" strokeWidth={2.2} />
        {UI.signin.lpoint}
      </div>

      <Button full className="mt-4" onClick={completeSignup}>
        {UI.signin.agreeContinue}
      </Button>
      <button type="button" className="auth-link" onClick={useAnother}>
        {UI.signin.useAnother}
      </button>
    </>
  )

  // ── Title / body per phase ──────────────────────────────────────────────
  let title = UI.signin.title
  let subtitle: string = UI.signin.subtitle
  let body = chooseBody
  if (phase === 'consent') {
    title = UI.signin.consentTitle
    subtitle = UI.signin.consentSub
    body = consentBody
  } else if (phase === 'email') {
    body = emailBody
    if (emailMode === 'enter') {
      title = UI.signin.emailStepTitle
      subtitle = UI.signin.emailStepSub
    } else if (emailMode === 'signin') {
      title = UI.signin.signinStepTitle
      subtitle = UI.signin.signinStepSub
    } else {
      title = UI.signin.signupStepTitle
      subtitle = UI.signin.signupStepSub
    }
  }

  if (inFunnel) {
    return (
      <CheckoutLayout
        title={title}
        subtitle={subtitle}
        aside={<SummaryCard productId={app.productId} options={app.options} />}
      >
        {body}
      </CheckoutLayout>
    )
  }

  return (
    <Container size="narrow" className="page-pad">
      <div className="auth-standalone">
        <h1 className="auth-standalone__title">{title}</h1>
        <p className="auth-standalone__sub">{subtitle}</p>
        {body}
      </div>
    </Container>
  )
}
