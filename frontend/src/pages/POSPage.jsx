import { useSetAtom } from 'jotai'
import { cartAtom } from '../state/cartAtom'
import { useMemo, useState } from 'react'
import SearchFilterBar from '../components/SearchFilterBar'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import { useProducts } from '../hooks/useProducts'
import { useCreateSale } from '../hooks/useSales'
import NoShiftDialog from '../components/NoShiftDialog'

export default function POSPage() {
    const setCart = useSetAtom(cartAtom)
    const [search, setSearch] = useState('')
    const [activeCat, setActiveCat] = useState(null)
    const { data: products = [], isLoading } = useProducts()
    const createSale = useCreateSale()

    const handleCheckout = (items, method) => {
        createSale.mutate({ items, method })
    }

    // // Unique category list
    const categories = useMemo(
        () => [...new Set(products.map((p) => p.category))],
        [products]
    )

    // // Filter by category & search
    const filtered = useMemo(
        () =>
            products
                .filter((p) => !activeCat || p.category === activeCat)
                .filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                ),
        [search, activeCat, products]
    )

    const handleAdd = (product) => {
        setCart((prev) => {
            const exists = prev.find((i) => i.id === product._id)
            if (exists) {
                return prev.map((i) =>
                    i.id === product._id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }
            return [
                ...prev,
                {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: 1,
                },
            ]
        })
    }

    return (
        <>
            {/* If no open shift, cover the page and force nav */}
            <NoShiftDialog />

            {/* Search & Filter bar */}
            <div className="bg-background sticky top-0 z-10">
                <SearchFilterBar
                    categories={categories}
                    activeCat={activeCat}
                    onSearch={setSearch}
                    onSelectCat={(cat) => {
                        setActiveCat(cat)
                        setSearch('')
                    }}
                />
            </div>

            {/* Product list */}
            <div className="grid grid-cols-1 gap-4 p-4 pb-22">
                {!isLoading &&
                    filtered.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAdd={handleAdd}
                        />
                    ))}
            </div>

            {/* Cart drawer trigger */}
            <CartDrawer onCheckout={handleCheckout} />
        </>
    )
}
