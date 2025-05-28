import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'

// Persistent cart state
export const cartAtom = atomWithStorage('bar-pos-cart', [])

// Derived atoms
export const totalAtom = atom((get) =>
    get(cartAtom).reduce((sum, i) => sum + i.price * i.quantity, 0)
)
export const cartCountAtom = atom((get) =>
    get(cartAtom).reduce((c, i) => c + i.quantity, 0)
)
export const formattedTotalAtom = atom((get) => {
    const t = get(totalAtom)
    return `€${t.toFixed(2)}`
})
