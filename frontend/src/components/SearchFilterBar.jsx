import { Input } from './ui/input'
import { Button } from './ui/button'

export default function SearchFilterBar({
    categories,
    activeCat,
    onSearch,
    onSelectCat,
}) {
    return (
        <div className="bg-background border-border sticky top-0 z-10 space-y-2 border-b p-2">
            <Input
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full"
                type="search"
            />
            <div className="no-scrollbar flex space-x-2 overflow-x-auto">
                <Button
                    variant={!activeCat ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => {
                        onSelectCat(null)
                        onSearch('')
                    }}
                >
                    All
                </Button>

                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={activeCat === cat ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onSelectCat(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    )
}
