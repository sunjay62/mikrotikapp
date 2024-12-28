import OnuStatus from "./OnuStatus";
import ViewDevice from "./ViewDevice";
import ViewStatus from "./ViewStatus";

const OnuDetail = () => {
  return (
    <div>
      <ViewDevice />
      <ViewStatus />
      <OnuStatus />
    </div>
  );
};

export default OnuDetail;
