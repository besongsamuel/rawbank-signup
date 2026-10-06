import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Common
      common: {
        continue: 'Continuer',
        back: 'Retour',
        next: 'Suivant',
        confirm: 'Confirmer',
        edit: 'Modifier',
        cancel: 'Annuler',
        save: 'Enregistrer',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        optional: 'Optionnel',
        duration: 'Durée',
        minutes: 'minutes',
        notes: 'Notes',
      },
      
      // Auth
      auth: {
        signIn: 'Se connecter',
        signUp: "S'inscrire",
        signOut: 'Se déconnecter',
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        confirmPassword: 'Confirmez le mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        noAccount: "Pas encore de compte?",
        haveAccount: 'Vous avez déjà un compte?',
        verifyEmail: 'Vérifiez votre e-mail',
        verificationCode: 'Code de vérification',
        resendCode: 'Renvoyer le code',
        createAccount: 'Créez votre compte',
        signInTitle: 'Connexion',
        accessAccount: 'Accédez à votre compte',
        simpleAndFast: 'C\'est simple et rapide',
        connectNow: 'Connectez-vous',
        registerNow: 'Inscrivez-vous',
        minPassword: 'Minimum 8 caractères',
      },
      
      // Welcome
      welcome: {
        tagline: 'Ouvrez votre compte en quelques minutes',
        continue: 'Continuer',
        haveAccount: 'J\'ai déjà un compte',
      },
      
      // Steps
      steps: {
        step: 'Étape',
        of: 'sur',
      },
      
      // ID Upload
      idUpload: {
        title: 'Pièce d\'identité',
        subtitle: 'Prenez une photo nette de votre pièce',
        selectType: 'Type de document',
        passport: 'Passeport',
        nationalId: 'Carte d\'identité',
        voterCard: 'Carte d\'électeur',
        driverLicense: 'Permis de conduire',
        uploadImage: 'Télécharger une photo',
        takePhoto: 'Prendre une photo',
        dragDrop: 'Glissez-déposez votre document ici',
        or: 'ou',
        clickToUpload: 'Cliquez pour télécharger',
        supported: 'JPG, PNG ou WebP · Max 10 Mo',
        uploading: 'Téléchargement...',
        extracting: 'Extraction des données...',
        manualEntry: 'Saisir manuellement',
        fileTooLarge: 'Fichier trop volumineux (max 10 Mo)',
        unsupportedFormat: 'Format non supporté (JPG, PNG ou WebP)',
      },
      
      // Extracting
      extracting: {
        title: 'Extraction en cours...',
        subtitle: 'Notre IA analyse votre document',
      },
      
      // Confirm Data
      confirmData: {
        title: 'Vérifiez ces informations',
        subtitle: 'Modifiez si nécessaire',
      },
      
      // Remaining Info
      remainingInfo: {
        title: 'Complétez ces informations',
        subtitle: 'Quelques détails supplémentaires',
        phone: 'Téléphone',
        phoneHelper: 'Nous enverrons un code de vérification',
        address: 'Adresse',
        city: 'Ville',
      },
      
      // Personal Info
      personalInfo: {
        firstName: 'Prénom',
        middleName: 'Postnom',
        lastName: 'Nom',
        birthDate: 'Date de naissance',
        birthPlace: 'Lieu de naissance',
        nationality: 'Nationalité',
        gender: 'Sexe',
        male: 'Masculin',
        female: 'Féminin',
        address: 'Adresse',
        city: 'Ville',
        province: 'Province',
        country: 'Pays',
        phone: 'Téléphone',
        idNumber: 'Numéro de document',
        postnomHelper: 'Nom de famille maternel',
      },
      
      // OTP Verify
      otp: {
        title: 'Vérifiez votre numéro',
        subtitle: 'Entrez le code envoyé par SMS',
        code: 'Code de vérification',
        noCode: 'Vous n\'avez pas reçu le code?',
        resend: 'Renvoyer',
        verify: 'Vérifier',
      },
      
      // Dashboard / Success
      dashboard: {
        title: 'Demande envoyée!',
        subtitle: 'Votre demande d\'ouverture de compte est en cours de traitement',
        nextSteps: 'Prochaines étapes',
        step1: 'Notre équipe vérifie vos documents (24-48h)',
        step2: 'Vous recevrez un e-mail de confirmation',
        step3: 'Passez retirer votre carte dans une agence Rawbank',
        signOut: 'Se déconnecter',
      },
      
      // Clerk - Calendar
      clerk: {
        todayAgenda: 'Rendez-vous du jour',
        noAppointments: 'Aucun rendez-vous pour aujourd\'hui',
        time: 'Heure',
        client: 'Client',
        status: 'Statut',
        code: 'Code',
        
        // Status
        scheduled: 'Prévu',
        checkedIn: 'Arrivé',
        inProgress: 'En cours',
        completed: 'Terminé',
        noShow: 'Absent',
        rescheduled: 'Reprogrammé',
        cancelled: 'Annulé',
        
        // Meeting Detail
        meetingDetail: 'Détails du rendez-vous',
        newClient: 'Nouveau client',
        extractedByAI: 'Données extraites par IA',
        fullName: 'Nom complet',
        confidence: 'Confiance',
        toComplete: 'À compléter pendant l\'entretien',
        startMeeting: 'Démarrer l\'entretien',
        meetingInProgress: 'Entretien en cours depuis',
        endMeeting: 'Terminer l\'entretien',
        
        // Complete Meeting
        completeMeeting: 'Terminer l\'entretien',
        outcome: 'Résultat de l\'entretien',
        accountOpened: 'Compte ouvert avec succès',
        clientAbsent: 'Client absent',
        rescheduledMeeting: 'Reprogrammé',
        notesOptional: 'Notes (optionnel)',
        notesPlaceholder: 'Observations, documents manquants, etc.',
        saveAndComplete: 'Enregistrer et terminer',
        saving: 'Enregistrement...',
        durationExceeded: 'Durée supérieure à la cible (30 min)',
      },
      
      // Cities
      cities: {
        kinshasa: 'Kinshasa',
        lubumbashi: 'Lubumbashi',
        goma: 'Goma',
        bukavu: 'Bukavu',
        kisangani: 'Kisangani',
      },
    },
  },
  en: {
    translation: {
      // Common
      common: {
        continue: 'Continue',
        back: 'Back',
        next: 'Next',
        confirm: 'Confirm',
        edit: 'Edit',
        cancel: 'Cancel',
        save: 'Save',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        optional: 'Optional',
        duration: 'Duration',
        minutes: 'minutes',
        notes: 'Notes',
      },
      
      // Auth
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm password',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        verifyEmail: 'Verify your email',
        verificationCode: 'Verification code',
        resendCode: 'Resend code',
        createAccount: 'Create your account',
        signInTitle: 'Sign In',
        accessAccount: 'Access your account',
        simpleAndFast: 'It\'s simple and fast',
        connectNow: 'Sign in',
        registerNow: 'Sign up',
        minPassword: 'Minimum 8 characters',
      },
      
      // Welcome
      welcome: {
        tagline: 'Open your account in minutes',
        continue: 'Continue',
        haveAccount: 'I already have an account',
      },
      
      // Steps
      steps: {
        step: 'Step',
        of: 'of',
      },
      
      // ID Upload
      idUpload: {
        title: 'Identity Document',
        subtitle: 'Take a clear photo of your document',
        selectType: 'Document type',
        passport: 'Passport',
        nationalId: 'National ID Card',
        voterCard: 'Voter Card',
        driverLicense: 'Driver License',
        uploadImage: 'Upload photo',
        takePhoto: 'Take a photo',
        dragDrop: 'Drag and drop your document here',
        or: 'or',
        clickToUpload: 'Click to upload',
        supported: 'JPG, PNG or WebP · Max 10 MB',
        uploading: 'Uploading...',
        extracting: 'Extracting data...',
        manualEntry: 'Enter manually',
        fileTooLarge: 'File too large (max 10 MB)',
        unsupportedFormat: 'Unsupported format (JPG, PNG or WebP)',
      },
      
      // Extracting
      extracting: {
        title: 'Extracting...',
        subtitle: 'Our AI is analyzing your document',
      },
      
      // Confirm Data
      confirmData: {
        title: 'Verify this information',
        subtitle: 'Edit if necessary',
      },
      
      // Remaining Info
      remainingInfo: {
        title: 'Complete this information',
        subtitle: 'A few additional details',
        phone: 'Phone',
        phoneHelper: 'We will send a verification code',
        address: 'Address',
        city: 'City',
      },
      
      // Personal Info
      personalInfo: {
        firstName: 'First name',
        middleName: 'Middle name',
        lastName: 'Last name',
        birthDate: 'Date of birth',
        birthPlace: 'Place of birth',
        nationality: 'Nationality',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        address: 'Address',
        city: 'City',
        province: 'Province',
        country: 'Country',
        phone: 'Phone',
        idNumber: 'Document number',
        postnomHelper: 'Mother\'s maiden name',
      },
      
      // OTP Verify
      otp: {
        title: 'Verify your number',
        subtitle: 'Enter the code sent by SMS',
        code: 'Verification code',
        noCode: 'Didn\'t receive the code?',
        resend: 'Resend',
        verify: 'Verify',
      },
      
      // Dashboard / Success
      dashboard: {
        title: 'Request sent!',
        subtitle: 'Your account opening request is being processed',
        nextSteps: 'Next steps',
        step1: 'Our team verifies your documents (24-48h)',
        step2: 'You will receive a confirmation email',
        step3: 'Pick up your card at a Rawbank branch',
        signOut: 'Sign out',
      },
      
      // Clerk - Calendar
      clerk: {
        todayAgenda: 'Today\'s Appointments',
        noAppointments: 'No appointments for today',
        time: 'Time',
        client: 'Client',
        status: 'Status',
        code: 'Code',
        
        // Status
        scheduled: 'Scheduled',
        checkedIn: 'Checked In',
        inProgress: 'In Progress',
        completed: 'Completed',
        noShow: 'No Show',
        rescheduled: 'Rescheduled',
        cancelled: 'Cancelled',
        
        // Meeting Detail
        meetingDetail: 'Appointment Details',
        newClient: 'New client',
        extractedByAI: 'AI-extracted data',
        fullName: 'Full name',
        confidence: 'Confidence',
        toComplete: 'To complete during interview',
        startMeeting: 'Start interview',
        meetingInProgress: 'Interview in progress for',
        endMeeting: 'End interview',
        
        // Complete Meeting
        completeMeeting: 'Complete interview',
        outcome: 'Interview outcome',
        accountOpened: 'Account opened successfully',
        clientAbsent: 'Client absent',
        rescheduledMeeting: 'Rescheduled',
        notesOptional: 'Notes (optional)',
        notesPlaceholder: 'Observations, missing documents, etc.',
        saveAndComplete: 'Save and complete',
        saving: 'Saving...',
        durationExceeded: 'Duration exceeded target (30 min)',
      },
      
      // Cities
      cities: {
        kinshasa: 'Kinshasa',
        lubumbashi: 'Lubumbashi',
        goma: 'Goma',
        bukavu: 'Bukavu',
        kisangani: 'Kisangani',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
