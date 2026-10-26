import 'package:flutter_test/flutter_test.dart';
import 'package:cusco_reporta_mobile/features/auth/domain/entities/user_entity.dart';
import 'package:cusco_reporta_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:cusco_reporta_mobile/features/auth/presentation/providers/auth_provider.dart';

class FakeAuthRepository implements AuthRepository {
  UserEntity? userToReturn;
  bool shouldThrowError = false;

  @override
  Future<UserEntity> login({
    required String email,
    required String password,
    String? userType,
  }) async {
    if (shouldThrowError) {
      throw Exception('Credenciales incorrectas');
    }
    return userToReturn ??
        const UserEntity(
          id: 1,
          name: 'Usuario Prueba',
          email: 'test@example.com',
          role: 'citizen',
          token: 'fake_jwt_token',
        );
  }

  @override
  Future<UserEntity> register({
    required String name,
    required String email,
    required String password,
  }) async {
    if (shouldThrowError) {
      throw Exception('Email ya registrado');
    }
    return UserEntity(
      id: 2,
      name: name,
      email: email,
      role: 'citizen',
    );
  }

  @override
  Future<UserEntity?> checkAuthStatus() async {
    if (shouldThrowError) return null;
    return userToReturn;
  }

  @override
  Future<void> logout() async {
    userToReturn = null;
  }
}

void main() {
  late FakeAuthRepository fakeRepository;
  late AuthProvider authProvider;

  setUp(() {
    fakeRepository = FakeAuthRepository();
    authProvider = AuthProvider(authRepository: fakeRepository);
  });

  group('AuthProvider State Management Tests (Observer / Pub-Sub)', () {
    test('Estado inicial es initial y no autenticado', () {
      expect(authProvider.status, AuthStatus.initial);
      expect(authProvider.isAuthenticated, isFalse);
      expect(authProvider.currentUser, isNull);
    });

    test('login exitoso transiciona a authenticated y asigna currentUser', () async {
      final success = await authProvider.login(
        email: 'test@example.com',
        password: 'password123',
      );

      expect(success, isTrue);
      expect(authProvider.status, AuthStatus.authenticated);
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.currentUser?.name, 'Usuario Prueba');
      expect(authProvider.errorMessage, isNull);
    });

    test('login fallido transiciona a error y almacena mensaje descriptivo', () async {
      fakeRepository.shouldThrowError = true;

      final success = await authProvider.login(
        email: 'invalido@example.com',
        password: 'wrong',
      );

      expect(success, isFalse);
      expect(authProvider.status, AuthStatus.error);
      expect(authProvider.isAuthenticated, isFalse);
      expect(authProvider.currentUser, isNull);
      expect(authProvider.errorMessage, contains('Credenciales incorrectas'));
    });

    test('logout limpia el usuario y transiciona a unauthenticated', () async {
      // Iniciar sesión primero
      await authProvider.login(email: 'test@example.com', password: '123');
      expect(authProvider.isAuthenticated, isTrue);

      // Cerrar sesión
      await authProvider.logout();
      expect(authProvider.status, AuthStatus.unauthenticated);
      expect(authProvider.isAuthenticated, isFalse);
      expect(authProvider.currentUser, isNull);
    });

    test('checkAuth restaura sesión cuando hay credenciales válidas en caché', () async {
      fakeRepository.userToReturn = const UserEntity(
        id: 9,
        name: 'Carlos Autoridad',
        email: 'carlos@santiago.gob.pe',
        role: 'authority',
      );

      await authProvider.checkAuth();

      expect(authProvider.status, AuthStatus.authenticated);
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.currentUser?.isAuthority, isTrue);
    });
  });
}
