// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Progress,
// } from "@material-tailwind/react";
// import axios from "axios";
// import { BASE_URL } from "libs/auth-api";

// const DetailMikrotik = ({
//   handleOpenDetail,
//   openDetail,
//   selectedMikrotikId,
// }) => {
//   const [name, setName] = useState("");
//   const [cpuLoad, setCpuLoad] = useState("");
//   const [boardName, setBoardName] = useState("");
//   const [cpuName, setCpuName] = useState("");
//   const [temperature, setTemperature] = useState("");
//   const [uptime, setUptime] = useState("");
//   const [freeMemory, setFreeMemory] = useState("");
//   const [freeHdd, setFreeHdd] = useState("");
//   const [totalMemory, setTotalMemory] = useState("");
//   const [totalHdd, setTotalHdd] = useState("");
//   const [version, setVersion] = useState("");

//   // Fungsi untuk fetch data
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const responseData = await axios.get(
//         `${BASE_URL}/mikrotik?mikrotik_id=${selectedMikrotikId}`,
//         config
//       );

//       // console.log(responseData.data);

//       if (responseData.data.current_info === null) {
//         setName("");
//         setCpuName("");
//         setVersion("");
//         setUptime("");
//         setBoardName("");
//         setTemperature("0");
//         setCpuLoad("0");
//         setFreeHdd("");
//         setFreeMemory("");
//         setTotalHdd("");
//         setTotalMemory("");
//       } else {
//         setName(responseData.data.name);
//         setCpuName(responseData.data.current_info.cpu);
//         setVersion(responseData.data.current_info.version);
//         setUptime(responseData.data.current_info.uptime);
//         setBoardName(responseData.data.current_info["board-name"]);
//         setTemperature(responseData.data.current_info["cpu-temperature"]);
//         setCpuLoad(responseData.data.current_info["cpu-load"]);
//         setFreeHdd(responseData.data.current_info["free-hdd-space"]);
//         setFreeMemory(responseData.data.current_info["free-memory"]);
//         setTotalHdd(responseData.data.current_info["total-hdd-space"]);
//         setTotalMemory(responseData.data.current_info["total-memory"]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedMikrotikId]);

//   const getProgressColor = (value) => {
//     if (value >= 75) {
//       return "red";
//     } else if (value >= 50) {
//       return "amber";
//     } else if (value >= 25) {
//       return "blue";
//     } else {
//       return "green";
//     }
//   };

//   const bytesToMB = (bytes) => {
//     const megabytes = bytes / (1024 * 1024);
//     if (megabytes >= 1000) {
//       // Jika lebih dari atau sama dengan 1000 MB, konversi menjadi GB
//       return (megabytes / 1024).toFixed(2) + " GB";
//     } else {
//       return megabytes.toFixed(2) + " MB";
//     }
//   };

//   return (
//     <>
//       <Dialog
//         open={openDetail}
//         size={"lg"}
//         handler={handleOpenDetail}
//         className="overflow-auto p-4 dark:bg-navy-700 dark:text-white"
//         style={{ maxHeight: "90vh" }} // Set maximum height
//       >
//         <div className="flex items-center justify-between">
//           <DialogHeader>Detail Device {name}</DialogHeader>
//           <Button onClick={fetchData} className="mr-5">
//             Refresh
//           </Button>
//         </div>
//         <DialogBody>
//           <table className="w-full min-w-max table-auto text-left">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-gray-700">
//                 <th className="border p-4">Property</th>
//                 <td className="border p-4">
//                   <div className="ml-4 font-bold">Value</div>
//                 </td>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <th className="border p-4">Board Name</th>
//                 <td className="border p-4">
//                   <div className="ml-4">{boardName}</div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border p-4">Version</th>
//                 <td className="border p-4">
//                   <div className="ml-4">{version}</div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border p-4">CPU</th>
//                 <td className="border p-4">
//                   <div className="ml-4">{cpuName}</div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="w-5 border p-4">UP Time</th>
//                 <td className="border p-4">
//                   <div className="ml-4">{uptime}</div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border p-4">CPU Load</th>
//                 <td className="border p-4">
//                   <div className="flex items-center gap-3">
//                     <Progress
//                       value={parseFloat(
//                         ((totalMemory - freeMemory) / totalMemory) * 100
//                       )}
//                       size="lg"
//                       label=""
//                       color={getProgressColor(
//                         parseFloat(
//                           ((totalMemory - freeMemory) / totalMemory) * 100
//                         )
//                       )} // Set color dynamically
//                       className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
//                     />
//                     {cpuLoad}%
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border p-4">Temperature</th>
//                 <td className="border p-4">
//                   <div className="flex items-center gap-3">
//                     <Progress
//                       value={parseFloat(temperature)} // Mengonversi ke tipe data number
//                       size="lg"
//                       label=""
//                       color={getProgressColor(parseFloat(temperature))} // Set color dynamically
//                       className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
//                     />
//                     {temperature}°
//                   </div>
//                 </td>
//               </tr>

//               <tr>
//                 <th className="border p-4">Memory Used</th>
//                 <td className="border p-4">
//                   <div className="flex items-center gap-3">
//                     {totalMemory && freeMemory && (
//                       <>
//                         <Progress
//                           value={
//                             ((totalMemory - freeMemory) / totalMemory) * 100
//                           }
//                           size="lg"
//                           label=""
//                           color={getProgressColor(
//                             ((totalMemory - freeMemory) / totalMemory) * 100
//                           )} // Set color dynamically
//                           className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
//                         />
//                         {(
//                           ((totalMemory - freeMemory) / totalMemory) *
//                           100
//                         ).toFixed(2)}
//                         %
//                       </>
//                     )}
//                   </div>
//                   <div className="ml-4 flex">
//                     {bytesToMB(freeMemory)} free of {bytesToMB(totalMemory)}
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="w-80 border p-4">HDD Used</th>
//                 <td className="border p-4">
//                   <div className="flex items-center gap-3">
//                     {totalHdd && freeHdd && (
//                       <>
//                         <Progress
//                           value={((totalHdd - freeHdd) / totalHdd) * 100}
//                           size="lg"
//                           label=""
//                           color={getProgressColor(
//                             ((totalHdd - freeHdd) / totalHdd) * 100
//                           )} // Set color dynamically
//                           className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
//                         />
//                         {(((totalHdd - freeHdd) / totalHdd) * 100).toFixed(2)}%
//                       </>
//                     )}
//                   </div>
//                   <div className="ml-4 flex">
//                     {bytesToMB(freeHdd)} free of {bytesToMB(totalHdd)}
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             variant="text"
//             color="red"
//             onClick={handleOpenDetail}
//             className="mr-1 bg-red-50 hover:bg-red-200"
//           >
//             <span>Close</span>
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </>
//   );
// };

// export default DetailMikrotik;
