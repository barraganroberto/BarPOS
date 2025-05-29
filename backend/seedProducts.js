import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});

    const products = [
        {
            name: "Shots",
            category: "shots",
            price: 2,
            imageUrl: "https://www.istockphoto.com/photos/shot-glass",
        },
        {
            name: "Coca Cola / Zero",
            category: "soft drink",
            price: 2,
            imageUrl:
                "https://www.nexpressdelivery.co.uk/products/drinks/soft-drinks/coca-cola/Coca-Cola-Cans-330ml.html",
        },
        {
            name: "Iced tea (lemon)",
            category: "soft drink",
            price: 2,
            imageUrl:
                "https://www.walmart.com/ip/Lipton-Lemon-Iced-Tea-16-9-fl-oz-12-Pack-Bottles/11960993",
        },
        {
            name: "Pineapple juice",
            category: "soft drink",
            price: 2,
            imageUrl:
                "https://www.walmart.com/ip/Ocean-Spray-100-Pineapple-Juice-32-fl-oz/55556539",
        },
        {
            name: "Peach juice",
            category: "soft drink",
            price: 2,
            imageUrl:
                "https://www.walmart.com/ip/Simply-Peach-Juice-52-fl-oz/455953165",
        },
        {
            name: "Orange juice",
            category: "soft drink",
            price: 2,
            imageUrl:
                "https://www.walmart.com/ip/Tropicana-Homestyle-Some-Pulp-100-Orange-Juice-52-Fl-Oz/253110860",
        },
        {
            name: "Alhambra",
            category: "beer",
            price: 2,
            imageUrl:
                "https://www.cervezasalhambra.com/es/nuestras-cervezas/alhambra-especial/",
        },
        {
            name: "Alhambra Especiál 6.4%",
            category: "beer",
            price: 3,
            imageUrl:
                "https://www.cervezasalhambra.com/es/nuestras-cervezas/alhambra-especial/",
        },
        {
            name: "Alhambra 1925 6.4%",
            category: "beer",
            price: 3,
            imageUrl: "https://lunya.co.uk/product/alhambra-reserva-1925/",
        },
        {
            name: "Alhambra Roja 7.2%",
            category: "beer",
            price: 3,
            imageUrl: "https://13c.wine/products/alhambra-reserva-roja-bottle",
        },
        {
            name: "Vino blanco / tinto",
            category: "wine",
            price: 3,
            imageUrl: "https://www.istockphoto.com/photos/wine-bottle",
        },
        {
            name: "Tinto de verano",
            category: "wine",
            price: 3,
            imageUrl: "https://www.istockphoto.com/photos/tinto-de-verano",
        },
        {
            name: "Sangria",
            category: "wine",
            price: 3,
            imageUrl: "https://www.istockphoto.com/photos/sangria",
        },
        {
            name: "Kalimotxo",
            category: "wine",
            price: 3,
            imageUrl: "https://www.istockphoto.com/photos/kalimotxo",
        },
        {
            name: "Negroni",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/negroni",
        },
        {
            name: "Mojito",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/mojito",
        },
        {
            name: "Whiskey Sour",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/whiskey-sour",
        },
        {
            name: "Daiquiri",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/daiquiri",
        },
        {
            name: "Collins",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/tom-collins",
        },
        {
            name: "Cuba Libre",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/cuba-libre",
        },
        {
            name: "Vodka Sour",
            category: "cocktail",
            price: 5,
            imageUrl: "https://www.istockphoto.com/photos/vodka-sour",
        },
        {
            name: "Sangria",
            category: "happyHour",
            price: 1.5,
            imageUrl: "https://www.istockphoto.com/photos/sangria",
        },
        {
            name: "Tinto de verano",
            category: "happyHour",
            price: 1.5,
            imageUrl: "https://www.istockphoto.com/photos/tinto-de-verano",
        },
        {
            name: "Kalimotxo",
            category: "happyHour",
            price: 1.5,
            imageUrl: "https://www.istockphoto.com/photos/kalimotxo",
        },
    ];

    const inserted = await Product.insertMany(products)
    console.log(`Inserted ${inserted.length} products`)
    await mongoose.disconnect()
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
