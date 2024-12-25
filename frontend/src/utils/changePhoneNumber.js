export default function changePhoneNumber(nomor) {
  // Menghilangkan karakter non-angka dari nomor telepon (seperti spasi, tanda "-", dan sebagainya)
  nomor = nomor.replace(/\D/g, "");
  // Memastikan nomor telepon dimulai dengan "62"
  if (nomor.length > 0) {
    if (nomor[0] === "0") {
      nomor = nomor.replace(nomor[0], "62");
    }
  }
  return nomor;
}
