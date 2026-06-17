import type { ApplicationStatus } from '../lib/domain'

// English — the base content catalog. zh/ja override prominent keys and fall
// back here. Foreign inbound travelers see English by default.
const en = {
  brand: { name: 'LOTTE ROAMING', affiliate: 'Lotte Roaming' },

  nav: {
    home: 'HOME',
    browse: 'TRAVEL',
    applications: 'MY',
    login: 'Sign in',
    myAccount: 'Account',
    signOut: 'Sign out',
  },

  cta: {
    browse: 'View Korea plans',
    global: 'Going elsewhere? Global plans',
    selectDestination: 'Choose your destination',
    apply: 'Apply',
    viewDetail: 'View details',
    continue: 'Continue',
    next: 'Next',
    submit: 'Submit application',
    toComplete: 'Place application',
    goHome: 'Back to home',
    viewApplication: 'View application',
    activate: 'Activation guide',
    retry: 'Try again',
    back: 'Back',
  },

  home: {
    heroEyebrow: 'Travel data for Korea',
    heroTitle: 'Your Korea,\nconnected.',
    heroDesc:
      'Prepaid eSIM & USIM for your trip to Korea. Activate in minutes, no contract — with L.POINT membership benefits.',
    plansTitle: 'Korea data plans',
    plansDesc: 'Pick a plan and apply in minutes.',
    benefitsTitle: 'L.POINT membership benefits',
    benefitsDesc: 'Apply for LOTTE ROAMING and these come with it.',
    destinationsMore: 'See all',
    howTitle: 'How it works',
    howSteps: [
      { title: 'Choose a plan', desc: 'Daily or Volume to fit your trip.' },
      { title: 'Pick options', desc: 'eSIM or USIM, days and network.' },
      { title: 'Enter details', desc: 'How to receive it and your info.' },
      { title: 'Activate on arrival', desc: 'Turn on data and you’re set.' },
    ],
    faqTitle: 'Frequently asked questions',
  },

  browse: {
    title: 'Korea data plans',
    subtitle: 'Prepaid eSIM & USIM for your trip to Korea.',
    resultCount: (n: number) => `${n} plan${n === 1 ? '' : 's'}`,
    empty: 'No plans available right now.',
    koreaName: 'Korea',
  },

  builder: {
    title: 'Build your roaming',
    sub: 'Pick a destination, plan type and amount — then see the plan.',
    step1: 'Destination',
    step2: 'Plan type',
    step3Daily: 'Travel days',
    dataLabel: 'Data per day',
    step3Volume: 'Validity',
    daily: 'Daily',
    volume: 'Volume',
    dailyDesc: 'A fresh data allowance refreshes every day — best for steady daily use.',
    volumeDesc: 'One total allowance to use freely over a fixed validity period.',
    priceLabel: 'Estimated price',
    cta: 'View plan & apply',
    pickDestination: 'Choose a destination to start',
    searchPlaceholder: 'Search destination',
    noResults: 'No matching destination',
  },

  product: {
    perDay: 'Per day',
    days: 'Days',
    total: 'Total data',
    validity: 'Validity',
    sim: 'SIM',
    network: 'Network',
    coverageGlobal: 'Worldwide',
    benefitsTitle: 'Included benefits',
    noticeTitle: 'Please note',
    priceNote: 'Sample pricing · varies by days/data.',
    perDayShort: 'day',
    unlimited: 'Unlimited',
    daysUnit: (n: number) => `${n} day${n === 1 ? '' : 's'}`,
    gbPerDay: (n: number) => `${n}GB / day`,
    totalGb: (n: number) => `${n}GB total`,
  },

  sim: {
    esim: 'eSIM',
    usim: 'USIM',
    esimDesc: 'Install instantly via QR · no physical card',
    usimDesc: 'Physical card · delivered before departure',
  },
  network: {
    roaming: 'Roaming',
    local: 'SKT local',
    roamingDesc: 'Auto-connects via partner carriers · works on arrival',
    localDesc: 'Korea’s local network · fastest in cities',
  },
  receive: {
    esim_qr: 'eSIM QR (sent by email)',
    delivery: 'Courier delivery (1–2 days)',
    airport_pickup: 'Airport pickup (Incheon T1/T2)',
  },

  steps: ['Details', 'Review', 'Done'],

  signin: {
    title: 'Sign in or sign up',
    subtitle: 'One tap to continue — new accounts get an L.POINT membership.',
    or: 'or',
    providers: {
      kakao: 'Continue with Kakao',
      line: 'Continue with LINE',
      google: 'Continue with Google',
      apple: 'Continue with Apple',
      wechat: 'Continue with WeChat',
      email: 'Continue with email',
    },
    terms: 'I agree to the Terms & Privacy Policy (required)',
    push: 'Get arrival guides & benefit alerts',
    marketing: 'Marketing messages (optional)',
    termsRequired: 'Please agree to the required terms.',
    lpoint: 'Creating an account also sets up your L.POINT membership for travel perks.',
    consentTitle: 'Welcome! One more step',
    consentSub: 'Review and agree to finish creating your account.',
    agreeContinue: 'Agree & continue',
    useAnother: 'Use another account',
    // Email flow
    emailStepTitle: 'Continue with email',
    emailStepSub: 'Enter your email to sign in or create an account.',
    emailLabel: 'Email address',
    emailPh: 'you@email.com',
    signinStepTitle: 'Welcome back',
    signinStepSub: 'Enter your password to sign in.',
    signupStepTitle: 'Create your account',
    signupStepSub: 'Set your name and a password to finish signing up.',
    nameLabel: 'Name',
    namePh: 'Your name',
    passwordLabel: 'Password',
    passwordPh: 'At least 8 characters',
    confirmLabel: 'Confirm password',
    createAccount: 'Create account',
    signInBtn: 'Sign in',
    changeEmail: 'Change email',
    backToOptions: 'Other sign-in options',
    pwShort: 'Use at least 8 characters.',
    pwMismatch: 'Passwords do not match.',
    passwordRequired: 'Enter your password.',
    nameRequired: 'Enter your name.',
  },

  applicant: {
    title: 'Enter your details',
    subtitle: 'We need the applicant’s info for activation and notifications.',
    name: 'Full name',
    namePh: 'Name as on passport',
    email: 'Email',
    emailPh: 'example@email.com',
    phone: 'Phone number',
    phonePh: 'e.g. 1012345678',
    travel: 'Travel dates',
    travelStart: 'Departure',
    travelEnd: 'Return',
    receiveTitle: 'How to receive',
    address: 'Delivery address',
    addressPh: 'Enter your address',
    required: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    invalidPhone: 'Enter 10–11 digits.',
    invalidDate: 'Return must be on or after departure.',
    addressRequired: 'Enter an address for USIM delivery.',
  },

  confirm: {
    title: 'Review your application',
    subtitle: 'Check the details and place your application.',
    destination: 'Destination',
    product: 'Plan',
    options: 'Options',
    applicant: 'Applicant',
    period: 'Travel dates',
    receive: 'Receive by',
    agree: 'I’ve reviewed the application and notices and agree.',
    agreeRequired: 'Please agree to continue.',
    paymentNote: 'Payment integration is coming later; this places the application for now.',
    processing: 'Placing application…',
    estimatedTotal: 'Estimated total',
  },

  complete: {
    title: 'Your application is in',
    subtitle: 'Check your application and what’s next.',
    refLabel: 'Application no.',
    nextTitle: 'Next steps',
    esimNext: 'Your eSIM QR was sent by email. Turn on data roaming after you arrive to activate.',
    usimNext: 'Your USIM ships to your address (1–2 days). Please receive it before departure.',
    noticeTitle: 'Please note',
    summaryTitle: 'Application summary',
  },

  applications: {
    title: 'My applications',
    subtitle: 'Track the status of your roaming applications.',
    empty: 'No applications yet.',
    emptyCta: 'Browse roaming plans',
    detailTitle: 'Application details',
    appliedAt: 'Applied',
  },

  travel: {
    title: 'Travel',
    subtitle: 'Explore Lotte benefits and local tips for any destination.',
    active: 'Roaming active',
    preview: 'Preview before you go',
    pickPlace: 'Change destination',
    offersTitle: 'Lotte benefits here',
    tipsTitle: 'Recommended',
    phrasesTitle: 'Travel phrasebook',
    infoTitle: 'Good to know',
    tabBenefits: 'Benefits',
    tabInfo: 'Info',
    tabPhrases: 'Phrases',
    tabGuide: 'Guide',
    empty: 'Start a roaming plan and your destination perks appear here.',
    emptyCta: 'Build your roaming',
  },

  reminder: {
    upcoming: (d: number) => `Departure in ${d} days — your roaming is ready`,
    tomorrow: 'Your trip starts tomorrow — roaming is ready',
    active: 'Trip in progress — roaming is active',
    cta: 'View',
  },

  usage: {
    title: 'Data usage',
    plan: 'Plan',
    remaining: 'Remaining',
    remainingToday: 'Remaining today',
    used: 'Used',
    usedTotal: 'Used so far',
    topUp: 'Top up data',
    lowWarning: 'Data is running low — top up to stay connected.',
    expired: 'Plan ended',
    dayOf: (d: number, total: number) => `Day ${d} of ${total}`,
    daysLeft: (n: number) => (n === 1 ? '1 day left' : `${n} days left`),
  },

  phrases: {
    intro: 'Tap to translate. Or type your own below.',
    inputPlaceholder: 'Type anything to translate',
    translate: 'Translate',
    localLabel: 'Local',
    categories: {
      basics: 'Basics',
      directions: 'Directions',
      dining: 'Dining',
      shopping: 'Shopping',
      emergency: 'Emergency',
    },
  },

  info: {
    emergency: 'Emergency',
    police: 'Police',
    medical: 'Ambulance / Fire',
    power: 'Power & plugs',
    voltage: 'Voltage',
    plugType: 'Plug type',
    currency: 'Currency',
    rateNote: 'Sample rate — check live rates before you pay.',
    localTime: 'Local time',
    timeDiff: 'Time difference',
    tipping: 'Tipping & etiquette',
  },

  status: {
    draft: 'Draft',
    submitted: 'Submitted',
    pending_payment: 'Payment pending',
    pending_provisioning: 'Provisioning',
    completed: 'Activated',
    failed: 'Failed',
  } as Record<ApplicationStatus, string>,

  statusDesc: {
    submitted: 'Your application was received.',
    pending_payment: 'Awaiting payment integration.',
    pending_provisioning: 'Provisioning — activate after you arrive.',
    completed: 'Activated. Your data is ready to use.',
    failed: 'Application failed. Please try again.',
    draft: 'This application is still a draft.',
  } as Record<ApplicationStatus, string>,

  activate: {
    title: 'Activation guide',
    subtitle: 'After you arrive, follow these steps to get connected.',
    iphone: 'iPhone',
    android: 'Android',
    steps: [
      {
        title: 'Install eSIM (scan QR)',
        desc: 'Scan the QR you received with your camera to install. (For USIM, insert the card.)',
      },
      { title: 'Add the plan', desc: 'Tap “Add eSIM” and follow the prompts.' },
      { title: 'Turn on data roaming', desc: 'Enable data roaming for the LOTTE ROAMING line.' },
    ],
    done: 'Mark as activated',
    doneNote: 'Finish these after you arrive to use your data. (Demo: complete with the button.)',
    help: 'Need help?',
  },

  empty: { generic: 'Nothing to show.' },

  error: {
    generic: 'Something went wrong. Please try again shortly.',
    notFound: 'We couldn’t find what you’re looking for.',
    submit: 'Could not place the application. Please try again.',
  },

  // Interactive landing — travel-direction branching.
  direction: {
    question: 'Where are you headed?',
    inbound: {
      tab: 'Coming to Korea',
      sub: 'Enjoy your trip to Korea — data, shopping, tours and stays — with one LOTTE ROAMING.',
      cta: 'See Korea plans & benefits',
      areaTitle: 'Where will you stay in Korea?',
    },
    outbound: {
      tab: 'Going abroad',
      sub: 'Roaming is just the start — enjoy Lotte shopping & travel perks, and earn L.POINT after your trip.',
      cta: 'Find roaming for my trip',
      areaTitle: 'Where are you going?',
    },
    productsTitle: 'Recommended roaming',
    partnersTitle: 'Lotte & L.POINT benefits',
    partnerNote:
      'Benefits are partner-dependent and to be announced; available when your L.POINT membership is linked.',
    pickArea: 'Select a destination to see recommended plans.',
    categories: {
      shopping: 'Shopping',
      tour: 'Tours',
      stay: 'Stay & leisure',
      dutyfree: 'Duty-free',
      lpoint: 'L.POINT',
    } as Record<string, string>,
    // Area-specific recommendations (inbound).
    guideTitle: 'Recommended for your stay',
    koreaGuideTitle: 'Make the most of your Korea trip',
    koreaGuideSub: 'Lotte stays, tours and shopping to pair with your roaming.',
    guideNote: 'Lotte & L.POINT partner picks near where you stay — perks to be announced.',
    guideCategories: {
      stay: 'Stay',
      tour: 'Tour',
      shopping: 'Shopping',
      food: 'Food',
    } as Record<string, string>,
    // Reviews.
    reviewsTitle: 'What travelers say',
    reviewsUnit: 'reviews',
    reviewVerified: 'Verified trip',
    reviewTranslated: 'Translated',
    reviewTranslating: 'Translating…',
    reviewShowOriginal: 'Show original',
    reviewShowTranslation: 'See translation',
    reviewWrite: 'Write a review',
    reviewFormTitle: 'Share your trip',
    reviewRating: 'Your rating',
    reviewText: 'Your review',
    reviewTextPh: 'How was your roaming and trip?',
    reviewName: 'Display name',
    reviewNamePh: 'e.g. Alex',
    reviewPhoto: 'Pick a vibe',
    reviewSubmit: 'Post review',
    swipeHint: 'Swipe to explore',
    brandTag: 'L.POINT',
  },

  // Localizable catalog content (overrides the English text in src/data/*).
  catalog: {
    // English names/taglines live on the product data; locales override by id.
    products: {} as Record<string, { name: string; tagline: string }>,
    benefits: {
      point: {
        title: 'L.POINT rewards',
        desc: 'Link your L.POINT membership at sign-up — rewards to be announced',
      },
      install: { title: 'Instant setup', desc: 'eSIM installs instantly via QR' },
      nocontract: { title: 'No contract', desc: 'Prepaid · no cancellation fees' },
      '5g': { title: '5G ready', desc: '5G where the local network supports it' },
      support: { title: '24/7 support', desc: 'Customer support around the clock' },
      welcome: { title: 'Welcome gift', desc: 'New-applicant partner perks to be announced' },
    } as Record<string, { title: string; desc: string }>,
    notices: {
      throttle:
        'After the daily cap, unlimited low-speed (up to 1 Mbps) applies until the next reset at 00:00 local time.',
      volume:
        'Volume plans let you use the data freely within the validity period; a top-up is needed once it runs out.',
      esim: 'eSIM works on eSIM-capable devices only (iPhone XS or newer and most Android phones).',
      usim_deliver:
        'USIM delivery takes 1–2 days after applying and must be received before departure.',
      coverage:
        'Speeds may vary depending on local network conditions and where you use the service.',
      price:
        'Prices and benefits will be announced once confirmed; amounts shown here are placeholders (₩—).',
    } as Record<string, string>,
    partners: {} as Record<string, { title: string; desc: string }>,
    lottePerks: {} as Record<string, { title: string; desc: string }>,
    // Area guides + reviews override text by id; English lives in src/data.
    areaGuides: {} as Record<
      string,
      { tagline: string; highlights: Record<string, { title: string; desc: string }> }
    >,
    reviews: {} as Record<string, { text: string; tag: string }>,
    faq: {
      inbound: [
        {
          q: "What's the difference between eSIM and USIM?",
          a: 'An eSIM is a digital SIM installed instantly from a QR code — no physical card. A USIM is a physical card, delivered before departure, that you insert into your device.',
        },
        {
          q: 'How are Daily and Volume plans different?',
          a: 'Daily refills a set amount of data each day and runs at unlimited low speed after the cap. Volume gives you one data pool to use freely within the validity period.',
        },
        {
          q: 'How do I get Lotte / L.POINT benefits in Korea?',
          a: 'Sign in with your L.POINT membership during application to link partner benefits (shopping, tours, stay, duty-free). Exact perks are partner-dependent and to be announced.',
        },
        {
          q: 'When and how do I activate?',
          a: 'Turn on data roaming after you arrive in Korea. For eSIM, install the QR you receive at application, then activate on arrival.',
        },
      ],
      outbound: [
        {
          q: 'How are destination and plan chosen?',
          a: 'Pick your destination country first; available roaming plans are filtered to that destination, then you choose Daily or Volume to fit your trip.',
        },
        {
          q: 'How are Daily and Volume plans different?',
          a: 'Daily refills a set amount of data each day and runs at unlimited low speed after the cap. Volume gives you one data pool to use freely within the validity period.',
        },
        {
          q: 'Do I earn L.POINT for roaming abroad?',
          a: 'L.POINT earning after your trip may be offered once roaming use is complete. Conditions and rates are to be announced.',
        },
        {
          q: 'When and how do I activate abroad?',
          a: 'Turn on data roaming after you arrive. For eSIM, install the QR you receive at application, then activate at your destination.',
        },
      ],
    } as { inbound: { q: string; a: string }[]; outbound: { q: string; a: string }[] },
  },

  footer: {
    affiliate: 'Lotte Roaming',
    company: {
      name: 'Lotte Members Co., Ltd.',
      rows: [
        ['CEO: Park Jong-nam'],
        ['Address: 14F, 16 Tongil-ro 2-gil, Jung-gu, Seoul 04511, Korea'],
        ['Business Reg. No.: 104-86-58491', 'Mail-order Sales Reg.: 2015-Seoul Jung-gu-1231'],
        ['Hosting provider: Lotte Innovate Co., Ltd.'],
      ] as string[][],
    },
    intermediary:
      'Lotte Members is an online sales intermediary and is not a party to the transactions; it is therefore not responsible for product/transaction information or for the transactions themselves.',
    language: 'Language',
    links: ['Partnership', 'Customer center', 'Terms of use'],
    links2: ['Privacy Policy', 'Dispute resolution'],
    demoNote:
      'Demo MVP — prices, benefits and terms that are not finalized will be announced separately.',
  },
}

export default en
export type Content = typeof en
