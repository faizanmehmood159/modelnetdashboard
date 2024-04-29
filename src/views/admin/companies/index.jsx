import React from "react";
import CompaniesApprove from "./CompaniesApprove";
import AddCompany from "./AddCompany";

const Companies = () => {
  return (
    <div className="mt-6">
      <div>
        <AddCompany />
      </div>
      <CompaniesApprove />
    </div>
  );
};

export default Companies;
