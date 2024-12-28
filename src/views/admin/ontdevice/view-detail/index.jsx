import { useState } from "react";
import ViewDevice from "./components/ViewDevice";
import ViewCard from "./components/ViewCard";
import { Button, Card, CardHeader } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ViewUplink from "./components/ViewUplink";
import ViewOntList from "./components/ViewOntList";
import ViewVlan from "./components/ViewVlan";
import OnuDetail from "./components/onu-detail";

const ViewDetailDeviceOnt = () => {
  const [activeView, setActiveView] = useState("detail");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/admin/smart-olt/ont-device`);
  };

  return (
    <>
      <Card className="mt-8 h-full w-full dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="flex items-center justify-center gap-20 border-b border-blue-400 pb-5">
            {/* Button for OLT Detail */}
            <div className="flex w-full items-start justify-start gap-3 ">
              <Button
                className={`w-36 p-2 ${
                  activeView === "detail"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("detail")}
              >
                ONU Detail
              </Button>
              {/* <Button
                className={`w-36 p-2 ${
                  activeView === "onuservice"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("onuservice")}
              >
                ONU Service
              </Button> */}
              <Button
                className={`w-36 p-2 ${
                  activeView === "servicevlan"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("servicevlan")}
              >
                Service Vlan
              </Button>

              {/* Button for OLT Card
              <Button
                className={`w-full p-2 ${
                  activeView === "card"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("card")}
              >
                OLT Card
              </Button>
      
              <Button
                className={`w-full p-2 ${
                  activeView === "uplink"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("uplink")}
              >
                Uplink
              </Button>
              <Button
                className={`w-full p-2 ${
                  activeView === "vlans"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("vlans")}
              >
                Vlans
              </Button>
              <Button
                className={`w-full p-2 ${
                  activeView === "ontlist"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 "
                }`}
                onClick={() => setActiveView("ontlist")}
              >
                ONT List
              </Button> */}
            </div>
            <Button
              className="bg-blue-600 px-4 py-2 hover:bg-blue-700"
              onClick={handleBack}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
          </div>

          {/* Conditionally render ViewDevice or ViewCard based on activeView */}
          {activeView === "detail" && <OnuDetail />}
          {activeView === "card" && <ViewCard />}
          {/* {activeView === "onuservice" && <ViewService />} */}
          {activeView === "servicevlan" && <ViewVlan />}
          {activeView === "uplink" && <ViewUplink />}
          {activeView === "vlans" && <ViewVlan />}
          {activeView === "ontlist" && <ViewOntList />}
        </CardHeader>
      </Card>
    </>
  );
};

export default ViewDetailDeviceOnt;
