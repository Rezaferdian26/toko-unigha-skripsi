import Header from "@/components/dashboard-admin/Header";
import SideBar from "@/components/dashboard-admin/Sidebar";
import { columns } from "@/components/dashboard-admin/product/columns";
import { DataTable } from "@/components/dashboard-admin/product/data-table";
import ProtectedAdminPage from "@/components/protect-pages/ProtectedAdminPage";
import axios from "axios";
import useSWR from "swr";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function AdminProduct() {
  const { data, error, isLoading } = useSWR(`/api/product`, fetcher);
  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl">404 | Not Found</p>
      </div>
    );
  if (isLoading) return null;
  return (
    <ProtectedAdminPage>
      <SideBar linkActive={"product"}>
        <Header title="Kelola Produk" />
        <div className="p-3">
          <DataTable columns={columns} data={data.data} />
        </div>
      </SideBar>
    </ProtectedAdminPage>
  );
}
