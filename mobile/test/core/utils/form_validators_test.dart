import 'package:flutter_test/flutter_test.dart';
import 'package:cusco_reporta_mobile/core/utils/form_validators.dart';

void main() {
  group('FormValidators Unit Tests', () {
    test('validateEmail acepta correos válidos', () {
      expect(FormValidators.validateEmail('ciudadano@gmail.com'), isNull);
      expect(FormValidators.validateEmail('autoridad@santiago.gob.pe'), isNull);
      expect(FormValidators.validateEmail('user.name@sub.domain.org'), isNull);
    });

    test('validateEmail rechaza correos inválidos o vacíos', () {
      expect(FormValidators.validateEmail(null), 'El correo electrónico es obligatorio');
      expect(FormValidators.validateEmail(''), 'El correo electrónico es obligatorio');
      expect(FormValidators.validateEmail('   '), 'El correo electrónico es obligatorio');
      expect(FormValidators.validateEmail('correo-sin-arroba.com'), 'Ingrese un formato de correo electrónico válido');
      expect(FormValidators.validateEmail('correo@sin-dominio'), 'Ingrese un formato de correo electrónico válido');
    });

    test('validatePassword exige al menos 6 caracteres con letras y números', () {
      expect(FormValidators.validatePassword(null), 'La contraseña es obligatoria');
      expect(FormValidators.validatePassword(''), 'La contraseña es obligatoria');
      expect(FormValidators.validatePassword('12345'), 'Debe tener como mínimo 6 caracteres');
      expect(FormValidators.validatePassword('abcdef'), 'Debe contener al menos una letra y un número');
      expect(FormValidators.validatePassword('123456'), 'Debe contener al menos una letra y un número');
      expect(FormValidators.validatePassword('pass123'), isNull);
      expect(FormValidators.validatePassword('Segura2026'), isNull);
    });

    test('validateConfirmPassword verifica coincidencia exacta', () {
      expect(FormValidators.validateConfirmPassword(null, 'pass123'), 'Confirme su contraseña');
      expect(FormValidators.validateConfirmPassword('pass124', 'pass123'), 'Las contraseñas no coinciden');
      expect(FormValidators.validateConfirmPassword('pass123', 'pass123'), isNull);
    });

    test('validateRequired verifica campos no vacíos', () {
      expect(FormValidators.validateRequired(null, 'El título'), 'El título es obligatorio');
      expect(FormValidators.validateRequired('   ', 'El título'), 'El título es obligatorio');
      expect(FormValidators.validateRequired('Hueco en pista', 'El título'), isNull);
    });

    test('validateMinLength verifica longitud mínima', () {
      expect(FormValidators.validateMinLength(null, 10, 'La descripción'), 'La descripción es obligatorio');
      expect(FormValidators.validateMinLength('Corto', 10, 'La descripción'), 'La descripción debe tener al menos 10 caracteres');
      expect(FormValidators.validateMinLength('Esta descripción es suficientemente detallada', 10, 'La descripción'), isNull);
    });
  });
}
