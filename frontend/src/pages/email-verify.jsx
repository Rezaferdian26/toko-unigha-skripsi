import LayoutApp from "@/components/LayoutApp";
import Loading from "@/components/Loading";
import { UserContext } from "@/contexts/userContext";
import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
export default function EmailVerify() {
  const { isLogin, user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data, error, isLoading } = useSWR(`/api/me`, fetcher);

  if (error) return <div>error</div>;
  if (isLoading) return <div>Loading</div>;

  if (data.data.has_verified) {
    setUser(data.data);
    router.replace("/");
    return;
  }

  const resendEmailHandler = async () => {
    setLoading(true);
    try {
      await axios.post(
        "email/verification-notification",
        {},
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      myToastSuccess("Email verifikasi dikirim. Silahkan cek email anda");
      setLoading(false);
    } catch (error) {
      myToastError(error.response.data.message);
      setLoading(false);
    }
  };

  return isLogin ? (
    <LayoutApp>
      <div className="mx-auto max-w-xl">
        <div className="bg-white rounded-lg shadow p-4">
          <h1 className="text-2xl">Verifikasi Email</h1>
          <p className="mt-5">Cek email untuk verifikasi.</p>
          <p className="mt-10 mb-2">
            Jika email tidak anda diterima atau proses verifikasi gagal, silakan
            coba kirim ulang!
          </p>
          <button
            className="btn btn-primary disabled:btn-primary disabled:opacity-75"
            disabled={loading}
            onClick={resendEmailHandler}
          >
            Kirim ulang email verifikasi
            {loading && (
              <span className="loading loading-ring loading-lg"></span>
            )}
          </button>
        </div>
      </div>
    </LayoutApp>
  ) : (
    <LayoutApp>
      <Loading />
    </LayoutApp>
  );
}
