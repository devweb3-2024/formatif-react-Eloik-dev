import React from 'react';
import { TextField, Box, Button } from '@mui/material';

interface ClavierProps {
  essaiCourant: string;
  setEssaiCourant: React.Dispatch<React.SetStateAction<string>>;
  onEnter: () => void;
  onRestart: () => void;
  finPartie: boolean;
}

/**
 * ER: Ajout du callback onRestart afin de redémarrer la partie
 *     Renommé inactif pour finPartie pour la consistence
 *     Ajout d'un bouton de redémarrage affiché conditionnellement
 *      
 */
const Clavier: React.FC<ClavierProps> = ({
  essaiCourant,
  setEssaiCourant,
  onEnter,
  onRestart,
  finPartie,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z]{0,5}$/.test(value)) {
      setEssaiCourant(value);
    }
  };

  /**
   * ER: Retirement de fullWidth car causait des problèmes de CSS
   */
  return (
    <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
      <TextField
        label="Entrez un mot"
        variant="outlined"
        value={essaiCourant}
        onChange={handleChange}
        disabled={finPartie}
        slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }}
      />
      {finPartie ?
        <Button variant="contained" onClick={onRestart}>
          Redémarrer
        </Button>
        :
        <Button variant="contained" onClick={onEnter}>
          Entrer
        </Button>
      }
    </Box>
  );
};

export default Clavier;
