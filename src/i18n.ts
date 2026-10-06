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
      },
      
      // Auth
      auth: {
        signIn: 'Se connecter',
        signUp: "S'inscrire",
        signOut: 'Se déconnecter',
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        noAccount: "Pas encore de compte?",
        haveAccount: 'Vous avez déjà un compte?',
        verifyEmail: 'Vérifiez votre e-mail',
        verificationCode: 'Code de vérification',
        resendCode: 'Renvoyer le code',
        welcome: 'Bienvenue chez Rawbank',
        subtitle: 'Ouvrez votre compte en quelques minutes',
      },
      
      // Steps
      steps: {
        idUpload: 'Document d\'identité',
        personalInfo: 'Informations personnelles',
        compliance: 'Conformité',
        review: 'Vérification',
        complete: 'Terminé',
      },
      
      // ID Upload
      idUpload: {
        title: 'Téléchargez votre pièce d\'identité',
        subtitle: 'Nous utiliserons l\'IA pour extraire automatiquement vos informations',
        selectType: 'Type de document',
        passport: 'Passeport',
        nationalId: 'Carte d\'identité nationale',
        voterCard: 'Carte d\'électeur',
        driverLicense: 'Permis de conduire',
        uploadImage: 'Télécharger une photo',
        dragDrop: 'Glissez-déposez votre document ici',
        or: 'ou',
        clickToUpload: 'Cliquez pour télécharger',
        supported: 'JPG, PNG ou PDF (max 10 Mo)',
        uploading: 'Téléchargement...',
        extracting: 'Extraction des données...',
        aiMagic: 'Notre IA analyse votre document',
        reviewing: 'Vérification des informations extraites',
      },
      
      // Personal Info
      personalInfo: {
        title: 'Vérifiez vos informations',
        subtitle: 'Confirmez ou modifiez les informations extraites',
        civility: 'Civilité',
        mr: 'Monsieur',
        mrs: 'Madame',
        ms: 'Mademoiselle',
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
      },
      
      // FATCA
      fatca: {
        title: 'Déclaration FATCA',
        subtitle: 'Foreign Account Tax Compliance Act',
        question: 'Êtes-vous une personne imposable aux États-Unis?',
        yes: 'Oui',
        no: 'Non',
        usCitizen: 'Citoyen américain',
        usBorn: 'Né aux États-Unis',
        usResident: 'Résident américain',
        usAddress: 'Adresse américaine',
        usPhone: 'Numéro de téléphone américain',
        tin: 'Numéro d\'identification fiscale (TIN)',
      },
      
      // PEP
      pep: {
        title: 'Déclaration PEP',
        subtitle: 'Personne Politiquement Exposée',
        question: 'Êtes-vous une personne politiquement exposée?',
        description: 'Cela inclut les hauts fonctionnaires, dirigeants politiques, ou leurs proches',
        yes: 'Oui',
        no: 'Non',
        position: 'Fonction',
        organization: 'Organisation',
      },
      
      // Dashboard
      dashboard: {
        title: 'Tableau de bord',
        welcome: 'Bienvenue',
        accountOpened: 'Votre compte est en cours d\'ouverture',
        nextSteps: 'Prochaines étapes',
        pending: 'En attente de vérification',
        approved: 'Approuvé',
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
        welcome: 'Welcome to Rawbank',
        subtitle: 'Open your account in minutes',
      },
      
      // Steps
      steps: {
        idUpload: 'ID Document',
        personalInfo: 'Personal Information',
        compliance: 'Compliance',
        review: 'Review',
        complete: 'Complete',
      },
      
      // ID Upload
      idUpload: {
        title: 'Upload your ID document',
        subtitle: 'We\'ll use AI to automatically extract your information',
        selectType: 'Document type',
        passport: 'Passport',
        nationalId: 'National ID Card',
        voterCard: 'Voter Card',
        driverLicense: 'Driver License',
        uploadImage: 'Upload photo',
        dragDrop: 'Drag and drop your document here',
        or: 'or',
        clickToUpload: 'Click to upload',
        supported: 'JPG, PNG or PDF (max 10 MB)',
        uploading: 'Uploading...',
        extracting: 'Extracting data...',
        aiMagic: 'Our AI is analyzing your document',
        reviewing: 'Review extracted information',
      },
      
      // Personal Info
      personalInfo: {
        title: 'Verify your information',
        subtitle: 'Confirm or edit the extracted information',
        civility: 'Title',
        mr: 'Mr.',
        mrs: 'Mrs.',
        ms: 'Ms.',
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
      },
      
      // FATCA
      fatca: {
        title: 'FATCA Declaration',
        subtitle: 'Foreign Account Tax Compliance Act',
        question: 'Are you a U.S. taxpayer?',
        yes: 'Yes',
        no: 'No',
        usCitizen: 'U.S. Citizen',
        usBorn: 'Born in the U.S.',
        usResident: 'U.S. Resident',
        usAddress: 'U.S. Address',
        usPhone: 'U.S. Phone number',
        tin: 'Tax Identification Number (TIN)',
      },
      
      // PEP
      pep: {
        title: 'PEP Declaration',
        subtitle: 'Politically Exposed Person',
        question: 'Are you a politically exposed person?',
        description: 'This includes senior officials, political leaders, or their close associates',
        yes: 'Yes',
        no: 'No',
        position: 'Position',
        organization: 'Organization',
      },
      
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome',
        accountOpened: 'Your account is being opened',
        nextSteps: 'Next steps',
        pending: 'Pending verification',
        approved: 'Approved',
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
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
