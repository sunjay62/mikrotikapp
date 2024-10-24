import { TableProfile } from "./components/TableProfile";

const ProfileItem = () => {
  return (
    <div>
      <div className="mt-5 h-full w-full gap-5 md:grid-cols-2">
        <TableProfile />
      </div>
    </div>
  );
};

export default ProfileItem;
