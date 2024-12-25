import Header from "@/components/dashboard-admin/Header";
import SideBar from "@/components/dashboard-admin/Sidebar";
import CardDashboard from "@/components/dashboard-admin/dashboard/CardDashboard";
import ProtectedAdminPage from "@/components/protect-pages/ProtectedAdminPage";

export default function Admin() {
  return (
    <ProtectedAdminPage>
      <SideBar linkActive={"dashboard"}>
        <Header title="Dashboard" />
        <div className="grid grid-cols-2 md:grid-cols-4">
          <CardDashboard title={"User"} endpoint={"user"} />
          <CardDashboard title={"Toko"} endpoint={"toko"} />
          <CardDashboard
            title={"Pengajuan Toko"}
            endpoint={"get-unverified-toko"}
          />
          <CardDashboard title={"Produk"} endpoint={"product"} />
        </div>
      </SideBar>
    </ProtectedAdminPage>
  );
}
