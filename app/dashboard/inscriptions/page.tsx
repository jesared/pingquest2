import GetInscriptions from "@/app/components/GetInscriptions";

export default function Page() {
  return (
    <div className="max-w-3xl p-4 mx-auto bg-gray-50 rounded-t-xl dark:border-gray-600">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Vos inscriptions</h1>
      </div>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <GetInscriptions />
      </div>
    </div>
  );
}
