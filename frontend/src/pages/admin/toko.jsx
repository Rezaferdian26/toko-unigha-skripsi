import Header from "@/components/dashboard-admin/Header";
import SideBar from "@/components/dashboard-admin/Sidebar";
import { columns } from "@/components/dashboard-admin/toko/columns";
import { DataTable } from "@/components/dashboard-admin/toko/data-table";
import ProtectedAdminPage from "@/components/protect-pages/ProtectedAdminPage";
import axios from "axios";
import useSWR from "swr";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function AdminToko() {
  const { data, error, isLoading } = useSWR(`/api/toko`, fetcher);
  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl">404 | Not Found</p>
      </div>
    );
  if (isLoading) return null;
  return (
    <ProtectedAdminPage>
      <SideBar linkActive={"toko"}>
        <Header title="Kelola Toko" />
        <div className="p-3">
          <DataTable columns={columns} data={data.errors ? [] : data.data} />
        </div>
      </SideBar>
    </ProtectedAdminPage>
  );
}
