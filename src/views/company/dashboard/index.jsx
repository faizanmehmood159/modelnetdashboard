import { MdBarChart, MdLocationCity } from "react-icons/md";
import Widget from "components/widget/Widget";
import { getStats } from "api/admin/stats";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { companyStats } from "api/company/stats";
import { HiOutlineCursorClick } from "react-icons/hi";
import Card from "components/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const totalLocations = statsData?.registrationsLocations?.length;

  useEffect(() => {
    const adminType = localStorage.getItem("adminType") || "";
    if (adminType === "companyUser") {
      navigate("/company/jobs");
    }
  }, []);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getStats();
        setStatsData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    const getCompanyStats = async () => {
      try {
        const response = await companyStats();
        console.log(response.data.data);
        setLoading(false);

        setCompanyData(response.data.data);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    getCompanyStats();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="mt-10 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
            <Widget
              icon={<FiUsers className="h-7 w-7" />}
              title={"Total Users"}
              subtitle={companyData?.totalUsers}
            />
            <Widget
              icon={<HiOutlineCursorClick className="h-6 w-6" />}
              title={"Total Clicks"}
              subtitle={companyData?.totalclicks[0]?.click}
            />
          </div>

          {/* Charts */}

          <div className="mt-5 flex w-full items-center justify-center">
            <Card extra={" h-full p-4 overflow-y-auto  max-h-[70vh] "}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {companyData?.totalJobClicks.map((jobClick, index) => (
                  <div
                    key={index}
                    className="m-2 w-full whitespace-nowrap rounded-xl bg-[#F4F7FE]  p-4 shadow-md"
                  >
                    <p className="mb-2 text-lg font-semibold">
                      Occupation Name:{" "}
                      <span className=" text-lg font-normal">
                        {jobClick.occupationName}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Clicks:{" "}
                      <span className="text-lg font-semibold text-brand-50">
                        {jobClick.clicks}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {/* Tables & Charts */}
    </div>
  );
};

export default Dashboard;
