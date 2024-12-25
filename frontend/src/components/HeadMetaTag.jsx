import Head from "next/head";

export default function HeadMetaTag({
  title = "Toko Unigha",
  metaDescription = "Jelajahi keajaiban wirausaha akademis di Unigha, platform toko online yang bangga berasal dari lingkungan Universitas Jabal Ghafur. Dukung mahasiswa dan dosen kami dengan berbelanja produk mereka yang kreatif dan inovatif.",
  ogImageUrl = "https://ghxgwx4v-3000.asse.devtunnels.ms/banner-unigha.png",
  pathname = "",
}) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:3000"
      : "https://tokounigha.com";

  const pageUrl = new URL(pathname, baseUrl).toString();

  return (
    <Head>
      <title>{title}</title>
      {/* metadata */}
      <meta name="title" content={title} />
      <meta name="description" content={metaDescription} />
      <meta name="og:image" itemProp="image" content={ogImageUrl} />
      <meta property="og:url" content={pageUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:image" itemProp="image" content={ogImageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta property="twitter:description" content={metaDescription} />
    </Head>
  );
}
