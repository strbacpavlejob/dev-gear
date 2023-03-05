import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import QuickView from "./QuickView";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const TrendingProduct = (props) => {
  const [hoverIdx, setHoverIdx] = useState([]);
  const [quickViewIdx, setQuickViewIdx] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/products/filter", { limit: 4 })
      .then((res) => {
        const allProducts = res.data;
        setProducts(allProducts.slice(0, 4));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:8000/products/filter", { limit: 4 })
      .then((res) => {
        const hoverArr = [];
        const allProducts = res.data.products;
        const filteredProducts = [];
        for (let i = 0; i < res.data.products.length; i++) {
          if (allProducts[i].categories.includes("Featured")) {
            filteredProducts.push(allProducts[i]);
            hoverArr.push(false);
          }
        }
        setProducts(filteredProducts);
        setHoverIdx([...hoverArr]);
        setQuickViewIdx([...hoverArr]);
      })
      .catch((err) => console.log(err));
  }, []);

  const hover = (i) => {
    hoverIdx[i] = !hoverIdx[i];
    setHoverIdx([...hoverIdx]);
  };

  const quickView = (i) => {
    quickViewIdx[i] = !quickViewIdx[i];
    setQuickViewIdx([...quickViewIdx]);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-blue">
            Trending Products
          </h2>
          <div className="ml-4 flow-root lg:ml-6">
            <div className="flex flex-1 flex-row justify-center items-center w-20">
              <a
                href="/products/view-all"
                className="hidden mb:invisible flex-1 text-sm font-medium text-blue pr-1 md:block"
              >
                Show all
              </a>
              <ArrowRightIcon
                className="hidden mb:invisible text-sm font-medium text-blue w-5 h-5 md:block"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {products.map((product, i) => (
            <div key={i}>
              <div
                onMouseOver={() => hover(i)}
                onMouseOut={() => hover(i)}
                className="relative"
              >
                <Link
                  to={"/products/" + product._id}
                  className="group relative"
                >
                  <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img
                      src={product.imgUrls[0]}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </Link>
                {hoverIdx[i] === true ? (
                  <button
                    onClick={() => quickView(i)}
                    className=" absolute z-10 bottom-5 left-9 p-3 bg-dark-blue text-white w-3/4 rounded-lg hover:bg-light-blue"
                  >
                    Quick View
                  </button>
                ) : (
                  ""
                )}
              </div>
              <Link to={"/products/" + product._id}>
                <h3 className="mt-4 text-sm font-medium text-gray-700">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-blue">
                  {product.categories[0]}
                </p>
                <p className="mt-1 text-md font-medium text-dark-blue">
                  ${product.price}
                </p>
              </Link>
              {
                <QuickView
                  quickView={quickView}
                  isOpen={
                    quickViewIdx[i]
                      ? (quickViewIdx[i] = false)
                      : (quickViewIdx[i] = true)
                  }
                  idx={i}
                  product={product}
                  productSizes={product.plug}
                />
              }
            </div>
          ))}
        </div>
        <div className="mt-8 text-sm md:hidden">
          <div className="flex flex-1 flex-row justify-center items-center w-20">
            <a href="#" className="flex-1 text-sm font-medium text-blue  pr-1">
              Show all
            </a>
            <ArrowRightIcon
              className="text-sm font-medium text-blue  w-5 h-5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProduct;
