import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import CardMyProduct from "./CardMyProduct";
import { useEffect, useState } from "react";
import AddProductView from "./AddProductView";
import EditProduct from "./EditProduct";
import Skeleton from "react-loading-skeleton";

export default function TabProductView({
  products,
  setProducts,
  categories,
  loading,
  setLoading,
}) {
  const [tempProducts, setTempProducts] = useState(products);
  const [addProduct, setAddProduct] = useState(false);
  const [edit, setEdit] = useState(false);
  const [productId, setProductId] = useState(0);

  useEffect(() => {
    setLoading(false);
    setTempProducts(products);
  }, [setLoading, products]);

  if (edit) {
    return (
      <EditProduct
        id={productId}
        setEdit={setEdit}
        products={products}
        setProducts={setProducts}
        categories={categories}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-3 bg-white">
        <Skeleton count={3} />
      </div>
    );
  }

  const handleSearchProduct = (value) => {
    setTempProducts(
      products.filter((product) => {
        return product.name.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  return (
    <>
      {!addProduct && (
        <div className="sm:flex justify-between p-3 bg-white shadow rounded">
          <div className="relative sm:w-1/2">
            <input
              type="text"
              placeholder="Cari produk di etalase"
              className="input input-bordered ps-9 w-full"
              onChange={(e) => {
                handleSearchProduct(e.target.value);
              }}
            />
            <FaMagnifyingGlass className="absolute left-3 top-4" />
          </div>
          <button
            className="btn btn-primary w-full sm:w-auto mt-5 sm:mt-0"
            onClick={() => setAddProduct(true)}
          >
            <FaPlus />
            Tambah Produk Baru
          </button>
        </div>
      )}
      {addProduct ? (
        <AddProductView
          setAddProduct={setAddProduct}
          setProducts={setProducts}
          categories={categories}
        />
      ) : (
        <div>
          {tempProducts.length === 0 ? (
            <div className="bg-white p-10 mt-5 shadow rounded flex items-center justify-center">
              <h1>Belum ada produk</h1>
            </div>
          ) : (
            <>
              {tempProducts.map((product) => (
                <CardMyProduct
                  key={product.id}
                  product={product}
                  setProductId={setProductId}
                  setProducts={setProducts}
                  setEdit={setEdit}
                />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}
