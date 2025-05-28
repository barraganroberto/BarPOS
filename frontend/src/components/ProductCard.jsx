import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'

export default function ProductCard({ product, onAdd }) {
    return (
        <motion.div
            className="w-full"
            whileTap={{ scale: 0.95 }}
            onClick={() => onAdd(product)}
        >
            <div className="bg-card flex items-center space-x-4 rounded-xl p-4 shadow">
                {/* Thumbnail or empty div if no imageUrl */}
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>
                {/* <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="size-16 shrink-0 rounded-md object-cover"
                /> */}

                {/* Name & price */}
                <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-muted-foreground text-sm">
                        €{product.price.toFixed(2)}
                    </p>
                </div>

                {/* Add button */}
                <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Add ${product.name} to cart`}
                >
                    <Plus className="size-4" />
                </Button>
            </div>
        </motion.div>
    )
}
