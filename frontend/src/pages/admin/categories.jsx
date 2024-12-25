import Loading from "@/components/Loading";
import Header from "@/components/dashboard-admin/Header";
import SideBar from "@/components/dashboard-admin/Sidebar";
import AddCategory from "@/components/dashboard-admin/categories/AddCategory";
import { columns } from "@/components/dashboard-admin/categories/columns";
import { DataTable } from "@/components/dashboard-admin/categories/data-table";
import ProtectedAdminPage from "@/components/protect-pages/ProtectedAdminPage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

export const EditContext = createContext();

const fetcher = (...args) => axios.get(...args).then((res) => res.data);
export default function Categories() {
  const [add, setAdd] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editId, setEditId] = useState("");
  const [reload, setReload] = useState(false);

  const { data, error, isLoading } = useSWR(`/api/category`, fetcher);

  useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload]);
  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl">404 | Not Found</p>
      </div>
    );
  if (isLoading) return <Loading />;
  return (
    <EditContext.Provider
      value={{ editValue, setEditValue, editId, setEditId }}
    >
      <ProtectedAdminPage>
        <SideBar linkActive={"categories"}>
          <Header title="Kelola Kategori" />
          <div className="p-3">
            {!add ? (
              <>
                <div className="bg-white shadow rounded p-3 flex justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => setAdd(true)}
                  >
                    Tambah Kategori
                  </button>
                </div>
              </>
            ) : (
              <AddCategory setAdd={setAdd} />
            )}
            <DataTable
              columns={columns}
              data={data.data}
              reload={reload}
              setReload={setReload}
            />
          </div>
        </SideBar>
      </ProtectedAdminPage>
    </EditContext.Provider>
  );
}
