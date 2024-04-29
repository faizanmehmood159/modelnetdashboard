import { IoCloseCircle } from "react-icons/io5";
import { MdBarChart, MdLocationCity } from "react-icons/md";
import Widget from "components/widget/Widget";
import { getStats } from "api/admin/stats";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { BsBuilding, BsGlobe, BsQuestionCircle } from "react-icons/bs";
import { RiAccountPinCircleLine } from "react-icons/ri";
import MostSelected from "./components/MostSelected";
import { FaLuggageCart } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import RegistrationLocation from "./components/RegistrationLocations";

const MainDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const totalLocations = statsData?.registrationsLocations?.length || 0;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getStats();
        setStatsData(response.data.data);
        console.log(response.data.data);
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
          subtitle={statsData?.totalCompanies}
        />
        <Widget
          icon={<BsQuestionCircle className="h-6 w-6" />}
          title={"Total Complaints"}
          subtitle={statsData?.approveCompany !== undefined ? statsData?.approveCompany : "0"}
        />
        <Widget
          icon={<TiTick className="h-7 w-7" />}
          title={"Resolved Complaints"}
          subtitle={statsData?.totalUsers + statsData?.totalCompanies}
        />
        {/* <Widget
          icon={<MdLocationCity className="h-6 w-6" />}
          title={"Registration Locations"}
          subtitle={totalLocations}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Appointments Accepted"}
          subtitle={
            statsData?.appointmentAccepted[0]?.isApproved
              ? statsData?.appointmentAccepted[0]?.count
              : "0"
          }
        />
        <Widget
          icon={<IoCloseCircle className="h-6 w-6" />}
          title={"Appointments Decline"}
          subtitle={
            statsData?.appointmentDecline[1]?.isReject
              ? statsData?.appointmentDecline[1]?.count
              : "0"
          }
        />
        <Widget
          icon={<FaLuggageCart className="h-6 w-6" />}
          title={"Not Arrived at Appointment"}
          subtitle={statsData?.notArrivedAtAppointment[0]?.count}
        /> */}
      </div>

      {/* Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <MostSelected topCompanies={statsData?.mostSelectedCompany} />
        <RegistrationLocation
          registrationLocations={statsData?.registrationsLocations}
        />
      </div> */}

      {/* Tables & Charts */}
    </div>
  );
};

export default MainDashboard;
