export default async function Page() {
  return (
    <div className="max-w-2xl p-4 mx-auto bg-gray-50 rounded-t-xl dark:border-gray-600">
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-bold">Les participants</h1>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {/* <ClientParticipants /> */}
        </div>
      </div>
    </div>
  );
}
