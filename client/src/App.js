import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProductContext from "./context/ProductContext";
import Home from "./views/Home";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ViewAllProducts from "./views/ViewAllProducts";
import ViewProduct from "./views/ViewProduct";
import ShoppingCartPage from "./views/ShoppingCartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderSummary from "./views/OrderSummary";

function App() {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [numInCart, setNumInCart] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({});

  useEffect(() => {
    const updateNumInCart = JSON.parse(sessionStorage.getItem("numInCart"));
    setNumInCart(updateNumInCart);

    const updateItemsInCart = JSON.parse(sessionStorage.getItem("itemsInCart"));
    setItemsInCart(updateItemsInCart);
  }, [numInCart]);

  return (
    <div className="App">
      <ProductContext.Provider
        value={{
          itemsInCart,
          setItemsInCart,
          numInCart,
          setNumInCart,
          shippingInfo,
          setShippingInfo,
        }}
      >
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<LoginPage />} path="/user/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<ViewAllProducts />} path="/product/view-all" />
          <Route element={<ViewProduct />} path="/product/:id" />
          <Route element={<ShoppingCartPage />} path="/cart" />
          <Route element={<CheckoutPage />} path="/checkout" />
          <Route element={<OrderSummary />} path="/summary" />
        </Routes>
      </ProductContext.Provider>
    </div>
  );
}

export default App;
