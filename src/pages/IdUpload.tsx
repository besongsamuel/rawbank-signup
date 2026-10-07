import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Alert,
  Fade,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { uploadData } from 'aws-amplify/storage';
import PageShell from '../components/PageShell';
import StepProgress from '../components/StepProgress';
import { PageTransition } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { ONBOARDING_STEP_COUNT } from '../onboarding/catalog';
import { readReturnTo } from '../onboarding/navigation';

type IdType = 'passport' | 'nationalId' | 'voterCard' | 'driverLicense';

const idTypes = [
  { value: 'passport', label: 'Passeport' },
  { value: 'nationalId', label: 'Carte d\'identité' },
  { value: 'voterCard', label: 'Carte d\'électeur' },
  { value: 'driverLicense', label: 'Permis de conduire' },
];

export default function IdUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = readReturnTo(location.state);
  const { profile, save } = useAmplifyProfile();
  const [idType, setIdType] = useState<IdType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.idType && idTypes.some((type) => type.value === profile.idType)) {
      setIdType(profile.idType as IdType);
    }
  }, [profile]);

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

      await save({ idType, idImageKey: result.path, currentStep: 'identity' });

      navigate('/onboarding/extracting', {
        state: {
          idType,
          imageKey: result.path,
          returnTo,
        },
      });

    } catch (err) {
      console.error('Upload error:', err);
      setError('Erreur lors du téléchargement');
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <PageShell>
        <AuthBackButton onClick={() => navigate(returnTo ?? '/onboarding/account')} />
        <StepProgress currentStep={2} totalSteps={ONBOARDING_STEP_COUNT} />

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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr' },
              gap: 1.5,
              alignItems: 'stretch',
            }}
          >
            {idTypes.map((type) => {
              const selected = idType === type.value;
              return (
                <Button
                  key={type.value}
                  type="button"
                  variant="outlined"
                  onClick={() => setIdType(type.value as IdType)}
                  aria-pressed={selected}
                  sx={{
                    width: '100%',
                    minHeight: 56,
                    height: '100%',
                    px: 1.5,
                    whiteSpace: 'normal',
                    lineHeight: 1.3,
                    textAlign: 'center',
                    color: '#0A0A0A',
                    fontWeight: selected ? 600 : 500,
                    bgcolor: selected ? '#FFCC00' : '#FFFFFF',
                    borderColor: selected ? '#FFCC00' : '#E5E5E5',
                    '&:hover': {
                      bgcolor: selected ? '#FFD633' : '#FAFAFA',
                      borderColor: selected ? '#FFD633' : '#0A0A0A',
                    },
                  }}
                >
                  {type.label}
                </Button>
              );
            })}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleUploadAndExtract}
              disabled={!file || !idType || uploading}
              sx={{
                '&.Mui-disabled': {
                  bgcolor: '#E5E5E5',
                  color: '#5C5C5C',
                },
              }}
            >
              {uploading ? 'Téléchargement...' : 'Continuer'}
            </Button>

            {!file && (
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/onboarding/confirm', { state: { manual: true, idType, returnTo } })}
                sx={{ color: '#5C5C5C' }}
              >
                Saisir manuellement
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </PageShell>
    </PageTransition>
  );
}
