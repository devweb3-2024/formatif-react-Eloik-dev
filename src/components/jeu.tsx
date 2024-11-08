import React, { useState, useEffect } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import GrilleMot from './grillemots';
import { obtenirMotAleatoire, listeMots, formatterMot } from '../utils/mots';
import Clavier from './clavier';

const Jeu: React.FC = () => {
  const [motCible, setMotCible] = useState<string>('');
  const [essais, setEssais] = useState<string[]>([]);
  const [essaiCourant, setEssaiCourant] = useState<string>('');
  const [finPartie, setFinPartie] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    severity: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setMotCible(obtenirMotAleatoire());
  }, []);

  useEffect(() => {
    if (essais.length > 0) {
      verifierDernierEssai();
    }
  }, [essais]);

  const verifierDernierEssai = () => {
    const dernierEssai = essais[essais.length - 1];
    if (dernierEssai === motCible) {
      setFinPartie(true);
      setMessage({
        text: 'Félicitations ! Vous avez trouvé le mot !',
        severity: 'success',
      });
    } else if (essais.length >= 6) {
      setFinPartie(true);
      setMessage({
        text: `Dommage ! Le mot était "${motCible}".`,
        severity: 'error',
      });
    }
  };

  /**
   * ER: Réparation du formattage des mots et de la condition de vérification du mot dans la liste 
   */
  const handleSoumettreEssai = () => {
    if (essaiCourant.length !== 5) {
      setMessage({
        text: 'Le mot doit comporter 5 lettres.',
        severity: 'error',
      });
      return;
    }

    const essaiCourantFormatte = essaiCourant.normalize().toUpperCase();
    const motListe: string | undefined = listeMots.find(mot => {
      return formatterMot(mot) == essaiCourantFormatte
    })

    if (motListe === undefined || !listeMots.includes(motListe)) {
      setMessage({
        text: "Ce mot n'est pas dans la liste.",
        severity: 'error',
      });
      return;
    }

    setEssais([...essais, essaiCourant.toUpperCase()]);
    setEssaiCourant('');
  };

  /**
   * ER: Ajout de cette fonction pour pouvoir redémarrer la partie
   */
  const handleRedemarrer = () => {
    setMotCible(obtenirMotAleatoire());
    setEssais([]);
    setEssaiCourant('');
    setFinPartie(false);
    setMessage(null);
  };

  /**
   * ER: Ajout du callback onRestart à la composante clavier
   * /   Changement du nom de variable de inactif vers finPartie pour la consistence
   */
  return (
    <Container maxWidth="sm">
      <GrilleMot
        essais={essais}
        motCible={motCible}
        essaiCourant={essaiCourant}
      />
      <Clavier
        essaiCourant={essaiCourant}
        setEssaiCourant={setEssaiCourant}
        onEnter={handleSoumettreEssai}
        onRestart={handleRedemarrer}
        finPartie={finPartie}
      />
      {message && (
        <Snackbar open autoHideDuration={6000} onClose={() => setMessage(null)}>
          <Alert
            onClose={() => setMessage(null)}
            severity={message.severity}
            sx={{ width: '100%' }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Jeu;
