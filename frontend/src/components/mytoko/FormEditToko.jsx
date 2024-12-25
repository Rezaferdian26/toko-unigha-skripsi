import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { FaFloppyDisk, FaBan } from "react-icons/fa6";
import * as Yup from "yup";

export default function FormEditToko({ setEdit, toko, setToko }) {
  const [saveButton, setSaveButton] = useState(false);
  const inputNameRef = useRef();
  const inputAddressRef = useRef();
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/toko/${toko.id}`,
        {
          name: formik.values.name,
          address: formik.values.address,
        },
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status === 200) {
        setToko(response.data.data);
        setEdit(false);
        myToastSuccess("Berhasil memperbarui toko");
      }
    } catch (error) {
      myToastError("Gagal memperbarui toko, " + error.message);
    }
  };

  const handleChangeCheckInput = () => {
    if (
      inputNameRef.current.value !== toko.name ||
      inputAddressRef.current.value !== toko.address
    ) {
      setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: toko.name,
      address: toko.address,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
    }),
    onSubmit: handleEdit,
  });

  return (
    <form onSubmit={handleEdit} method="put">
      <div className="flex items-center mb-3">
        <label htmlFor="name" className="basis-1/3 text-sm">
          Nama Toko
        </label>
        <input
          name="name"
          id="name"
          type="text"
          className="basis-2/3 input input-md input-bordered"
          placeholder="Tuliskan nama tokomu"
          ref={inputNameRef}
          onChange={(e) => {
            formik.handleChange(e);
            handleChangeCheckInput();
          }}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          // {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name ? (
          <span className="text-error text-xs">{formik.errors.name}</span>
        ) : null}
      </div>
      <div className="flex items-center mb-3">
        <label htmlFor="address" className="basis-1/3 text-sm">
          Alamat Toko
        </label>
        <input
          name="address"
          id="address"
          type="text"
          className="basis-2/3 input input-md input-bordered"
          ref={inputAddressRef}
          onChange={(e) => {
            formik.handleChange(e);
            handleChangeCheckInput();
          }}
          onBlur={formik.handleBlur}
          value={formik.values.address}
          placeholder="Tuliskan alamat tokomu"
          // {...formik.getFieldProps("address")}
        />
        {formik.touched.address && formik.errors.address ? (
          <span className="text-error text-xs">{formik.errors.address}</span>
        ) : null}
      </div>

      <div className="mt-5">
        <button
          type="submit"
          className="btn btn-warning me-3 disabled:opacity-70 disabled:btn-warning"
          disabled={!saveButton}
        >
          <FaFloppyDisk />
          Save
        </button>
        <button className="btn btn-ghost" onClick={() => setEdit(false)}>
          <FaBan />
          Cancel
        </button>
      </div>
    </form>
  );
}
