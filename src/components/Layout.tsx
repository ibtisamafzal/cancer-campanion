import { ReactNode } from "react";
import Navbar from "./Navbar";
import DisclaimerBanner from "./DisclaimerBanner";
import EmergencyContactBanner from "./EmergencyContactBanner";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <EmergencyContactBanner />
    <main className="flex-1">{children}</main>
    <DisclaimerBanner />
  </div>
);

export default Layout;
