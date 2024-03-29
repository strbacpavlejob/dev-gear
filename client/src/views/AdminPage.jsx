import React, { useState } from "react";
import AdminForm from "../components/AdminForm";
import NavBar from "../components/NavBar";
import ProductTable from "../components/ProductTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Navigate } from "react-router-dom";
const AdminPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  if (!(sessionStorage.getItem("isAdmin") === "true")) {
    return <Navigate to="/user/login" replace />;
  }

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 items-center">
        <div className="content-center justify-end flex mt-5 mr-5">
          <div
            className="cursor-pointer mb-10  max-w-md flex items-center justify-center rounded-md border border-transparent bg-dark-blue px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-light-blue"
            onClick={() => {
              setOpenModal(true);
              setCurrentProductId(null);
            }}
          >
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
            <span>Add product</span>
          </div>
        </div>
        <div className="flex flex-1">
          <ProductTable
            setCurrentProductId={setCurrentProductId}
            setOpenModal={setOpenModal}
          />
          <AdminForm
            openModal={openModal}
            setOpenModal={setOpenModal}
            productId={currentProductId}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
