// src/app/shared/validators/match-password.validator.ts
function matchPasswordValidator(passwordKey, confirmPasswordKey) {
  return (control) => {
    const password = control.get(passwordKey)?.value;
    const confirm = control.get(confirmPasswordKey)?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

// src/app/shared/validators/password-strength.validator.ts
function passwordStrengthValidator() {
  return (control) => {
    const value = control.value ?? "";
    const strong = /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value) && value.length >= 8;
    return strong ? null : { passwordStrength: true };
  };
}

export {
  matchPasswordValidator,
  passwordStrengthValidator
};
//# sourceMappingURL=chunk-E67RJVJH.js.map
