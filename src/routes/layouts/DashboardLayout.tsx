// import { Outlet } from 'react-router-dom'
// // import { BellIcon } from "lucide-react";
// // import { Button } from "@nextui-org/button";
// import { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from '@/components/redesigned-components/components/navbars/AppSidebar'
// import Notification from '@/components/notificationBar/component'
// // import ShinyButton from "@/components/ShinyButton"

// const DashboardLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen)
//   }
//   return (
//     <div className='min-h-screen '>
//       <SidebarProvider>
//         {isSidebarOpen && <AppSidebar />}

//         <main className='w-full'>
//           <div className='flex items-center w-full gap-4 p-2 py-4 shadow-sm'>
//             <SidebarTrigger
//               // className="p-0 "
//               onClick={toggleSidebar}
//               // isOpen={isSidebarOpen}
//             />
//             <div className='flex items-center justify-between w-full'>
//               <h2 className='hidden text-2xl font-bold md:block'>
//                 My Dashboard
//               </h2>
//               <div className='flex items-center gap-3 ml-auto'>
//                 {/* <SearchModal /> */}
//                 {/* <Button
//                   isIconOnly
//                   className="rounded-full bg-slate-100 hover:bg-slate-200 size-10"
//                 >
//                   <BellIcon color="black" />
//                 </Button> */}
//                 {/* <Button
//                   asChild
//                   className="flex items-center justify-center font-bold bg-blue-700 hover:bg-blue-400"
//                 > */}
//                 {/* <NavLink to={"/select"}>
//                     <PlusCircle />
//                     Create New
//                   </NavLink> */}
//                 {/* </Button> */}

//                 {/* <ShinyButton className="h-10 bg-button-gpt" href="/select">
//                   Create New
//                 </ShinyButton> */}
//                 <Notification />
//               </div>
//             </div>
//           </div>
//           <div className='p-2'>
//             <Outlet />
//           </div>
//         </main>
//       </SidebarProvider>
//     </div>
//   )
// }

// export default DashboardLayout

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  FileText,
  Award,
  Settings,
  User,
  File,
  History,
  ArrowLeft,
} from "lucide-react";
import Notification from "@/components/notificationBar/component";
import logo from "../../../public/assets/icons/logo.png";
import { useAuth } from "@/hooks/useAuth";
// import { toggle } from '@nextui-org/theme'

const menuItems = [
  { title: "Home", url: "/dashboard", icon: FileText },
  { title: "Bills", url: "/bills", icon: Award },
  { title: "Organizer", url: "/organizer", icon: Settings },
  { title: "Credits Tracker", url: "/credit-tracker", icon: Award },
  { title: "Payments History", url: "/payment-history", icon: History },
  { title: "Documents", url: "/documents", icon: File },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Referral Program", url: "/refer", icon: User },
  { title: "Support", url: "/contact-us", icon: User },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default on large screens
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };
  useEffect(() => {}, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0   ${
          isSidebarOpen ? "left-0" : "-left-full"
        } h-full bg-active-color text-white transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "w-full sm:w-64 lg:w-64" : "w-0 sm:w-0 lg:w-0 hidden"
        } lg:left-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="h-12" />
          </NavLink>
          {/* Close Sidebar Button */}
          <button
            className="p-2 text-white lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="flex flex-col px-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                onClick={() => {
                  if (isMobile) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-button-gpt-hover font-semibold"
                      : "hover:bg-button-gpt-hover"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto">
          <button
            className="flex items-center w-full gap-4 px-3 py-2 rounded-md hover:bg-red-500"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 lg:mlk-64 ${
          isSidebarOpen && "lg:ml-64"
        }


          ${!isSidebarOpen && "w-full sm:w-full lg:w-full"}
        
          `}
      >
        {/* Top Navbar */}
        <div className="flex items-center justify-between w-full p-4 bg-white shadow-md ">
          <div className="flex items-center w-10 gap-4 p-1 py-1 ">
            <SidebarTrigger onClick={toggleSidebar} />
          </div>

          {/* Dashboard Title */}
          <h2 className="text-xl font-bold">My Dashboard</h2>

          {/* Notification Section */}
          <div className="flex items-center gap-4">
            <Notification />
          </div>
        </div>

        {/* Main Page Content */}
        <div className="p-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
