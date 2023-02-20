import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import ProductList from "./ProductList";
import React, { useEffect } from "react";
import axios, { all } from "axios";

const subCategories = [{ name: "Reset filters", href: "/product/view-all" }];
const productTypes = [
  { name: "Laptops", href: "#" },
  { name: "Smartphones", href: "#" },
  { name: "Tablets", href: "#" },
];

const colors = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "White", label: "White", checked: false },
      { value: "Black", label: "Black", checked: false },
      { value: "Blue", label: "Blue", checked: false },
      { value: "Red", label: "Red", checked: false },
      { value: "Green", label: "Green", checked: false },
      { value: "Purple", label: "Purple", checked: false },
    ],
  },
];
const categories = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "Work", label: "Work", checked: false },
      { value: "Gaming", label: "Gaming", checked: false },
      { value: "Everyday", label: "Everyday", checked: false },
    ],
  },
];

const plugs = [
  {
    id: "plug",
    name: "Plug",
    options: [
      { value: "EU", label: "EU", checked: false },
      { value: "UK", label: "UK", checked: false },
      { value: "US", label: "US", checked: false },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SideBar = (props) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [loaded, setLoaded] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/product")
      .then((res) => {
        setAllProducts(res.data);
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleColor = (e, index) => {
    axios
      .get("http://localhost:8000/product")
      .then((res) => {
        const products = res.data.products;

        if (colors[0].options[index].value === e.target.value) {
          colors[0].options[index].checked = !colors[0].options[index].checked;
        } else if (categories[0].options[index].value === e.target.value) {
          categories[0].options[index].checked =
            !categories[0].options[index].checked;
        }

        let filterByColor = colorFilter(products);
        let filterByCat = categoryFilter(filterByColor);

        filterByCat.length < 1
          ? setAllProducts(products)
          : setAllProducts(filterByCat);
      })
      .catch((err) => console.error(err));
  };

  const colorFilter = (arr) => {
    let trueColors = [];
    let anotherArr = [];
    for (let i = 0; i < colors[0].options.length; i++) {
      let checkedColor = colors[0].options[i];
      if (checkedColor.checked) {
        trueColors.push(checkedColor.value);
      }
    }

    if (trueColors.length < 1) {
      return arr;
    }

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < trueColors.length; j++) {
        if (arr[i].colors.includes(trueColors[j])) {
          anotherArr.push(arr[i]);
        }
      }
    }
    return anotherArr;
  };

  const categoryFilter = (arr) => {
    let trueCategories = [];
    const finalObj = {};

    for (let i = 0; i < categories[0].options.length; i++) {
      let checkedCats = categories[0].options[i];
      if (checkedCats.checked) {
        trueCategories.push(checkedCats.value);
      }
    }

    if (trueCategories.length < 1) {
      return arr;
    }

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < trueCategories.length; j++) {
        if (finalObj[i]) continue;
        if (arr[i].categories.includes(trueCategories[j])) {
          finalObj[i] = arr[i];
        }
      }
    }
    return Object.values(finalObj);
  };

  const handleName = (arr) => {
    arr.sort((a, b) => {
      let strA = a.name.toLowerCase();
      let strB = b.name.toLowerCase();
      if (strA < strB) {
        return -1;
      } else if (strA > strB) {
        return 1;
      }
      return 0;
    });
    setAllProducts([...arr]);
  };

  const handlePrice = (e, arr) => {
    if (e.target.id === "low") {
      arr.sort((a, b) => a.price - b.price);
    } else {
      arr.sort((a, b) => b.price - a.price);
    }
    setAllProducts([...arr]);
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul
                      role="list"
                      className="px-2 py-3 font-medium text-gray-900"
                    >
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <a href={category.href} className="block px-2 py-3">
                            {category.name}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {colors.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-dark-blue focus:ring-blue"
                                      onClick={(e) => handleColor(e, optionIdx)}
                                    />
                                    <label
                                      htmlFor={`filter-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}

                    {categories.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-dark-blue focus:ring-blue"
                                      onClick={(e) => handleColor(e, optionIdx)}
                                    />
                                    <label
                                      htmlFor={`filter-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between  pt-6 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-dark-blue">
              All Products
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        <p
                          onClick={() => handleName(allProducts)}
                          className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                        >
                          Alphabetically A-Z
                        </p>
                      </Menu.Item>
                      <Menu.Item id="low">
                        <p
                          onClick={(e) => handlePrice(e, allProducts)}
                          id="low"
                          className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                        >
                          Price: Low to High
                        </p>
                      </Menu.Item>
                      <Menu.Item id="high">
                        <p
                          onClick={(e) => handlePrice(e, allProducts)}
                          id="high"
                          className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                        >
                          Price: High to Low
                        </p>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div>
                <form className="hidden lg:block sticky top-0">
                  <h3 className="sr-only">Categories</h3>
                  <ul
                    role="list"
                    className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                  >
                    {subCategories.map((category) => (
                      <li key={category.name}>
                        <a href={category.href}>{category.name}</a>
                      </li>
                    ))}
                  </ul>

                  {colors.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-dark-blue focus:ring-blue"
                                    onClick={(e) => handleColor(e, optionIdx)}
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}

                  {categories.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-dark-blue focus:ring-blue"
                                    onClick={(e) => handleColor(e, optionIdx)}
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3 lg:pb-48  ">
                {/* Replace with your content */}
                {/* <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 lg:h-full" /> */}
                {/* need to put product stuff in here */}
                {loaded && <ProductList allProducts={allProducts} />}
                {/* /End replace */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SideBar;
