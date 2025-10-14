import { useCallback, useEffect, useState } from "react";

type ValidationRule<T> = {
  field: keyof T;
  validator: (value: any, formData: T) => string | null;
  debounce?: number;
};

export const useRealTimeValidation = <T extends Record<string, any>>(
  formData: T,
  rules: ValidationRule<T>[]
) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [debounceTimers, setDebounceTimers] = useState<
    Partial<Record<keyof T, NodeJS.Timeout>>
  >({});

  const validateField = useCallback(
    (field: keyof T) => {
      const rule = rules.find((r) => r.field === field);
      if (!rule) return null;

      const error = rule.validator(formData[field], formData);
      setErrors((prev) => ({
        ...prev,
        [field]: error || undefined,
      }));
      return error;
    },
    [formData, rules]
  );

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    rules.forEach((rule) => {
      const error = rule.validator(formData[rule.field], formData);
      if (error) {
        newErrors[rule.field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, rules]);

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field);
    },
    [validateField]
  );

  const handleChange = useCallback(
    (field: keyof T) => {
      const rule = rules.find((r) => r.field === field);

      // Clear any existing timer
      if (debounceTimers[field]) {
        clearTimeout(debounceTimers[field]);
      }

      // If field has been touched, validate with debounce
      if (touched[field] && rule) {
        const debounceTime = rule.debounce || 500;
        const timer = setTimeout(() => {
          validateField(field);
        }, debounceTime);

        setDebounceTimers((prev) => ({
          ...prev,
          [field]: timer,
        }));
      }
    },
    [debounceTimers, rules, touched, validateField]
  );

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [debounceTimers]);

  return {
    errors,
    touched,
    validateField,
    validateAll,
    handleBlur,
    handleChange,
    clearError,
    clearAllErrors,
  };
};

// Common validation rules
export const validators = {
  required:
    (message = "Ce champ est requis") =>
    (value: any) =>
      !value || (typeof value === "string" && !value.trim()) ? message : null,

  email:
    (message = "Email invalide") =>
    (value: string) =>
      value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ? message
        : null,

  minLength:
    (min: number, message = `Minimum ${min} caractères`) =>
    (value: string) =>
      value && value.length < min ? message : null,

  maxLength:
    (max: number, message = `Maximum ${max} caractères`) =>
    (value: string) =>
      value && value.length > max ? message : null,

  phone:
    (message = "Numéro de téléphone invalide") =>
    (value: string) =>
      value && !/^(\+243|0)[0-9]{9}$/.test(value.replace(/\s/g, ""))
        ? message
        : null,

  numeric:
    (message = "Doit être un nombre") =>
    (value: any) =>
      value && isNaN(Number(value)) ? message : null,

  min:
    (min: number, message = `Doit être au moins ${min}`) =>
    (value: number) =>
      value !== undefined && value !== null && value < min ? message : null,

  max:
    (max: number, message = `Ne peut pas dépasser ${max}`) =>
    (value: number) =>
      value !== undefined && value !== null && value > max ? message : null,

  date:
    (message = "Date invalide") =>
    (value: string) =>
      value && isNaN(new Date(value).getTime()) ? message : null,

  pastDate:
    (message = "La date doit être dans le passé") =>
    (value: string) =>
      value && new Date(value) > new Date() ? message : null,

  futureDate:
    (message = "La date doit être dans le futur") =>
    (value: string) =>
      value && new Date(value) < new Date() ? message : null,

  age:
    (minAge: number, message = `Vous devez avoir au moins ${minAge} ans`) =>
    (value: string) => {
      if (!value) return null;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;
      return actualAge < minAge ? message : null;
    },

  compose:
    (...validators: Array<(value: any) => string | null>) =>
    (value: any) => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return null;
    },
};
