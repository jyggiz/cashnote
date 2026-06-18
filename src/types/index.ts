export interface Cashback {
  id: string
  category: string
  cashbackPercent: number
  merchants: string[]
  bankName: string
  cardOwner: 'timur' | 'dinara'
  expiryDate: string
  additionalInfo?: string
  createdAt: string
  updatedAt: string
}

export interface Promocode {
  id: string
  merchantName: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  currency?: string
  expiryDate?: string
  usageType: 'first_order' | 'second_order' | 'unlimited' | 'custom'
  usageText: string
  description?: string
  code: string
  createdAt: string
}

export interface HelpfulInfo {
  id: string
  title: string
  description: string
  links?: { text: string; url: string }[]
  imageUrl?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata: {
    roles?: string[]
    provider?: string
  }
}
