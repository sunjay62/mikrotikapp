import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import ConfigureChartCard from "views/admin/default/components/ConfigureChartCard";
import ClientChartCard from "views/admin/default/components/ClientChartCard";
import MikrotikChartCard from "views/admin/default/components/MikrotikChartCard";
import { MdBarChart, MdBusiness, MdPerson } from "react-icons/md";
import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useEffect, useState } from "react";
import { FaServer } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const token = localStorage.getItem("access_token");
  const [mikrotik, setMikrotik] = useState("");
  const [admin, setAdmin] = useState("");
  const [site, setSite] = useState("");
  const [client, setClient] = useState("");
  const [disable, setDisable] = useState("");
  const [enable, setEnable] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${BASE_URL}/dashboard`, config);
        setMikrotik(response.data.mikrotik.total);
        setAdmin(response.data.total_admin);
        setSite(response.data.total_site);
        setClient(response.data.client.total);
        setDisable(response.data.client.disable);
        setEnable(response.data.client.enable);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  const handleWidgetClick = (url) => {
    navigate(url);
  };

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <div
          className="cursor-pointer"
          onClick={() => handleWidgetClick("/admin/mikrotik")}
        >
          <Widget
            icon={<FaServer className="h-7 w-7" />}
            title={"Total MikroTik"}
            subtitle={mikrotik}
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleWidgetClick("/admin/sites")}
        >
          <Widget
            icon={<MdBusiness className="h-6 w-6" />}
            title={"Total Sites"}
            subtitle={site}
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleWidgetClick("/admin/administrator")}
        >
          <Widget
            icon={<MdPerson className="h-7 w-7" />}
            title={"Total Account"}
            subtitle={admin}
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleWidgetClick("/admin/ppp-client")}
        >
          <Widget
            icon={<MdBarChart className="h-6 w-6" />}
            title={"Total PPP Client"}
            subtitle={client}
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleWidgetClick("/admin/ppp-client")}
        >
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={"Total Enable Client"}
            subtitle={enable}
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleWidgetClick("/admin/ppp-client")}
        >
          <Widget
            icon={<MdBarChart className="h-6 w-6" />}
            title={"Total Disable Client"}
            subtitle={disable}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-5 ">
        <div className="w-full rounded-[20px]">
          <MikrotikChartCard />
        </div>
        <div className="w-full rounded-[20px]">
          <ConfigureChartCard />
        </div>
      </div>
      <div className="mt-5 flex gap-5 ">
        <div className="w-full rounded-[20px]">
          <ClientChartCard />
        </div>
        <div className=" rounded-[20px]">
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
