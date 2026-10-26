import '../entities/user_entity.dart';

/// Contrato de repositorio para el dominio de autenticación
abstract class AuthRepository {
  Future<UserEntity> login({
    required String email,
    required String password,
    String? userType,
  });

  Future<UserEntity> register({
    required String name,
    required String email,
    required String password,
  });

  Future<UserEntity?> checkAuthStatus();

  Future<void> logout();
}
