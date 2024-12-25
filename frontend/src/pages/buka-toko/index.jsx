import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import BukaTokoView from "@/components/buka-toko/BukaTokoView";
import { UserContext } from "@/contexts/userContext";
import { TokoContext } from "@/contexts/tokoContext";
import Loading from "@/components/Loading";
import LayoutApp from "@/components/LayoutApp";
import ProtectedPage from "@/components/protect-pages/ProtectedPage";
import Cookies from "js-cookie";

export default function Toko() {
  const router = useRouter();
  const { toko, setToko } = useContext(TokoContext);
  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (toko) {
      router.replace("/mytoko");
    }
    setRender(true);
  }, [router, toko]);

  const handleCreateToko = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("address", formik.values.address);
    formData.append(
      "identification_number",
      formik.values.identification_number
    );
    formData.append("name", formik.values.name);
    formData.append("image", formik.values.image);

    try {
      const response = await axios.post(`/api/toko`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 201) {
        router.push("/mytoko");
        const responseToko = await axios.get("/api/get-toko-user");
        setToko(responseToko.data.data);
        setLoading(false);

        toast.success("Toko berhasil dibuat!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch ({ response }) {
      setLoading(false);
      const errors = response.data.data;
      for (const key in errors) {
        errors[key].forEach((error) => {
          formik.setFieldError(key, error);
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      address: "",
      identification_number: "",
      name: "",
      image: "",
    },
    validationSchema: Yup.object({
      address: Yup.string().required("Required").max(100),
      identification_number: Yup.number().required("Required"),
      name: Yup.string().required("Required").max(30),
      image: Yup.mixed()
        .required("Required")
        .test(
          "FILE_TYPE",
          "Invalid!",
          (value) => value && ["image/png", "image/jpeg"].includes(value.type)
        )
        .test(
          "FILE_SIZE",
          "Too large!",
          (value) => value && value.size < 1024 * 1024
        ),
    }),
    onSubmit: handleCreateToko,
  });

  const { user } = useContext(UserContext);

  if (toko || !render) {
    return (
      <ProtectedPage>
        <LayoutApp>
          <div className="h-screen flex items-center justify-center">
            <Loading />
          </div>
        </LayoutApp>
      </ProtectedPage>
    );
  }

  return (
    render && <BukaTokoView formik={formik} user={user} loading={loading} />
  );
}
