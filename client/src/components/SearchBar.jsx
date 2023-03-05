import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const SearchBar = ({ openSearch, setOpenSearch }) => {
  const [searchedWords, setSearchedWords] = useState("");
  const handleSearchWordsSubmit = () => {
    window.location.replace(
      `/products/view-all${
        searchedWords === "" ? "" : `?searchedWords=${searchedWords}`
      }`
    );
  };

  return (
    <Transition.Root show={openSearch} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenSearch}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden md:inline-block md:h-screen md:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="flex flex-1 relative w-full items-center rounded-3xl bg-white px-2 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <div class="flex flex-1 relative text-gray-600">
                    <input
                      type="search"
                      name="serch"
                      placeholder="Search"
                      class="bg-white flex-1 h-10 px-5 pr-10 rounded-full lg:text-lg sm:text-sm focus:outline-none"
                      onChange={(e) => setSearchedWords(e.target.value)}
                    />
                    <button
                      type="submit"
                      class="absolute right-0 top-0 mt-3 mr-4"
                      onClick={handleSearchWordsSubmit}
                    >
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 56.966 56.966"
                        xmlSpace="preserve"
                        width="512px"
                        height="512px"
                      >
                        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SearchBar;
