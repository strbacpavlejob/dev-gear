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
import AdminPage from "./views/AdminPage";
import Protected from "./components/Protected";

function App() {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [numInCart, setNumInCart] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({});

  const sesstionIsAdmin = sessionStorage.getItem("isAdmin");
  const sesstionIsLogged = sessionStorage.getItem("isLogged");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const updateNumInCart = JSON.parse(sessionStorage.getItem("numInCart"));
    setNumInCart(updateNumInCart);

    const updateItemsInCart = JSON.parse(sessionStorage.getItem("itemsInCart"));
    setItemsInCart(updateItemsInCart);
  }, [numInCart]);

  useEffect(() => {
    const newIsAdmin = JSON.parse(sesstionIsAdmin);
    setIsAdmin(newIsAdmin);
  }, [sesstionIsAdmin]);

  useEffect(() => {
    const newIsLogged = JSON.parse(sesstionIsLogged);
    setIsLogged(newIsLogged);
  }, [sesstionIsLogged]);

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
          <Route element={<ViewAllProducts />} path="/products/view-all" />
          <Route element={<ViewProduct />} path="/products/:id" />
          <Route element={<ShoppingCartPage />} path="/cart" />
          <Route
            element={
              <Protected isSignedIn={true}>
                <CheckoutPage />
              </Protected>
            }
            path="/checkout"
          />
          <Route
            element={
              <Protected isSignedIn={true}>
                <OrderSummary />
              </Protected>
            }
            path="/summary"
          />
          <Route
            element={
              <Protected isSignedIn={isAdmin}>
                <AdminPage />
              </Protected>
            }
            path="/admin"
          />
        </Routes>
      </ProductContext.Provider>
    </div>
  );
}

export default App;
