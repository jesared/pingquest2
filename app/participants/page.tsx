import CardPlayer from "../components/CardPlayer";
import GetParticipants from "../components/GetParticipants";

export default async function Page() {
  const joueurs = await GetParticipants();

  return (
    <div className="w-full p-4  bg-gray-50 rounded-t-xl dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-bold">Les participants</h1>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {joueurs.map((joueur) => (
            <CardPlayer key={joueur.id} joueur={joueur} />
          ))}
        </div>
      </div>
    </div>
  );
}
