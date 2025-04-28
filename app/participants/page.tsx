import CardJoueur from "../components/CardJoueur";
import GetParticipants from "../components/GetParticipants";

export default async function ParticipantsPage() {
  const joueurs = await GetParticipants();

  return (
    <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-t-xl dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto text-center ml-4">
        <h1 className="text-2xl font-bold">Les participants</h1>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {joueurs.map((joueur) => (
            <CardJoueur key={joueur.id} joueur={joueur} />
          ))}
        </div>
      </div>
    </div>
  );
}
