import { Fragment, useState, useContext, useEffect } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ProductContext from "../context/ProductContext";
import SlidingCart from "./SlidingCart";
import SearchBar from "./SearchBar";

const navigation = {
  categories: [
    {
      id: "all",
      name: "Shop All",
      featured: [
        {
          name: "Trending",
          href: "/products/view-all",
          imageSrc:
            "https://images.unsplash.com/photo-1634042148057-32603ec95d95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          imageAlt: "",
          p: "",
        },
        {
          name: "New Arrivals",
          href: "/products/view-all",
          imageSrc:
            "https://images.unsplash.com/photo-1587614297882-0954a02d57f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          imageAlt: "",
          p: "",
        },
      ],
      sections: [
        {
          id: "products",
          name: "Products",
          items: [
            { name: "All Products", href: "/products/view-all" },
            { name: "Laptops", href: "/products/view-all?itemTypes=Laptop" },
            {
              name: "Smartphones",
              href: "/products/view-all?itemTypes=Smartphone",
            },
            { name: "Tablets", href: "/products/view-all?itemTypes=Tablet" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Apple", href: "/products/view-all?brands=Apple" },
            { name: "Lenovo", href: "/products/view-all?brands=Lenovo" },
            { name: "Microsoft", href: "/products/view-all?brands=Microsoft" },
            { name: "Samsung", href: "/products/view-all?brands=Samsung" },
            { name: "Xiaomi", href: "/products/view-all?brands=Xiaomi" },
          ],
        },
      ],
    },
    {
      id: "laptops",
      name: "Laptops",
      featured: [
        {
          name: "Trending",
          href: "/products/view-all?itemTypes=Laptop",
          imageSrc:
            "https://images.unsplash.com/photo-1593642633279-1796119d5482?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
          imageAlt: "",
        },
        {
          name: "New Arrivals",
          href: "/products/view-all?itemTypes=Laptop",
          imageSrc:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
          imageAlt: "",
        },
      ],
      sections: [
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Acer", href: "#" },
            { name: "Apple", href: "#" },
            { name: "Dell", href: "#" },
            { name: "HP", href: "#" },
            { name: "Lenovo", href: "#" },
          ],
        },
        {
          id: "categories",
          name: "Categories",
          items: [
            {
              name: "Everyday",
              href: "/products/view-all?categories=Everyday&itemTypes=Laptop",
            },
            {
              name: "Work",
              href: "/products/view-all?categories=Work&itemTypes=Laptop",
            },
            {
              name: "Gaming",
              href: "/products/view-all?categories=Gaming&itemTypes=Laptop",
            },
          ],
        },
      ],
    },
    {
      id: "smartphones",
      name: "Smartphones",
      featured: [
        {
          name: "Trending",
          href: "/products/view-all?itemTypes=Smartphone",
          imageSrc:
            "https://images.unsplash.com/photo-1614439071514-edee4ec26882?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
          imageAlt: "",
        },
        {
          name: "New Arrivals",
          href: "/products/view-all?itemTypes=Smartphone",
          imageSrc:
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          imageAlt: "",
        },
      ],
      sections: [
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Apple", href: "#" },
            { name: "Huawei", href: "#" },
            { name: "Nokia", href: "#" },
            { name: "Samsung", href: "#" },
            { name: "Xiaomi ", href: "#" },
          ],
        },
        {
          id: "categories",
          name: "Categories",
          items: [
            {
              name: "Everyday",
              href: "/products/view-all?categories=Everyday&itemTypes=Smartphone",
            },
            {
              name: "Work",
              href: "/products/view-all?categories=Work&itemTypes=Smartphone",
            },
            {
              name: "Gaming",
              href: "/products/view-all?categories=Gaming&itemTypes=Smartphone",
            },
          ],
        },
      ],
    },
    {
      id: "tablets",
      name: "Tablets",
      featured: [
        {
          name: "Trending",
          href: "/products/view-all?itemTypes=Tablet",
          imageSrc:
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          imageAlt: "",
        },
        {
          name: "New Arrivals",
          href: "/products/view-all?itemTypes=Tablet",
          imageSrc:
            "https://images.unsplash.com/photo-1622533950960-2ed47209dab0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1209&q=80",
          imageAlt: "",
        },
      ],
      sections: [
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Apple", href: "#" },
            { name: "Huawei", href: "#" },
            { name: "Lenovo", href: "#" },
            { name: "Samsung", href: "#" },
            { name: "Xiaomi ", href: "#" },
          ],
        },
        {
          id: "categories",
          name: "Categories",
          items: [
            {
              name: "Everyday",
              href: "/products/view-all?categories=Everyday&itemTypes=Tablet",
            },
            {
              name: "Work",
              href: "/products/view-all?categories=Work&itemTypes=Tablet",
            },
            {
              name: "Gaming",
              href: "/products/view-all?categories=Gaming&itemTypes=Tablet",
            },
          ],
        },
      ],
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = (props) => {
  const [openSearch, setOpenSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(true);

  const [loaded, setLoaded] = useState(false);

  const [userSession, setUserSession] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const numInCart = useContext(ProductContext).numInCart;

  const openCart = (slide) => {
    setLoaded(slide);
  };

  useEffect(() => {
    const newIsAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));
    setIsAdmin(newIsAdmin);
  }, [sessionStorage.getItem("isAdmin")]);

  useEffect(() => {
    if (sessionStorage.getItem("userInSession") === "null") {
      setUserSession(JSON.parse(sessionStorage.getItem("userInSession")));
    } else {
      setUserSession(sessionStorage.getItem("userInSession"));
    }
  }, [userSession]);

  const logoutHandler = (e) => {
    e.preventDefault();
    sessionStorage.setItem("userInSession", null);
    sessionStorage.setItem("sessionToken", null);
    sessionStorage.setItem("isAdmin", null);
    sessionStorage.setItem("isLogged", null);
    setIsAdmin(false);
    window.location.replace("/");
  };

  const handleSearchToggle = () => {
    let tempOpenSeach = openSearch;
    setOpenSearch(!tempOpenSeach);
  };

  return (
    <div className="bg-white sticky top-0 z-40">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
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
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}

                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <nav
                      class="-mb-px flex space-x-8 overflow-x-auto overflow-y-hidden"
                      aria-label="Tabs"
                    >
                      <Tab.List className="-mb-px flex space-x-8 px-4">
                        {navigation.categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? "text-dark-blue border-light-blue"
                                  : "text-gray-900 border-transparent",
                                "flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium"
                              )
                            }
                          >
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                    </nav>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-10 px-4 pt-10 pb-8"
                      >
                        <div className="grid grid-cols-2 gap-x-4">
                          {category.featured.map((item) => (
                            <div
                              key={item.name}
                              className="group relative text-sm"
                            >
                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <img
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="object-cover object-center"
                                />
                              </div>
                              <a
                                href={item.href}
                                className="mt-6 block font-medium text-gray-900"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                {item.p}
                              </p>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className="font-medium text-gray-900"
                            >
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <a
                                    href={item.href}
                                    className="-m-2 block p-2 text-gray-500"
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  <div className="flow-root">
                    {userSession ? (
                      <>
                        <p className="-m-2 block p-2 pb-8 font-medium text-gray-900">
                          Welcome, {userSession}
                        </p>
                        <span
                          className="h-6 w-px bg-gray-200 "
                          aria-hidden="true"
                        />
                        {isAdmin && (
                          <div className="flow-root">
                            <a
                              href="/admin"
                              className="-m-2 block p-2 pb-4 font-medium text-gray-900"
                            >
                              Admin Dashboard
                            </a>
                          </div>
                        )}
                        <button
                          className="-m-2 block p-2 pb-4 font-medium text-gray-900"
                          onClick={logoutHandler}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/register"
                          className="-m-2 block p-2 pb-4 font-medium text-gray-900"
                        >
                          Create account
                        </Link>
                        <span
                          className="h-6 w-px bg-gray-200 "
                          aria-hidden="true"
                        />
                        <Link
                          to="/user/login"
                          className="-m-2 block p-2 pb-4 font-medium text-gray-900"
                        >
                          Sign in
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <h1 className="text-2xl font-pirulen text-dark-blue">
                    DEV GEAR
                  </h1>
                </a>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-blue text-blue"
                                  : "border-transparent text-gray-700 hover:text-blue hover:border-blue",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500 z-10">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category.featured.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-cover object-center"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-6 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute inset-0 z-10"
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            {item.p}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className="font-medium text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            role="list"
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <a
                                                  href={item.href}
                                                  className="hover:text-gray-800"
                                                >
                                                  {item.name}
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6 ">
                  {isAdmin && (
                    <div className="flow-root">
                      <a
                        href="/admin"
                        className="text-sm font-medium hover:text-blue"
                      >
                        Admin Dashboard
                      </a>
                    </div>
                  )}
                  {userSession ? (
                    <>
                      <button
                        className="text-sm font-medium hover:text-blue"
                        onClick={logoutHandler}
                      >
                        Sign Out
                      </button>
                      <span
                        className="h-6 w-px bg-gray-200 "
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium">
                        Welcome, {userSession}
                      </p>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/user/login"
                        className="text-sm font-medium hover:text-blue"
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200 "
                        aria-hidden="true"
                      />
                      <Link
                        to="/register"
                        className="text-sm font-medium hover:text-blue "
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
                {/* Search */}
                <div className="flex lg:ml-6">
                  <div
                    onClick={() => setOpenSearch(true)}
                    className="p-2 text-gray-500 hover:text-blue"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <SearchBar
                  openSearch={openSearch}
                  setOpenSearch={setOpenSearch}
                />

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <div
                    onClick={() => openCart(true)}
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      className="h-6 w-6 flex-shrink-0 text-gray-500 group-hover:text-blue"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {numInCart}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                    <SlidingCart
                      openCart={openCart}
                      slideOpen={slideOpen}
                      setSlideOpen={setSlideOpen}
                      loaded={loaded}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
