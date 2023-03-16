import { useState, useEffect, useContext, Fragment } from "react";
import axios from "axios";
import { Tab, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import ProductContext from "../context/ProductContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductPage = (props) => {
  const [item, setItem] = useState({});
  const [plugs, setPlugs] = useState([]);
  const [colors, setColors] = useState([]);
  const [productPlug, setProductPlug] = useState("");
  const [productColor, setProductColor] = useState("");

  const { id } = useParams();
  const setItemsInCart = useContext(ProductContext).setItemsInCart;
  const numInCart = useContext(ProductContext).numInCart;
  const setNumInCart = useContext(ProductContext).setNumInCart;

  useEffect(() => {
    axios
      .get("http://localhost:8000/products/" + id)
      .then((res) => {
        setItem({
          ...res.data,
          quantity: 1,
          plug: res.data.plug[0],
          color: res.data.colors[0],
        });
        setPlugs([...res.data.plug]);
        setColors([...res.data.colors]);
        setProductPlug(res.data.plug[0]);
        setProductColor(res.data.colors[0]);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const addToCart = (e) => {
    e.preventDefault();
    let currentProducts = JSON.parse(sessionStorage.getItem("itemsInCart"));

    if (currentProducts !== null) {
      for (let i in currentProducts) {
        if (
          Object.values(currentProducts[i]).includes(item._id) &&
          Object.values(currentProducts[i]).includes(item.plug) &&
          Object.values(currentProducts[i]).includes(item.color)
        ) {
          currentProducts[i].quantity++;
          sessionStorage.setItem(
            "itemsInCart",
            JSON.stringify([...currentProducts])
          );
          sessionStorage.setItem("numInCart", numInCart + 1);
          const updateItemsInCart = JSON.parse(
            sessionStorage.getItem("itemsInCart")
          );
          setItemsInCart(updateItemsInCart);
          setNumInCart(sessionStorage.numInCart);
          return;
        }
      }
      sessionStorage.setItem(
        "itemsInCart",
        JSON.stringify([...currentProducts, item])
      );
      sessionStorage.setItem("numInCart", numInCart + 1);
      const updateItemsInCart = JSON.parse(
        sessionStorage.getItem("itemsInCart")
      );
      setItemsInCart(updateItemsInCart);
    } else {
      sessionStorage.setItem("itemsInCart", JSON.stringify([item]));
      sessionStorage.numInCart = 1;
    }
    setNumInCart(sessionStorage.numInCart);
  };

  const plugHandler = (e) => {
    setProductPlug(e.target.id);
    setItem({ ...item, plug: e.target.id });
  };

  const colorHandler = (e) => {
    setProductColor(e.target.id);
    setItem({ ...item, color: e.target.id });
  };

  return (
    <div className="bg-white lg:h-screen">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {item.imgUrls
                  ?.filter((image) => image !== "")
                  .map((image) => (
                    <Tab
                      key={image}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only"> {image} </span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-blue" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
              {item.imgUrls
                ?.filter((image) => image !== "")
                .map((image) => (
                  <Tab.Panel key={image}>
                    <img
                      src={image}
                      alt={image}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            {item.itemType ? (
              <h2 className="text-blue tracking-tight">{item.itemType}</h2>
            ) : (
              <p></p>
            )}
            <span className="flex flex-row">
              {item.brand ? (
                <h4 className="text-3xl font-bold tracking-tight text-gray-900 pr-1">
                  {item.brand}
                </h4>
              ) : (
                <p></p>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-gray-500 pr-1">
                {item.name}
              </h1>
            </span>
            <div className="mt-3">
              <p className="text-3xl tracking-tight text-gray-900">
                for {String(item.categories).toLowerCase()}
              </p>
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ${item.price}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>

            <form className="mt-6">
              <div className="flex items-center gap-3">
                <h2 className="font-medium">Plug:</h2>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="group inline-flex justify-center items-center text-md font-medium text-gray-700 hover:text-gray-900">
                      {productPlug}
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {plugs?.map((plug, plugIdx) => (
                          <Menu.Item key={plug + plugIdx} id={plug}>
                            <p
                              onClick={(e) => plugHandler(e)}
                              className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                            >
                              {plug}
                            </p>
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="font-medium">Color:</h2>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="group inline-flex justify-center items-center text-md font-medium text-gray-700 hover:text-gray-900">
                      {productColor}
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {colors?.map((color, colorIdx) => (
                          <Menu.Item key={color + colorIdx} id={color}>
                            <p
                              onClick={(e) => colorHandler(e)}
                              className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                            >
                              {color}
                            </p>
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="sm:flex-col1 mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-dark-blue py-3 px-8 text-base font-medium text-white hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  onClick={(e) => addToCart(e)}
                >
                  Add to cart
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
