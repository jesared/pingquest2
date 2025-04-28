import GetEpreuves from "../components/GetEpreuves";

export default function page() {
  return (
    <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-t-xl dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto text-center ml-4">
        <h1 className="text-2xl font-bold">Les épreuves</h1>
        <GetEpreuves />
      </div>
    </div>
  );
}
