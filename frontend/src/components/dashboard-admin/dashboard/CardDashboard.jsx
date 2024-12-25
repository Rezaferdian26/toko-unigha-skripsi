import axios from "axios";
import { FaUser } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
export default function CardDashboard({ title, endpoint }) {
  const { data, error, isLoading } = useSWR(`/api/${endpoint}`, fetcher);
  if (error) return <div>{error.message}</div>;
  if (isLoading)
    return (
      <div className="p-3 m-2 bg-white">
        <Skeleton count={2} />
      </div>
    );
  return (
    <div className="bg-gradient-to-br from-indigo-700 to-blue-400 m-2 text-white shadow rounded">
      <div className="border-b-[1px] border-gray-200 p-3">
        <FaUser className="inline" /> {title}
      </div>
      <p className="p-3 text-lg">{error ? "0" : data.data.length}</p>
    </div>
  );
}
