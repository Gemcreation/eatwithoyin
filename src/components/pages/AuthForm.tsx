import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/OyinLogo.png'

type AuthMode = 'login' | 'signup'
type Errors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>

interface AuthFormProps {
  mode: AuthMode
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const AuthForm = ({ mode }: AuthFormProps) => {
  const isSignUp = mode === 'signup'
  // Form state remains local only: no credentials are stored or sent anywhere.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  // Passwords are masked by default and only revealed after an explicit action.
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validate = (): Errors => {
    const nextErrors: Errors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) nextErrors.email = 'Please enter your email address.'
    else if (!emailPattern.test(trimmedEmail)) nextErrors.email = 'Please enter a valid email address.'

    if (!password) nextErrors.password = 'Please enter your password.'
    if (isSignUp) {
      if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.'
      else if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    }
    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || isLoading) return

    // UI-only loading feedback. Backend authentication will be added later.
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 900)
  }

  const fieldClass = (hasError: boolean) => `w-full rounded-md border bg-mainColor px-3 py-3 pr-16 text-secondaryColor outline-none transition focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 ${hasError ? 'border-primaryColor' : 'border-slate-300'}`

  return (
    <main className='min-h-[calc(100vh-80px)] bg-[#fff8f7] px-4 py-10 sm:py-14 flex items-center justify-center'>
      <section className='w-full max-w-md rounded-md bg-mainColor p-6 shadow-lg sm:p-9' aria-labelledby='auth-heading'>
        <div className='mx-auto mb-6 flex h-20 w-36 items-center justify-center overflow-hidden'>
          <img src={Logo} alt='Eat With Oyin' className='max-h-full max-w-full object-contain' />
        </div>
        <div className='mb-7 text-center'>
          <h1 id='auth-heading' className='text-3xl font-bold text-secondaryColor'>
            {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
          </h1>
          <p className='mt-2 text-sm leading-6 text-slate-600'>
            {isSignUp ? 'Join Eat With Oyin and enjoy delicious meals made for you.' : 'Sign in to continue to Eat With Oyin.'}
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label htmlFor='email' className='mb-2 block text-sm font-semibold text-secondaryColor'>Email</label>
            <input id='email' type='email' autoComplete='email' value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className={fieldClass(Boolean(errors.email))} />
            {errors.email && <p id='email-error' className='mt-1 text-sm text-primaryColor'>{errors.email}</p>}
          </div>

          <PasswordField id='password' label='Password' value={password} error={errors.password} show={showPassword} onChange={setPassword} onToggle={() => setShowPassword(!showPassword)} autoComplete={isSignUp ? 'new-password' : 'current-password'} />
          {isSignUp && <PasswordField id='confirm-password' label='Confirm Password' value={confirmPassword} error={errors.confirmPassword} show={showConfirmPassword} onChange={setConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} autoComplete='new-password' />}

          <button type='submit' disabled={isLoading} className='h-12 w-full rounded-md bg-primaryColor font-semibold text-mainColor transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'>
            {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-600'>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={isSignUp ? '/login' : '/signup'} className='font-semibold text-primaryColor hover:underline'>
            {isSignUp ? 'Login' : 'Sign Up'}
          </Link>
        </p>
        <p className='mt-5 text-center text-xs leading-5 text-slate-500'>Authentication is currently available as a UI preview. Backend integration will be added later.</p>
      </section>
    </main>
  )
}

interface PasswordFieldProps {
  id: string; label: string; value: string; error?: string; show: boolean
  onChange: (value: string) => void; onToggle: () => void; autoComplete: string
}

const PasswordField = ({ id, label, value, error, show, onChange, onToggle, autoComplete }: PasswordFieldProps) => (
  <div>
    <label htmlFor={id} className='mb-2 block text-sm font-semibold text-secondaryColor'>{label}</label>
    <div className='relative'>
      <input id={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`w-full rounded-md border bg-mainColor px-3 py-3 pr-16 text-secondaryColor outline-none transition focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 ${error ? 'border-primaryColor' : 'border-slate-300'}`} />
      <button type='button' onClick={onToggle} className='absolute inset-y-0 right-3 text-sm font-semibold text-primaryColor hover:underline' aria-label={`${show ? 'Hide' : 'Show'} ${label.toLowerCase()}`}>{show ? 'Hide' : 'Show'}</button>
    </div>
    {error && <p id={`${id}-error`} className='mt-1 text-sm text-primaryColor'>{error}</p>}
  </div>
)

export default AuthForm
