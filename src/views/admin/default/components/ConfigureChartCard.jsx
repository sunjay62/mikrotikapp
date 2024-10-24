import PieChart from "components/charts/PieChart";
import Card from "components/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { PuffLoader } from "react-spinners";

const ConfigureChartCard = () => {
  const token = localStorage.getItem("access_token");
  const [configured, setConfigured] = useState(0);
  const [unConfigured, setUnConfigured] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${BASE_URL}/dashboard`, config);

        setConfigured(response.data.client.configured);
        setUnConfigured(response.data.client.unconfigured);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieChartOptions = {
    colors: ["#4318ff", "#6bd2ff"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    labels: ["Configured ", "UnConfigured "],
  };

  const pieChartData = [configured, unConfigured];

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="mb-6 text-lg font-bold text-navy-700 dark:text-white">
            PPP Client Configure
          </h4>
        </div>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        {loading ? (
          <PuffLoader color="#4318ff" />
        ) : (
          <PieChart options={pieChartOptions} series={pieChartData} />
        )}
      </div>
      {!loading && (
        <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-brand-500" />
              <p className="ml-1 text-sm font-normal text-gray-600">
                Configured
              </p>
            </div>
            <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
              {((configured / (configured + unConfigured)) * 100).toFixed(2)}%
            </p>
          </div>

          <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
              <p className="ml-1 text-sm font-normal text-gray-600">
                Unconfigured
              </p>
            </div>
            <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
              {((unConfigured / (configured + unConfigured)) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ConfigureChartCard;
