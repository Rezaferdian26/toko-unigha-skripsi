import Title from "../Title";
import Card from "../Card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Rekomendasi({ allProducts }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);
  return (
    <div className="max-w-5xl px-4 mt-14 mx-auto">
      <Title>Rekomendasi</Title>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
        {products.map((product) => (
          <Link href={`${product.toko_slug}/${product.slug}`} key={product.id}>
            <Card product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
