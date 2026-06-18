import Fuse from 'fuse.js'
import type { Cashback, HelpfulInfo, Promocode } from '@/types'

export function createCashbackSearch(items: Cashback[]) {
  return new Fuse(items, {
    keys: ['category', 'merchants', 'bankName', 'additionalInfo'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  })
}

export function createPromocodeSearch(items: Promocode[]) {
  return new Fuse(items, {
    keys: ['merchantName', 'description'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  })
}

export function createHelpfulInfoSearch(items: HelpfulInfo[]) {
  return new Fuse(items, {
    keys: ['title', 'description'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  })
}
