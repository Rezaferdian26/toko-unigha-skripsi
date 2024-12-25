import Header from "@/components/dashboard-admin/Header";
import SideBar from "@/components/dashboard-admin/Sidebar";
import { columns } from "@/components/dashboard-admin/pengajuan-buka-toko/columns";
import { DataTable } from "@/components/dashboard-admin/pengajuan-buka-toko/data-table";
import DetailTokoModal from "@/components/dashboard-admin/pengajuan-buka-toko/detail-toko-modal";
import ProtectedAdminPage from "@/components/protect-pages/ProtectedAdminPage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const tokoModalContext = createContext();
export default function PengajuanBukaToko() {
  const [slugToko, setSlugToko] = useState("");
  const [reload, setReload] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const responseToko = await axios.get(`/api/get-unverified-toko`);
      if (responseToko.status === 200) {
        setData(responseToko.data.data);
        setReload(false);
      }
    } catch (error) {
      setReload(false);
      setData([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, [reload]);
  return (
    <ProtectedAdminPage>
      <SideBar linkActive={"pengajuan-buka-toko"}>
        <Header title="Pengajuan Buka Toko" />
        <div className="p-3" reload={reload}>
          <tokoModalContext.Provider value={{ slugToko, setSlugToko }}>
            <DataTable columns={columns} data={data} reload={reload} />
            <dialog id="detail_toko_modal" className="modal">
              <DetailTokoModal slug={slugToko} setReload={setReload} />
            </dialog>
          </tokoModalContext.Provider>
        </div>
      </SideBar>
    </ProtectedAdminPage>
  );
}
