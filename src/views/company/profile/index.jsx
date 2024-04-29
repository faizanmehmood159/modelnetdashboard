import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import General from "./components/General";
import Upload from "./components/Upload";
import { getCompanyDetails } from "api/company/profile";
import SocialMedia from "./components/SocialMedia";
import CompanyProfile from "./CompanyProfile";

const ProfileOverview = () => {
  const [companyDetails, setCompanyDetails] = useState(null);
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getCompanyDetails();
        setCompanyDetails(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanyDetails();
  }, []);
  return (
    <div className="mt-4 flex w-full flex-col gap-5">
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner profileData={companyDetails} />
        </div>

        <div className="col-span-3 lg:!mb-0">
          <SocialMedia socialMediaData={companyDetails} />
        </div>

        <div className="z-0 col-span-5 lg:!mb-0">
          <CompanyProfile />
        </div>
      </div>
      {/* all project & ... */}

      <div className="h-full w-full">
        <div className="w-full">
          {/* <General detailsData={companyDetails} /> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
