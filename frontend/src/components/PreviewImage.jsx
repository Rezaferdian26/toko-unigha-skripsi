import Image from "next/legacy/image";
import { useState } from "react";

export default function PreviewImage({ file }) {
  const [preview, setPreview] = useState({});
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  }
  return (
    <div className="my-3">
      <Image src={preview} alt="preview" width={200} height={200} />
    </div>
  );
}
