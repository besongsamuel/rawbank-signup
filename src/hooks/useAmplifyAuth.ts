import { useCallback, useState } from 'react';
import {
  autoSignIn,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signUp,
} from 'aws-amplify/auth';

function errorName(error: unknown): string {
  if (error && typeof error === 'object' && 'name' in error) {
    return String((error as { name: unknown }).name);
  }
  return '';
}

export function authErrorMessage(error: unknown): string {
  switch (errorName(error)) {
    case 'UsernameExistsException':
      return 'Un compte existe déjà avec cette adresse e-mail. Connectez-vous.';
    case 'InvalidPasswordException':
      return 'Choisissez un mot de passe plus sûr : 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.';
    case 'InvalidParameterException':
      return 'Vérifiez votre adresse e-mail et votre mot de passe, puis réessayez.';
    case 'CodeMismatchException':
      return 'Ce code est incorrect. Ouvrez l’e-mail et réessayez.';
    case 'ExpiredCodeException':
      return 'Ce code a expiré. Demandez un nouveau code.';
    case 'NotAuthorizedException':
    case 'UserNotFoundException':
      return 'E-mail ou mot de passe incorrect.';
    case 'UserNotConfirmedException':
      return 'Confirmez d’abord votre adresse e-mail.';
    case 'LimitExceededException':
      return 'Trop de tentatives. Patientez un moment, puis réessayez.';
    default:
      return 'Une erreur est survenue. Réessayez dans un instant.';
  }
}

export function passwordChecks(password: string) {
  return [
    { label: '8 caractères', ok: password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Une minuscule', ok: /[a-z]/.test(password) },
    { label: 'Un chiffre', ok: /\d/.test(password) },
    { label: 'Un symbole', ok: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function goToOnboarding() {
  window.location.assign('/account');
}

export function useAmplifyAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const clearFeedback = useCallback(() => {
    setError('');
    setNotice('');
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    clearFeedback();
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
          autoSignIn: true,
        },
      });

      if (result.nextStep.signUpStep === 'DONE') {
        const signedIn = await signIn({ username: email, password });
        if (signedIn.isSignedIn) {
          goToOnboarding();
        }
        return 'signed-in' as const;
      }

      setNotice(`Nous avons envoyé un code à ${email}.`);
      return 'confirm' as const;
    } catch (err) {
      setError(authErrorMessage(err));
      return 'error' as const;
    } finally {
      setLoading(false);
    }
  }, [clearFeedback]);

  const confirm = useCallback(async (email: string, code: string, password: string) => {
    setLoading(true);
    clearFeedback();
    try {
      const confirmed = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (confirmed.nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
        const signedIn = await autoSignIn();
        if (signedIn.isSignedIn) {
          goToOnboarding();
          return 'signed-in' as const;
        }
      }

      const signedIn = await signIn({ username: email, password });
      if (signedIn.isSignedIn) {
        goToOnboarding();
        return 'signed-in' as const;
      }

      if (signedIn.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setError('Le compte n’est pas encore confirmé. Vérifiez le code reçu par e-mail.');
        return 'confirm' as const;
      }

      setError('Le compte est confirmé, mais la connexion n’a pas abouti. Réessayez.');
      return 'error' as const;
    } catch (err) {
      setError(authErrorMessage(err));
      return 'error' as const;
    } finally {
      setLoading(false);
    }
  }, [clearFeedback]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    clearFeedback();
    try {
      const result = await signIn({ username: email, password });

      if (result.isSignedIn) {
        goToOnboarding();
        return 'signed-in' as const;
      }

      if (result.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setNotice(`Confirmez ${email} avec le code reçu par e-mail.`);
        return 'confirm' as const;
      }

      setError('Une étape supplémentaire est nécessaire pour ouvrir la session.');
      return 'error' as const;
    } catch (err) {
      if (errorName(err) === 'UserNotConfirmedException') {
        setNotice(`Confirmez ${email} avec le code reçu par e-mail.`);
        return 'confirm' as const;
      }
      setError(authErrorMessage(err));
      return 'error' as const;
    } finally {
      setLoading(false);
    }
  }, [clearFeedback]);

  const resend = useCallback(async (email: string) => {
    setLoading(true);
    clearFeedback();
    try {
      await resendSignUpCode({ username: email });
      setNotice('Un nouveau code a été envoyé.');
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [clearFeedback]);

  return { loading, error, notice, clearFeedback, register, confirm, login, resend };
}
