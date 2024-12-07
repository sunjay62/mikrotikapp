import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/pppclient";
import TableProfile from "views/admin/profileitem";
import { Route } from "react-router-dom";
// Icon Imports
import {
  MdHome,
  MdBarChart,
  MdPerson,
  MdCircle,
  MdBusiness,
  MdAccountCircle,
  MdMobiledataOff,
} from "react-icons/md";
import { FaGlobe, FaServer } from "react-icons/fa";
import Sites from "views/admin/sites";
import ProtectedRoute from "utils/ProtectedRoute";
import Mikrotik from "views/admin/mikrotik";
import Account from "views/admin/account";
import ViewDetailMikrotik from "views/admin/mikrotik/view-detail";
import ViewDetailSite from "views/admin/sites/view-detail";
import ViewProfile from "views/admin/mikrotik/view-profile";
import MikrotikProfileDetail from "views/admin/mikrotik/view-profile/components/MikrotikProfileDetail";
import SiteProfileDetail from "views/admin/sites/view-profile/components/SiteProfileDetail";
import ViewDetailProfile from "views/admin/profileitem/view-detail";
import ViewDetailSecret from "views/admin/pppclient/view-detail";
import OltProfile from "views/admin/oltprofile";
import OltOnuType from "views/admin/oltonutype";
import OltMaster from "views/admin/oltmaster";
import OltDevice from "views/admin/oltdevice";
import ViewDetailDevice from "views/admin/oltdevice/view-detail";
import OntDevice from "views/admin/ontdevice";
import ViewDetailDeviceOnt from "views/admin/ontdevice/view-detail";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "home",
    icon: <MdHome className="h-6 w-6" />,
    component: <ProtectedRoute element={<MainDashboard />} />,
  },
  {
    name: "MikroTik",
    layout: "/admin",
    icon: <FaServer className="h-5 w-6" />,
    path: "mikrotik",
    component: (
      <ProtectedRoute
        element={<Mikrotik />}
        restrictedRoutes={[
          "/admin/mikrotik",
          "/admin/mikrotik/view-detail/:mikrotikId",
        ]}
      />
    ),
  },
  {
    name: "View Mikrotik",
    layout: "/admin",
    path: "mikrotik/view-detail/:mikrotikId",
    component: <ProtectedRoute element={<ViewDetailMikrotik />} />,
  },
  {
    name: "Mikrotik Profile Detail",
    layout: "/admin",
    path: "mikrotik/view-profile",
    component: <ProtectedRoute element={<MikrotikProfileDetail />} />,
  },
  {
    name: "Profile",
    layout: "/admin",
    icon: <MdMobiledataOff className="h-6 w-6" />,
    path: "profile",
    component: (
      <ProtectedRoute
        element={<TableProfile />}
        restrictedRoutes={[
          "/admin/profile",
          "/admin/profile/view-detail/:name",
        ]}
      />
    ),
  },
  {
    name: "View Mikrotik",
    layout: "/admin",
    path: "profile/view-detail/:name",
    component: <ProtectedRoute element={<ViewDetailProfile />} />,
  },
  {
    name: "PPP Client",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "ppp-client",
    component: <ProtectedRoute element={<DataTables />} />,
  },
  {
    name: "View Site",
    layout: "/admin",
    path: "ppp-client/view-detail/:client_id",
    component: <ProtectedRoute element={<ViewDetailSecret />} />,
  },
  {
    name: "Sites",
    layout: "/admin",
    icon: <MdBusiness className="h-6 w-6" />,
    path: "sites",
    component: <ProtectedRoute element={<Sites />} />,
  },
  {
    name: "View Site",
    layout: "/admin",
    path: "sites/view-detail/:siteId",
    component: <ProtectedRoute element={<ViewDetailSite />} />,
  },
  {
    name: "Sites Profile Detail",
    layout: "/admin",
    path: "sites/view-profile",
    component: <ProtectedRoute element={<SiteProfileDetail />} />,
  },
  // {
  //   name: "Smart OLT",
  //   layout: "/admin",
  //   icon: <FaGlobe className="h-6 w-6" />,
  //   subRoutes: [
  //     {
  //       name: "Speed Profile",
  //       path: "smart-olt/tcont-traffic",
  //       icon: <MdCircle className="h-6 w-6" />,
  //     },
  //     {
  //       name: "Onu Type",
  //       path: "smart-olt/onu-type",
  //       icon: <MdCircle className="h-6 w-6" />,
  //     },
  //     {
  //       name: "OLT Master",
  //       path: "smart-olt/master",
  //       icon: <MdCircle className="h-6 w-6" />,
  //     },
  //     {
  //       name: "OLT Device",
  //       path: "smart-olt/olt-device",
  //       icon: <MdCircle className="h-6 w-6" />,
  //     },
  //     {
  //       name: "ONT Device",
  //       path: "smart-olt/ont-device",
  //       icon: <MdCircle className="h-6 w-6" />,
  //     },
  //   ],
  // },

  {
    name: "Administrator",
    layout: "/admin",
    path: "administrator",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<Account />} />,
  },

  //HIDDEN MENU
  {
    name: "View Device",
    layout: "/admin",
    path: "/smart-olt/device/view-detail/:deviceId",
    component: <ProtectedRoute element={<ViewDetailDevice />} />,
  },

  {
    name: "View Device",
    layout: "/admin",
    path: "/smart-olt/ont-device/view-detail/:deviceId",
    component: <ProtectedRoute element={<ViewDetailDeviceOnt />} />,
  },
  {
    name: "Speed Profile",
    layout: "/admin",
    path: "smart-olt/tcont-traffic",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<OltProfile />} />,
  },
  {
    name: "Onu Type",
    layout: "/admin",
    path: "smart-olt/onu-type",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<OltOnuType />} />,
  },
  {
    name: "OLT Master",
    layout: "/admin",
    path: "smart-olt/master",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<OltMaster />} />,
  },
  {
    name: "OLT Device",
    layout: "/admin",
    path: "smart-olt/olt-device",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<OltDevice />} />,
  },
  {
    name: "ONT Device",
    layout: "/admin",
    path: "smart-olt/ont-device",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<OntDevice />} />,
  },
];
export default routes;
