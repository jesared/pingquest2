// "use client";

// import { useEffect, useState } from "react";

// import CardPlayer from "./CardPlayer";
// import { EditJoueurForm } from "./EditJoueurForm";

// interface Joueur {
//   id: number;
//   userId: string;
//   dossard: string;
//   numeroLicence: string;
//   nom: string;
//   prenom: string;
//   club: string;
//   pointsOfficiel?: number;
//   engagement: {
//     id: string;
//     event: {
//       tableau: string;
//       id: string;
//     };
//   }[];
// }
// type EditJoueur = {
//   id: number;
//   nom: string;
//   prenom: string;
//   club: string;
//   dossard: string;
//   licence: string;
//   points: number;
//   sexe?: string;
//   engagements: { tournoi: string; epreuves: string[] }[];
// };

// function mapEditToCardPlayer(editJoueur: any): Joueur {
//   return {
//     id: editJoueur.id,
//     userId: "", // Remplis ou récupère si tu as l'info
//     dossard: editJoueur.dossard,
//     numeroLicence: editJoueur.licence,
//     nom: editJoueur.nom,
//     prenom: editJoueur.prenom,
//     club: editJoueur.club,
//     pointsOfficiel: editJoueur.points,
//     engagement: editJoueur.engagements
//       ? editJoueur.engagements[0].epreuves.map(
//           (tableau: string, idx: number) => ({
//             id: "e" + idx, // Génère un id unique ou garde celui d'origine si tu as
//             event: { tableau, id: "t" + idx }, // Idem
//           })
//         )
//       : [],
//     // Ajoute d'autres champs si besoin (photoUrl, sexe, etc.)
//   };
// }

// function mapJoueurCardToEdit(joueurCard: any): EditJoueur {
//   const mapped = {
//     id: joueurCard.id,
//     nom: joueurCard.nom,
//     prenom: joueurCard.prenom,
//     club: joueurCard.club,
//     dossard: joueurCard.dossard,
//     licence: joueurCard.numeroLicence,
//     points: joueurCard.pointsOfficiel ?? 0,
//     sexe: joueurCard.sexe ?? "",
//     engagements: [
//       {
//         tournoi: "Tournoi inconnu",
//         epreuves: joueurCard.engagement.map((eng: any) => eng.event.tableau),
//       },
//     ],
//   };
//   console.log("Résultat du mapping joueur -> editJoueur :", mapped);
//   return mapped;
// }
// export default function ClientParticipants() {
//   const [joueurs, setJoueurs] = useState<Joueur[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editJoueur, setEditJoueur] = useState<EditJoueur | null>(null);
//   useEffect(() => {
//     console.log("editJoueur modifié :", editJoueur);
//   }, [editJoueur]);
//   // const handleDeleteJoueur = (id: number) => {
//   //   setJoueurs((prev) => prev.filter((joueur) => joueur.id !== id));
//   // };
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchCurrentUserId() {
//       try {
//         const res = await fetch("/api/getUser", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({}),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           console.error(
//             "Erreur lors de la récupération du currentUserId",
//             data
//           );
//           setError("Erreur serveur");
//           return;
//         }

//         if (data.id) {
//           setCurrentUserId(data.id);
//         } else {
//           setError("UserId introuvable");
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération du currentUserId", err);
//       }
//     }

//     fetchCurrentUserId();
//   }, []);

//   useEffect(() => {
//     async function fetchJoueurs() {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_SITE_URL}/api/participants`,
//           {
//             cache: "no-store",
//           }
//         );
//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error("Erreur lors de la récupération des joueurs");
//         }

//         setJoueurs(data);
//       } catch (err) {
//         console.error(err);
//         setError(err instanceof Error ? err.message : "Erreur inconnue");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchJoueurs();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="mt-6 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
//         <span className="ml-4 text-sm text-muted-foreground">
//           Chargement...
//         </span>
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-red-500 text-sm mt-4">{error}</p>;
//   }

//   if (joueurs.length === 0) {
//     return (
//       <p className="text-muted-foreground mt-4">Aucun participant trouvé.</p>
//     );
//   }

//   return (
//     <>
//       <div className="flex flex-wrap gap-4">
//         {joueurs.map((joueur) => (
//           <CardPlayer
//             key={joueur.id}
//             joueur={joueur}
//             currentUserId={currentUserId}
//             onEditJoueur={(joueur) => {
//               console.log("Edit joueur parent reçu :", joueur);
//               setEditJoueur(mapJoueurCardToEdit(joueur));
//             }}
//           />
//         ))}
//         {editJoueur && (
//           <EditJoueurForm
//             joueur={editJoueur}
//             open={true}
//             onSave={(updated) => {
//               setJoueurs(
//                 joueurs.map((j) =>
//                   j.id === updated.id ? mapEditToCardPlayer(updated) : j
//                 )
//               );
//               setEditJoueur(null);
//             }}
//             onClose={() => setEditJoueur(null)}
//           />
//         )}
//       </div>
//     </>
//   );
// }
