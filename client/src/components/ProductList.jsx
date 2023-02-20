import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QuickView from "./QuickView";

const ProductList = (props) => {
  const [hoverIdx, setHoverIdx] = useState([]);
  const [quickViewIdx, setQuickViewIdx] = useState([]);

  useEffect(() => {
    const hoverArr = [];
    for (let i in props.allProducts) {
      hoverArr.push(false);
    }
    setHoverIdx([...hoverArr]);
    setQuickViewIdx([...hoverArr]);
  }, [props.allProducts]);

  const hover = (i) => {
    hoverIdx[i] = !hoverIdx[i];
    setHoverIdx([...hoverIdx]);
  };

  const quickView = (i) => {
    // e.preventDefault();
    quickViewIdx[i] = !quickViewIdx[i];
    setQuickViewIdx([...quickViewIdx]);
    console.log("is it working?");
    console.log(quickViewIdx);
  };

  return (
    <div className="bg-white lg:h-screen">
      <div className="mx-auto max-w-7xl overflow-hidden py-16 px-4 sm:py-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {props.allProducts.map((product, i) => {
            return (
              <div key={i} className=" text-sm">
                <div
                  onMouseOver={() => hover(i)}
                  onMouseOut={() => hover(i)}
                  className="relative"
                >
                  <Link to={"/product/" + product._id} className="group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 ">
                      <img
                        src={product.imgUrls[0]}
                        alt={"product imageAlt"}
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
                <Link to={"/product/" + product._id}>
                  <h3 className="mt-4 font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="italic text-blue">{product.brand}</p>
                  <p className="mt-2 font-medium text-dark-blue">
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
