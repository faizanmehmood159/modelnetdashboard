import Widget from "components/widget/Widget";
import { getStats } from "api/admin/stats";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { BsGlobe, BsQuestionCircle } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import Users from "./components/Users";
import Complaints from "./components/Complaints";

const MainDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getStats();
        setStatsData(response.data.data);
        console.log(statsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanyDetails();
  }, []);

  return (
    <div>
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-6">
        <Widget
          icon={<FiUsers className="h-7 w-7" />}
          title={"Total Users"}
          subtitle={statsData?.totalUsers}
        />
        <Widget
          icon={<BsGlobe className="h-6 w-6" />}
          title={"Total Connections"}
          subtitle={statsData?.totalInstallation}
        />
        <Widget
          icon={<BsQuestionCircle className="h-6 w-6" />}
          title={"Total Complaints"}
          subtitle={statsData?.totalComplaints}
        />
        <Widget
          icon={<TiTick className="h-7 w-7" />}
          title={"Resolved Complaints"}
          subtitle={statsData?.totalResolvedComplaints}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Users users={statsData} />
        <Complaints
          complaints={statsData}
        />
      </div>

      {/* Tables & Charts */}
    </div>
  );
};

export default MainDashboard;
