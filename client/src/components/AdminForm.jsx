import React, { useState } from "react";
import axios from "axios";
import { filterItems } from "../common/filterdata";

const AdminForm = (props) => {
  const token = sessionStorage.getItem("sessionToken");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  //Product States
  const [productType, setProductType] = useState(
    filterItems[0].options[0].value
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plugType, setPlugType] = useState([filterItems[3].options[0].value]);
  const [imgUrls, setImgUrls] = useState([]);
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [brand, setBrand] = useState(filterItems[1].options[0].value);
  const [categories, setCategories] = useState([
    filterItems[2].options[0].value,
  ]);
  const [colors, setColors] = useState([filterItems[4].options[0].value]);
  const [price, setPrice] = useState(100);

  const putImagesTogether = () => {
    const tempArray = [img1, img2, img3, img4];
    setImgUrls([...tempArray]);
  };

  const convertOptionToArray = (selectedOptions) => {
    const tempArr = Array.from(selectedOptions);
    return tempArr.map((item) => item.value);
  };

  const resetForm = () => {
    setProductType(filterItems[0].options[0].value);
    setName("");
    setDescription("");
    setPlugType([filterItems[3].options[0].value]);
    setImgUrls([]);
    setImg1("");
    setImg2("");
    setImg3("");
    setImg4("");
    setBrand(filterItems[1].options[0].value);
    setCategories([filterItems[2].options[0].value]);
    setColors([filterItems[4].options[0].value]);
    setPrice(100);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/products",
        {
          itemType: productType,
          brand,
          name,
          description,
          categories: categories,
          plug: plugType,
          colors: colors,
          imgUrls,
          price: price,
        },
        config
      )
      .then(() => {
        resetForm();
      });
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
                defaultValue={filterItems[0].options[0].value}
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setProductType(e.target.value);
                }}
                id="product-type"
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
                defaultValue={filterItems[1].options[0].value}
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
                id="product-brand"
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
                id="product-name"
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
                id="product-description"
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
                defaultValue={filterItems[2].options[0].value}
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setCategories(convertOptionToArray(e.target.selectedOptions));
                }}
                id="categories"
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
                defaultValue={filterItems[3].options[0].value}
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setPlugType(convertOptionToArray(e.target.selectedOptions));
                }}
                id="plug-type"
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
                defaultValue={filterItems[4].options[0].value}
                multiple
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  setColors(convertOptionToArray(e.target.selectedOptions));
                }}
                id="colors"
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
                onChange={(e) => setPrice(parseInt(e.target.value))}
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
            onClick={putImagesTogether}
            className="bg-dark-blue hover:bg-light-blue text-white rounded-md p-2"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
