import { Fragment, useCallback, useState } from "react";
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
import axios from "axios";

const SideBar = (props) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [loaded, setLoaded] = useState("");

  const [filterQuery, setFilterQuery] = useState({
    sort: "name",
    order: "asc",
  });
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");

  const filterItems = [
    {
      id: "itemTypes",
      name: "Product Type",
      options: [
        { value: "Laptop", label: "Laptop", checked: false },
        { value: "Smartphone", label: "Smartphone", checked: false },
        { value: "Tablet", label: "Tablet", checked: false },
      ],
    },
    {
      id: "brands",
      name: "Brand",
      options: [
        { value: "Lenovo", label: "Lenovo", checked: false },
        { value: "Apple", label: "Apple", checked: false },
        { value: "Samsung", label: "Samsung", checked: false },
      ],
    },
    {
      id: "categories",
      name: "Category",
      options: [
        { value: "Work", label: "Work", checked: false },
        { value: "Gaming", label: "Gaming", checked: false },
        { value: "Everyday", label: "Everyday", checked: false },
      ],
    },
    {
      id: "plugs",
      name: "Plug",
      options: [
        { value: "EU", label: "EU", checked: false },
        { value: "UK", label: "UK", checked: false },
        { value: "US", label: "US", checked: false },
      ],
    },
    {
      id: "colors",
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

  const normalizeQuery = () => {
    const tempFilterQuery = filterQuery;
    for (const key in tempFilterQuery) {
      if (Array.isArray(tempFilterQuery[key]) && !tempFilterQuery[key].length)
        delete tempFilterQuery[key];
    }
    setFilterQuery(tempFilterQuery);
  };

  useEffect(() => {
    setLoaded(false);
    axios
      .post("http://localhost:8000/product/filter", filterQuery)
      .then((res) => {
        setAllProducts(res.data);
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleApplyFilters = () => {
    setLoaded(false);
    normalizeQuery();
    console.log(filterQuery);
    axios
      .post("http://localhost:8000/product/filter", filterQuery)
      .then((res) => {
        console.log(`Data filtred ${JSON.stringify(res.data)}`);
        setAllProducts(res.data);
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  const generateFilterSection = (section, onChangeFilter) => {
    return (
      <>
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
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        className="h-4 w-4 rounded border-gray-300 text-dark-blue focus:ring-blue"
                        onClick={(e) => onChangeFilter(e, section.id)}
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
      </>
    );
  };

  const handleChangeFilter = useCallback(
    (e, filterName) => {
      if (e.target.checked) {
        setFilterQuery((oldValue) => {
          return {
            ...oldValue,
            [filterName]: [...new Set(oldValue[filterName]), e.target.value],
          };
        });
      } else {
        setFilterQuery((oldValue) => {
          return {
            ...oldValue,
            [filterName]: [...new Set(oldValue[filterName])].filter(
              (item) => item !== e.target.value
            ),
          };
        });
      }
    },
    [filterQuery]
  );

  const handleSort = useCallback(
    (sortBy, orderBy) => {
      setSort(sortBy);
      setOrder(orderBy);
      setFilterQuery({
        ...filterQuery,
        sort,
        order,
      });
    },
    [sort, order]
  );

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

                  {/* Filters  mobile*/}
                  <form className="m-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <div
                      className=" m-4 flex items-center justify-center rounded-md border border-transparent bg-dark-blue px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-light-blue"
                      onClick={() => handleApplyFilters()}
                    >
                      Apply Filters
                    </div>
                    <>
                      {filterItems.map((item) => {
                        return generateFilterSection(item, handleChangeFilter);
                      })}
                    </>
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
                          onClick={(e) => handleSort("name", "asc")}
                          className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                        >
                          Name: A to Z
                        </p>
                      </Menu.Item>
                      <Menu.Item>
                        <p
                          onClick={(e) => handleSort("name", "dsc")}
                          className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                        >
                          Name: Z to A
                        </p>
                      </Menu.Item>
                      <Menu.Item id="low">
                        <p
                          onClick={(e) => handleSort("price", "asc")}
                          id="low"
                          className="block px-4 py-2 text-sm cursor-pointer hover:bg-light-blue hover:text-white"
                        >
                          Price: Low to High
                        </p>
                      </Menu.Item>
                      <Menu.Item id="high">
                        <p
                          onClick={(e) => handleSort("price", "dsc")}
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
              {/* Filters  LG */}
              <div>
                <form className="hidden lg:block sticky top-0">
                  <h3 className="sr-only">Categories</h3>
                  <div
                    className=" mb-10 flex items-center justify-center rounded-md border border-transparent bg-dark-blue px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-light-blue"
                    onClick={() => handleApplyFilters()}
                  >
                    Apply Filters
                  </div>
                  <>
                    {filterItems.map((item) => {
                      return generateFilterSection(item, handleChangeFilter);
                    })}
                  </>
                </form>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3 lg:pb-48  ">
                {loaded && <ProductList allProducts={allProducts} />}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SideBar;
