import { forwardRef } from 'react'
import { useAtomValue } from 'jotai'
import { cartCountAtom, formattedTotalAtom } from '../state/cartAtom'
import { motion } from 'framer-motion'

export const FloatingCartButton = forwardRef(function FloatingCartButton(
    { onClick },
    ref
) {
    const count = useAtomValue(cartCountAtom)
    const total = useAtomValue(formattedTotalAtom)

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            whileTap={{ scale: 0.9 }}
            className="bg-primary cursor-pointer text-primary-foreground fixed right-1/2 bottom-8 z-40 flex translate-x-1/2 items-center space-x-4 w-56 pl-9 rounded-full p-4 shadow-lg"
            aria-label="View cart"
        >
            <span className="font-bold">{count} items</span>
            <span>🛒</span>
            <span className="font-semibold">{total}</span>
        </motion.div>
    )
})
