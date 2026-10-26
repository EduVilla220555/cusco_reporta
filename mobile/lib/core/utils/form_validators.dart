/// Validadores robustos para formularios Flutter según lineamientos de la Guía Práctica 07
class FormValidators {
  FormValidators._();

  static final RegExp _emailRegex = RegExp(
    r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
  );

  /// Mínimo 6 caracteres, al menos una letra y un número
  static final RegExp _passwordRegex = RegExp(
    r'^(?=.*[a-zA-Z])(?=.*\d).{6,}$',
  );

  /// Validador de correo electrónico institucional o personal
  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'El correo electrónico es obligatorio';
    }
    if (!_emailRegex.hasMatch(value.trim())) {
      return 'Ingrese un formato de correo electrónico válido';
    }
    return null;
  }

  /// Validador de contraseña segura
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'La contraseña es obligatoria';
    }
    if (value.length < 6) {
      return 'Debe tener como mínimo 6 caracteres';
    }
    if (!_passwordRegex.hasMatch(value)) {
      return 'Debe contener al menos una letra y un número';
    }
    return null;
  }

  /// Validador de coincidencia de contraseñas
  static String? validateConfirmPassword(String? value, String originalPassword) {
    if (value == null || value.isEmpty) {
      return 'Confirme su contraseña';
    }
    if (value != originalPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  }

  /// Validador genérico de campos requeridos
  static String? validateRequired(String? value, String fieldLabel) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldLabel es obligatorio';
    }
    return null;
  }

  /// Validador de longitud mínima de texto (ej. descripción)
  static String? validateMinLength(String? value, int minLength, String fieldLabel) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldLabel es obligatorio';
    }
    if (value.trim().length < minLength) {
      return '$fieldLabel debe tener al menos $minLength caracteres';
    }
    return null;
  }
}
