// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Input,
//   Typography,
// } from "@material-tailwind/react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { BASE_URL } from "libs/auth-api";
// import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

// const useUpdate = ({
//   handleOpenEdit,
//   openEdit,
//   selectedMikrotikId,
//   selectedName,
// }) => {
//   const [name, setName] = useState("");
//   const [localAdderss, setLocalAdderss] = useState("");
//   const [remoteAddress, setRemoteAddress] = useState("");
//   const [onlyOne, setOnlyOne] = useState("");
//   const [ipv6, setIpv6] = useState("");
//   const [defaultStatus, setDefaultStatus] = useState("");
//   const [mpls, setMpls] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const responseData = await axios.get(
//           `${BASE_URL}/mikrotik/${selectedMikrotikId}/pppprofile?name=${selectedName}`,
//           config
//         );

//         setName(responseData.data.name);
//         setLocalAdderss(responseData.data["local-address"]);
//         setRemoteAddress(responseData.data["remote-address"]);
//         setOnlyOne(responseData.data["only-one"]);
//         setIpv6(responseData.data["use-ipv6"]);
//         setDefaultStatus(responseData.data.default);
//         setMpls(responseData.data["use-mpls"]);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();
//   }, [selectedMikrotikId]);

//   return (
//     <Dialog
//       open={openEdit}
//       size={"xs"}
//       handler={handleOpenEdit}
//       className="dark:bg-navy-700 dark:text-white"
//     >
//       <DialogHeader>Edit Profile</DialogHeader>
//       <DialogBody>
//         <Typography variant="paragraph" color="blue-gray">
//           Profile Name
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//         <Typography variant="paragraph" color="blue-gray">
//           Local Address
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={localAdderss}
//           onChange={(e) => setLocalAdderss(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//         <Typography variant="paragraph" color="blue-gray">
//           Remote Address
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={remoteAddress}
//           onChange={(e) => setRemoteAddress(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//         <Typography variant="paragraph" color="blue-gray">
//           Only One
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={onlyOne}
//           onChange={(e) => setOnlyOne(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//         <Typography variant="paragraph" color="blue-gray">
//           IP Version 6
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={ipv6}
//           onChange={(e) => setIpv6(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//         <Typography variant="paragraph" color="blue-gray">
//           MPLS
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={mpls}
//           onChange={(e) => setMpls(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//         <Typography variant="paragraph" color="blue-gray">
//           Default
//         </Typography>
//         <Input
//           size="md"
//           color="blue"
//           placeholder="Device Name"
//           value={defaultStatus}
//           onChange={(e) => setDefaultStatus(e.target.value)}
//           className="dark:bg-navy-700"
//         />
//       </DialogBody>
//       <DialogFooter>
//         <Button
//           variant="text"
//           color="red"
//           onClick={handleOpenEdit}
//           className="mr-1"
//         >
//           <span>Cancel</span>
//         </Button>
//         <Button variant="gradient" color="green" onClick={handleOpenEdit}>
//           <span>Confirm</span>
//         </Button>
//       </DialogFooter>
//     </Dialog>
//   );
// };

// export default useUpdate;
