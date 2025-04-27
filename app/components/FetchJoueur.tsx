import axios from "axios";
import React, { useState } from "react";

const API_ID = "SW847";
const API_KEY = "3VUjcRMn59";

const FetchJoueur: React.FC = () => {
  const [licence, setLicence] = useState("");
  const [joueur, setJoueur] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJoueur = async () => {
    if (!licence) return;

    try {
      const response = await axios.get("https://apiv2.fftt.com/licence", {
        params: {
          licence,
          id: API_ID,
          key: API_KEY,
          format: "json",
        },
      });

      if (response.data?.licence) {
        setJoueur(response.data.licence);
        setError(null);
      } else {
        setJoueur(null);
        setError("Joueur non trouvé");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des données");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Recherche de joueur FFTT</h2>
      <input
        type="text"
        value={licence}
        onChange={(e) => setLicence(e.target.value)}
        placeholder="Numéro de licence FFTT"
        className="border rounded p-2 w-full mb-4"
      />
      <button
        onClick={fetchJoueur}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Rechercher
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {joueur && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <p>
            <strong>Nom :</strong> {joueur.nom}
          </p>
          <p>
            <strong>Prénom :</strong> {joueur.prenom}
          </p>
          <p>
            <strong>Classement :</strong> {joueur.clast}
          </p>
          <p>
            <strong>Club :</strong> {joueur.nomclub}
          </p>
        </div>
      )}
    </div>
  );
};

export default FetchJoueur;
