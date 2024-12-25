export default function Header({ title }) {
  return (
    <div className="bg-white flex justify-end h-16 items-center shadow -z-20">
      <p className="me-3 font-bold text-primary uppercase">
        {title ? title : <span className="loading loading-spinner"></span>}
      </p>
    </div>
  );
}
