import React, { useState, useEffect } from "react";
import axios from "axios";
import { filterItems } from "../common/filterdata";

const AdminForm = (props) => {
  const [listProducts, setListProducts] = useState([]);
  const [stripeProductId, setStripeProductId] = useState("");
  const [listOfPricedProducts, setListOfPricedProducts] = useState([]);
  const [pricedStripeProduct, setPricedStripeProduct] = useState("");
  const [pricedDBName, setPricedDBName] = useState("");
  const token = sessionStorage.getItem("sessionToken");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/stripes/products")
      .then((res) => {
        const holdResponse = res.data.data;
        const result = [];
        const pricedArr = [];
        for (let i = 0; i < holdResponse.length; i++) {
          if (holdResponse[i].default_price === null) {
            result.push(holdResponse[i]);
          } else if (
            holdResponse[i].default_price != null &&
            holdResponse[i].active != false
          ) {
            pricedArr.push(holdResponse[i]);
          }
        }
        setStripeProductId([...result][0].id);
        setListProducts([...result]);
        setDbName(result[0].name);
        setPricedDBName(pricedArr[0].name);
        setPricedStripeProduct([...pricedArr][0].id);
        setListOfPricedProducts([...pricedArr]);
      })
      .catch((err) => console.error(err));
  }, []);

  //Product States
  const [productType, setProductType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plugType, setPlugType] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [mongoPrice, setMongoPrice] = useState("");

  //Price States
  const [stripePrice, setStripePrice] = useState("");
  const [price, setPrice] = useState(100);

  //Database states
  const [dbName, setDbName] = useState("");

  const putImagesTogether = () => {
    const tempArray = [img1, img2, img3, img4];
    setImgUrls([...tempArray]);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    putImagesTogether();
    console.log(`config ${JSON.stringify(config)}`);
    axios
      .post(
        "http://localhost:8000/product",
        {
          itemType: productType,
          brand,
          name,
          description,
          categories: categories.split(","),
          plug: plugType.split(","),
          colors: colors.split(","),
          imgUrls,
          price: parseInt(price),
        },
        config
      )
      .then((res) => {
        axios
          .post("http://localhost:8000/stripes/products", {
            name,
            description,
            images: imgUrls,
          })
          .then((res) => {
            setProductType("");
            setName("");
            setDescription("");
            setBrand("");
            setPlugType("");
            setImg1("");
            setImg2("");
            setImg3("");
            setImg4("");
            setPrice("");
            setColors([]);
            setCategories([]);
            setImgUrls([]);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.error(err));
  };

  const priceSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/stripes/prices", {
        stripePrice: parseInt(stripePrice),
        stripeProductId,
      })
      .then((res) => {
        const stripePriceId = res.data.id;
        axios
          .patch("http://localhost:8000/stripes/products/" + stripeProductId, {
            default_price: stripePriceId,
          })
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
        axios
          .get(`http://localhost:8000/products/name/${dbName}`)
          .then((res) => {
            axios
              .patch("http://localhost:8000/products/" + res.data._id, {
                price: mongoPrice,
              })
              .then((res) => {
                setStripePrice("");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const archiveProductHandler = (e) => {
    e.preventDefault();
    axios
      .patch("http://localhost:8000/stripes/archives/" + pricedStripeProduct)
      .then((res) => {
        axios
          .get(`http://localhost:8000/products/name/${pricedDBName}`)
          .then((res) => {
            axios
              .delete("http://localhost:8000/products/" + res.data._id)
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex w-2/3 mx-auto my-10 justify-center">
      <div className="w-1/2">
        <h2 className="text-center text-2xl">Add a Product</h2>
        <form
          className="mx-auto border p-3 rounded-md mt-2"
          onSubmit={onSubmitHandler}
        >
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Product Type:
            </label>
            <div>
              <select
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setProductType(e.target.value);
                }}
                id="product-name"
              >
                {filterItems[0].options.map((option, i) => {
                  return (
                    <option key={i} value={option.value} name={option.label}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Product Brand:
            </label>
            <div>
              <select
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
                id="product-name"
              >
                {filterItems[1].options.map((option, i) => {
                  return (
                    <option key={i} value={option.value} name={option.label}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Product Name:
            </label>
            <div>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Product Description:
            </label>
            <div>
              <textarea
                className="w-full border rounded-md p-2"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Categories:
            </label>
            <div>
              <select
                multiple
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  console.log(e.target.value);
                  console.log(categories);
                }}
                id="product-name"
              >
                {filterItems[2].options.map((option, i) => {
                  return (
                    <option key={i} value={option.value} name={option.label}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Plug Type:
            </label>
            <div>
              <select
                multiple
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setPlugType(e.target.value);
                }}
                id="product-name"
              >
                {filterItems[3].options.map((option, i) => {
                  return (
                    <option key={i} value={option.value} name={option.label}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Colors:
            </label>
            <div>
              <select
                multiple
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setColors(e.target.value);
                }}
                id="product-name"
              >
                {filterItems[4].options.map((option, i) => {
                  return (
                    <option key={i} value={option.value} name={option.label}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Price:
            </label>
            <div>
              <input
                min={1}
                type="number"
                className="w-full border rounded-md p-2"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Image URL 1:
            </label>
            <div>
              <input
                id="img1"
                type="text"
                className="w-full border rounded-md p-2"
                onChange={(e) => setImg1(e.target.value)}
                value={img1}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Image URL 2:
            </label>
            <div>
              <input
                id="img2"
                type="text"
                className="w-full border rounded-md p-2"
                onChange={(e) => setImg2(e.target.value)}
                value={img2}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Image URL 3:
            </label>
            <div>
              <input
                id="img3"
                type="text"
                className="w-full border rounded-md p-2"
                onChange={(e) => setImg3(e.target.value)}
                value={img3}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="" className="col-form-label">
              Image URL 4:
            </label>
            <div>
              <input
                id="img4"
                type="text"
                className="w-full border rounded-md p-2"
                onChange={(e) => setImg4(e.target.value)}
                value={img4}
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={() => putImagesTogether()}
            className="bg-dark-blue hover:bg-light-blue text-white rounded-md p-2"
          >
            Create Product
          </button>
        </form>
      </div>

      <div className="w-1/2">
        <div>
          <h2 className="text-center text-2xl mt-5">Add a price</h2>
          <form
            className="mx-auto w-1/2 border p-3 mt-2"
            onSubmit={priceSubmitHandler}
          >
            <div className="mb-3 row">
              <label htmlFor="" className="col-form-label">
                Price of Product:
              </label>
              <div>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  onChange={(e) => {
                    setStripePrice(e.target.value);
                    setMongoPrice(e.target.value);
                  }}
                  value={stripePrice}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="" className="col-form-label">
                Products:
              </label>
              <div>
                <select
                  className="w-full border rounded-md p-2"
                  onChange={(e) => {
                    setStripeProductId(e.target.value.split("@")[0]);
                    setDbName(e.target.value.split("@")[1]);
                  }}
                  id="product-name"
                >
                  {listProducts.map((option, i) => {
                    return (
                      <option
                        key={i}
                        value={`${option.id}@${option.name}`}
                        name={option.name}
                      >
                        {option.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-dark-blue py-3 px-8 text-base font-medium text-white hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
            >
              Create Product Price
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-center text-2xl mt-5">Delete a Product</h2>
          <form
            className="mx-auto w-1/2 border p-3 mt-2"
            onSubmit={archiveProductHandler}
          >
            <div className="mb-3 row">
              <label htmlFor="" className="col-form-label">
                List of Products:
              </label>
              <div>
                <select
                  className="w-full border rounded-md p-2"
                  onChange={(e) => {
                    setPricedStripeProduct(e.target.value.split("@")[0]);
                    setPricedDBName(e.target.value.split("@")[1]);
                  }}
                >
                  {listOfPricedProducts.map((option, i) => {
                    return (
                      <option
                        key={i}
                        value={`${option.id}@${option.name}`}
                        name={option.name}
                      >
                        {option.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-dark-blue hover:bg-light-blue text-white rounded-md p-2"
            >
              Delete Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
