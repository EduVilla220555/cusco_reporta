import 'package:flutter_test/flutter_test.dart';
import 'package:cusco_reporta_mobile/features/auth/data/models/user_model.dart';

void main() {
  group('UserModel & UserEntity Tests', () {
    test('UserModel.fromJson deserializa correctamente datos del backend', () {
      final json = {
        'id': 1,
        'name': 'Juan Pérez',
        'email': 'juan@example.com',
        'role': 'citizen',
        'token': 'jwt_abc_123',
      };

      final model = UserModel.fromJson(json);

      expect(model.id, 1);
      expect(model.name, 'Juan Pérez');
      expect(model.email, 'juan@example.com');
      expect(model.role, 'citizen');
      expect(model.token, 'jwt_abc_123');
      expect(model.isCitizen, isTrue);
      expect(model.isAuthority, isFalse);
      expect(model.isAdmin, isFalse);
      expect(model.roleDisplayName, 'Ciudadano');
    });

    test('UserModel verifica roles de Autoridad y Administrador', () {
      final authority = UserModel.fromJson({
        'id': 2,
        'name': 'Ing. Carlos Mendoza',
        'email': 'autoridad@santiago.gob.pe',
        'role': 'authority',
      });

      expect(authority.isAuthority, isTrue);
      expect(authority.roleDisplayName, 'Autoridad Municipal');

      final admin = UserModel.fromJson({
        'id': 3,
        'name': 'Super Admin',
        'email': 'admin@santiago.gob.pe',
        'role': 'admin',
      });

      expect(admin.isAdmin, isTrue);
      expect(admin.roleDisplayName, 'Administrador');
    });

    test('UserModel.toJson serializa a JSON de forma consistente', () {
      const model = UserModel(
        id: 5,
        name: 'Maria Quispe',
        email: 'maria@cusco.pe',
        role: 'citizen',
        token: 'token_xyz',
      );

      final json = model.toJson();

      expect(json['id'], 5);
      expect(json['name'], 'Maria Quispe');
      expect(json['email'], 'maria@cusco.pe');
      expect(json['role'], 'citizen');
      expect(json['token'], 'token_xyz');
    });

    test('toEntity genera una entidad pura del dominio', () {
      const model = UserModel(
        id: 7,
        name: 'Pedro Ramos',
        email: 'pedro@cusco.pe',
        role: 'citizen',
      );

      final entity = model.toEntity();
      expect(entity.id, 7);
      expect(entity.name, 'Pedro Ramos');
      expect(entity.email, 'pedro@cusco.pe');
      expect(entity.role, 'citizen');
    });
  });
}
