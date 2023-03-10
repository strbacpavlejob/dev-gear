import React from "react";
import AdminForm from "../components/AdminForm";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PorductTable from "../components/ProductTable";

const AdminPage = () => {
  return (
    <div>
      <NavBar />
      <PorductTable />
      <AdminForm />
      <Footer />
    </div>
  );
};

export default AdminPage;
