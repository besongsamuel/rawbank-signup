import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container,
  Typography, 
  Button, 
  Chip,
  Alert,
  Fade,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { uploadData } from 'aws-amplify/storage';
import StepProgress from '../components/StepProgress';
import { PageTransition } from '../components/Motion';

type IdType = 'passport' | 'nationalId' | 'voterCard' | 'driverLicense';

const idTypes = [
  { value: 'passport', label: 'Passeport' },
  { value: 'nationalId', label: 'Carte d\'identité' },
  { value: 'voterCard', label: 'Carte d\'électeur' },
  { value: 'driverLicense', label: 'Permis de conduire' },
];

export default function IdUpload() {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<IdType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Fichier trop volumineux (max 10 Mo)');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError('Format non supporté (JPG, PNG ou WebP)');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const handleUploadAndExtract = async () => {
    if (!file || !idType) return;

    try {
      setUploading(true);
      setError(null);

      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      
      const result = await uploadData({
        path: `id-documents/${fileName}`,
        data: file,
      }).result;

      localStorage.setItem('uploadedIdKey', result.path);
      localStorage.setItem('idType', idType);

      navigate('/onboarding/extracting', { 
        state: { 
          idType,
          imageKey: result.path,
        } 
      });

    } catch (err) {
      console.error('Upload error:', err);
      setError('Erreur lors du téléchargement');
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '420px !important' }}>
        <StepProgress currentStep={1} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
            }}
          >
            Pièce d'identité
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prenez une photo nette de votre pièce
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: '#0A0A0A',
            }}
          >
            Type de document
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {idTypes.map((type) => (
              <Chip
                key={type.value}
                label={type.label}
                onClick={() => setIdType(type.value as IdType)}
                variant={idType === type.value ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: idType === type.value ? '#FFCC00' : 'transparent',
                  borderColor: idType === type.value ? '#FFCC00' : '#E5E5E5',
                  color: '#0A0A0A',
                  fontWeight: idType === type.value ? 600 : 500,
                  '&:hover': {
                    bgcolor: idType === type.value ? '#FFD633' : '#FAFAFA',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {idType && !file && (
          <Fade in>
            <Box
              sx={{
                border: '2px dashed #E5E5E5',
                borderRadius: 3,
                p: 5,
                textAlign: 'center',
                bgcolor: '#FAFAFA',
                cursor: 'pointer',
                transition: 'all 0.2s',
                mb: 3,
                '&:hover': {
                  borderColor: '#FFCC00',
                  bgcolor: '#FFF9E6',
                },
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CameraAltIcon sx={{ fontSize: 48, color: '#FFCC00', mb: 2 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Prendre une photo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG ou WebP · Max 10 Mo
              </Typography>
            </Box>
          </Fade>
        )}

        {file && (
          <Fade in>
            <Box
              sx={{
                border: '1.5px solid #34C759',
                borderRadius: 3,
                p: 3,
                bgcolor: '#F0FDF4',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ color: '#34C759', fontSize: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} Mo
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}

        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            p: { xs: 2, sm: 0 },
            bgcolor: { xs: '#FFFFFF', sm: 'transparent' },
            borderTop: { xs: '1px solid #F5F5F5', sm: 'none' },
            boxShadow: { xs: '0 -2px 12px rgba(10, 10, 10, 0.06)', sm: 'none' },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleUploadAndExtract}
            disabled={!file || !idType || uploading}
          >
            {uploading ? 'Téléchargement...' : 'Continuer'}
          </Button>

          {!file && (
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/onboarding/remaining')}
              sx={{ mt: 1.5, color: '#5C5C5C' }}
            >
              Saisir manuellement
            </Button>
          )}
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </Container>
    </PageTransition>
  );
}
