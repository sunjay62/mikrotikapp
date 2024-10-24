import { TableProfile } from "./components/TableProfile";
import { TableSecret } from "./components/TableSecret";
import ViewMikrotik from "./components/ViewMikrotik";

const ViewDetail = () => {
  return (
    <div>
      <ViewMikrotik />
      <TableProfile />
      <TableSecret />
    </div>
  );
};

export default ViewDetail;
