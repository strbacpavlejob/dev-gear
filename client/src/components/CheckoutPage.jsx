import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Checkout from "../components/Checkout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51MbkO3GascOH90aXICJm0or32WasEVQrhZdd3nGdp90bLnEORK4F0kdczbLJrN56h5x9JjIXIUMyD5QUue0QDiI3004LEvU7mK"
);

const CheckoutPage = (props) => {
  const [clientSecret, setClientSecret] = useState("");
  const [stripeProducts, setStripeProducts] = useState([]);
  const itemsInCart = useContext(ProductContext).itemsInCart;

  useEffect(() => {
    axios
      .get("http://localhost:8000/stripes/products")
      .then((res) => {
        const listOfProductsByName = totalListOfProducts();
        const allStripeProducts = res.data.data;
        console.log(`listOfProductsByName ${listOfProductsByName}`);
        console.log(`allStripeProducts ${JSON.stringify(allStripeProducts)}`);
        const listOfStripeProducts = createListOfStripeProducts(
          listOfProductsByName,
          allStripeProducts
        );
        setStripeProducts(listOfStripeProducts);

        axios
          .get("http://localhost:8000/stripes/prices")
          .then((res) => {
            const allStripePrices = res.data.data;
            const listOfDBPrices = matchingPriceIds(
              listOfStripeProducts,
              allStripePrices
            );
            axios
              .post("http://localhost:8000/stripes/pay", {
                listOfDBPrices,
              })
              .then((res) => {
                setClientSecret(res.data.clientSecret);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));

        axios
          .post("http://localhost:8000/stripes/pay", {
            stripeProducts,
          })
          .then((res) => {
            setClientSecret(res.data.clientSecret);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }, []);

  const totalListOfProducts = () => {
    const tempArray = [];
    for (let i in itemsInCart) {
      let itemQuantity = itemsInCart[i].quantity;
      while (itemQuantity > 0) {
        tempArray.push(itemsInCart[i].name);
        itemQuantity--;
      }
    }
    return tempArray;
  };

  const createListOfStripeProducts = (arr1, arr2) => {
    const containerArr = [];
    for (let j in arr1) {
      const currentItem = arr1[j];
      for (let k in arr2) {
        const currentStripeItem = arr2[k].name;
        if (currentItem === currentStripeItem) {
          containerArr.push(arr2[k].default_price);
          break;
        }
      }
    }
    return containerArr;
  };

  const matchingPriceIds = (arr1, arr2) => {
    const tempPriceArray = [];
    for (let i in arr1) {
      for (let j in arr2) {
        if (arr1[i] === arr2[j].id) {
          tempPriceArray.push(arr2[j]);
        }
      }
    }
    return tempPriceArray;
  };

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <NavBar />
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <Checkout />
        </Elements>
      )}
    </>
  );
};

export default CheckoutPage;
