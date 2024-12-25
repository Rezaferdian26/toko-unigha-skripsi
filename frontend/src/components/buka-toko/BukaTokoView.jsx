import PreviewImage from "@/components/PreviewImage";
import ProtectedPage from "@/components/protect-pages/ProtectedPage";
import Layout from "@/components/layout";
import Image from "next/legacy/image";
import { FaAddressCard, FaLocationDot, FaTag } from "react-icons/fa6";
export default function BukaTokoView({ formik, user, loading }) {
  return (
    <ProtectedPage>
      <Layout>
        <div className="sm:flex max-w-5xl mx-auto">
          <div className="description text-center sm:basis-1/2 sm:pe-5 sm:border-r-2">
            <h1 className="font-bold text-2xl mb-2">
              Jadikan Ide Bisnis Anda Kenyataan, Buka Toko Online dan Capai
              Kesuksesan!
            </h1>
            <h2 className="text-lg mb-5">Khusus Mahasiswa dan Dosen UNIGHA</h2>
            <div className="relative rounded-full overflow-x-hidden w-72 h-72 mx-auto">
              <Image
                src="/assets/marketplace.jpg"
                layout="fill"
                objectFit="contain"
                alt="Gambar"
              />
            </div>
          </div>
          <div className="form-toko ms-5 basis-1/2">
            <h1 className="text-xl">
              Halo {user?.name}, isi detail toko mu dulu ya!
            </h1>
            <form
              className="mt-3"
              onSubmit={formik.handleSubmit}
              encType="multipart/form-data"
            >
              <div className="mb-3">
                <label
                  htmlFor="identification_number"
                  className="block text-sm mb-1"
                >
                  NPM/NIDN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="identification_number"
                    id="identification_number"
                    placeholder="Type your NPM/NIDN"
                    className="mb-2 shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                    {...formik.getFieldProps("identification_number")}
                  />
                  <FaAddressCard className="absolute top-2.5 left-2 text-sm text-gray-400" />
                  {formik.touched.identification_number &&
                  formik.errors.identification_number ? (
                    <span className="text-error text-xs">
                      {formik.errors.identification_number}
                    </span>
                  ) : null}
                </div>
                <p className="text-slate-400 text-xs">
                  *Jika mahasiswa tuliskan NPM, atau jika dosen tuliskan NIDN.
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm mb-1">
                  Nama Toko
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Type your store name"
                    className="mb-2 shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                    {...formik.getFieldProps("name")}
                  />
                  <FaTag className="absolute top-2.5 left-2 text-sm text-gray-400" />
                  {formik.touched.name && formik.errors.name ? (
                    <span className="text-error text-xs">
                      {formik.errors.name}
                    </span>
                  ) : null}
                </div>
                <p className="text-slate-400 text-xs">
                  *Gunakan nama yang singkat dan unik. Supaya pembeli mudah
                  mengingat tokomu.
                </p>
              </div>
              <div className="mb-5">
                <label htmlFor="alamat_toko" className="block text-sm mb-1">
                  Alamat Toko
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Type your store address"
                    className="mb-2 shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                    {...formik.getFieldProps("address")}
                  />
                  <FaLocationDot className="absolute top-2.5 left-2 text-sm text-gray-400" />
                  {formik.touched.address && formik.errors.address ? (
                    <span className="text-error text-xs">
                      {formik.errors.address}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="image" className="block text-sm mb-1">
                  Logo Toko
                </label>
                {formik.values.image && (
                  <PreviewImage file={formik.values.image} />
                )}
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="mb-2 shadow-sm text-sm rounded shadow-gray-300 w-full file-input file-input-sm file-input-bordered file-input-primary "
                    onChange={(e) => {
                      formik.setFieldValue("image", e.target.files[0]);
                    }}
                  />
                  {formik.touched.image && formik.errors.image ? (
                    <span className="text-error text-xs">
                      {formik.errors.image}
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-warning disabled:btn-warning disabled:opacity-75"
                disabled={loading}
              >
                Buka Toko
                {loading && <span className="loading loading-spinner"></span>}
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedPage>
  );
}
