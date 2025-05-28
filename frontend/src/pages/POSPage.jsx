import { useSetAtom } from 'jotai'
import { cartAtom } from '../state/cartAtom'
import { useMemo, useState } from 'react'
import SearchFilterBar from '../components/SearchFilterBar'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import { useProducts } from '../hooks/useProducts'
import { useCreateSale } from '../hooks/useSales'
import NoShiftDialog from '../components/NoShiftDialog'

// ——— Mock product data ———
// const mockProducts = [
//     {
//         id: '1',
//         name: 'Mojito',
//         category: 'Cocktail',
//         price: 7.5,
//         imageUrl: 'https://picsum.photos/seed/mojito/64',
//     },
//     {
//         id: '2',
//         name: 'Gin & Tonic',
//         category: 'Cocktail',
//         price: 6.5,
//         imageUrl: 'https://picsum.photos/seed/gin-tonic/64',
//     },
//     {
//         id: '3',
//         name: 'Rum & Coke',
//         category: 'Cocktail',
//         price: 6.0,
//         imageUrl: 'https://picsum.photos/seed/rum-coke/64',
//     },
//     {
//         id: '4',
//         name: 'Tequila Sunrise',
//         category: 'Cocktail',
//         price: 8.0,
//         imageUrl: 'https://picsum.photos/seed/tequila-sunrise/64',
//     },
//     {
//         id: '5',
//         name: 'IPA Beer',
//         category: 'Beer',
//         price: 5.0,
//         imageUrl: 'https://picsum.photos/seed/ipa-beer/64',
//     },
//     {
//         id: '6',
//         name: 'Stout Beer',
//         category: 'Beer',
//         price: 5.5,
//         imageUrl: 'https://picsum.photos/seed/stout-beer/64',
//     },
//     {
//         id: '7',
//         name: 'Lager Beer',
//         category: 'Beer',
//         price: 4.5,
//         imageUrl: 'https://picsum.photos/seed/lager-beer/64',
//     },
//     {
//         id: '8',
//         name: 'Cider',
//         category: 'Beer',
//         price: 5.0,
//         imageUrl: 'https://picsum.photos/seed/cider/64',
//     },
//     {
//         id: '9',
//         name: 'Whiskey',
//         category: 'Spirit',
//         price: 8.0,
//         imageUrl: 'https://picsum.photos/seed/whiskey/64',
//     },
//     {
//         id: '10',
//         name: 'Vodka Soda',
//         category: 'Spirit',
//         price: 6.0,
//         imageUrl: 'https://picsum.photos/seed/vodka-soda/64',
//     },
//     {
//         id: '11',
//         name: 'Tequila Shot',
//         category: 'Spirit',
//         price: 4.0,
//         imageUrl: 'https://picsum.photos/seed/tequila-shot/64',
//     },
//     {
//         id: '12',
//         name: 'Rum Shot',
//         category: 'Spirit',
//         price: 4.5,
//         imageUrl: 'https://picsum.photos/seed/rum-shot/64',
//     },
//     {
//         id: '13',
//         name: 'Coke',
//         category: 'Soft Drink',
//         price: 2.5,
//         imageUrl: 'https://picsum.photos/seed/coke/64',
//     },
//     {
//         id: '14',
//         name: 'Orange Juice',
//         category: 'Soft Drink',
//         price: 3.0,
//         imageUrl: 'https://picsum.photos/seed/orange-juice/64',
//     },
//     {
//         id: '15',
//         name: 'Water',
//         category: 'Soft Drink',
//         price: 1.5,
//         imageUrl: 'https://picsum.photos/seed/water/64',
//     },
//     {
//         id: '16',
//         name: 'Chips',
//         category: 'Snack',
//         price: 2.0,
//         imageUrl: 'https://picsum.photos/seed/chips/64',
//     },
//     {
//         id: '17',
//         name: 'Mixed Nuts',
//         category: 'Snack',
//         price: 3.0,
//         imageUrl: 'https://picsum.photos/seed/mixed-nuts/64',
//     },
//     {
//         id: '18',
//         name: 'Nachos',
//         category: 'Snack',
//         price: 4.0,
//         imageUrl: 'https://picsum.photos/seed/nachos/64',
//     },
// ]

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
        // setCart((prev) => {
        //     const exists = prev.find((i) => i.id === product._id)
        //     if (exists) {
        //         return prev.map((i) =>
        //             i.id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        //         )
        //     }
        //     return [...prev, { ...product, quantity: 1 }]
        // })
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
