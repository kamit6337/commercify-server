import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import Country from "../models/CountryModel.js";
import Product from "../models/ProductModel.js";
import Buy from "../models/BuyModel.js";
import Stock from "../models/StockModel.js";
import getExchange from "../controllers/additional/getExchange.js";
import getAllCountriesDB from "../database/Additional/getAllCountriesDB.js";
import changePriceDiscountByExchangeRate from "../utils/javaScript/changePriceDiscountByExchangeRate.js";
import ProductPrice from "../models/ProductPriceModel.js";

// Connect to MongoDB
mongoose.connect(environment.MONGO_DB_URI);

// Connection error handling
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Connection successful
mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  try {
    const exchangeCurr = await getExchange();

    const allProducts = await Product.find().lean();
    const allCountry = await getAllCountriesDB();

    const priceList = allProducts.map((product) =>
      allCountry.map((country) => {
        const productId = product._id;
        const countryId = country._id;
        const currency_code = country.currency.code;
        const discountPercentage = product.discountPercentage;

        const exchangeRate = exchangeCurr[currency_code];

        if (!exchangeRate) {
          throw new Error("Wrong Currency Code provided");
        }

        const { exchangeRatePrice: base_price, discountedPrice } =
          changePriceDiscountByExchangeRate(
            product.price,
            discountPercentage,
            exchangeRate,
            currency_code
          );

        const deliveryCharge = Math.trunc(base_price / 10);

        return {
          product: productId,
          country: countryId,
          currency_code,
          price: base_price,
          discountPercentage,
          discountedPrice,
          deliveryCharge,
        };
      })
    );

    const flatPriceList = priceList.flatMap((list) => list);

    const result = await ProductPrice.insertMany(flatPriceList);

    console.log(result);
  } catch (error) {
    console.error("Error occur in update:", error);
  } finally {
    mongoose.disconnect();
  }
});

// Connection closed
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
