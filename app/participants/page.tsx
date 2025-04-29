import ClientParticipants from "../components/ClientParticipants";

export default async function Page() {
  return (
    <div className="w-full p-4  bg-gray-50 rounded-t-xl dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-bold">Les participants</h1>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <ClientParticipants />
        </div>
      </div>
    </div>
  );
}
