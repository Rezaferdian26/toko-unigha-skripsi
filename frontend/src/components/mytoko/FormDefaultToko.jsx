export default function FormDefaultToko({ toko }) {
  return (
    <>
      <div className="flex items-center mb-3">
        <label htmlFor="" className=" basis-1/3 text-sm">
          Nama Toko
        </label>
        <div
          type="text"
          className="col-span-2 border p-2 basis-2/3 text-sm rounded"
        >
          {toko.name}
        </div>
      </div>
      <div className="flex items-center mb-3">
        <label htmlFor="" className=" basis-1/3 text-sm">
          Alamat Toko
        </label>
        <div
          type="text"
          className="col-span-2 border p-2 basis-2/3 text-sm rounded"
        >
          {toko.address}
        </div>
      </div>
      <div className="flex items-center mb-3">
        <label htmlFor="" className=" basis-1/3 text-sm">
          Nomor Identitias Pemilik Toko
        </label>

        <div
          type="text"
          className="col-span-2 border p-2 basis-2/3 text-sm rounded"
        >
          {toko.identification_number}
        </div>
      </div>
    </>
  );
}
