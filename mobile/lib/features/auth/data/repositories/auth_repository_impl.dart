import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  static const String _userStorageKey = 'santiago_reporta_cached_user';
  static const String _tokenStorageKey = 'santiago_reporta_jwt_token';

  final AuthRemoteDataSource remoteDataSource;
  final ApiClient apiClient;
  final SharedPreferences sharedPreferences;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.apiClient,
    required this.sharedPreferences,
  });

  @override
  Future<UserEntity> login({
    required String email,
    required String password,
    String? userType,
  }) async {
    final userModel = await remoteDataSource.login(
      email: email,
      password: password,
      userType: userType,
    );

    // Guardar token en ApiClient y en SharedPreferences
    if (userModel.token != null) {
      apiClient.updateAuthToken(userModel.token);
      await sharedPreferences.setString(_tokenStorageKey, userModel.token!);
      await sharedPreferences.setString(
        _userStorageKey,
        jsonEncode(userModel.toJson()),
      );
    }

    return userModel.toEntity();
  }

  @override
  Future<UserEntity> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final userModel = await remoteDataSource.register(
      name: name,
      email: email,
      password: password,
    );
    return userModel.toEntity();
  }

  @override
  Future<UserEntity?> checkAuthStatus() async {
    final token = sharedPreferences.getString(_tokenStorageKey);
    final cachedUserJson = sharedPreferences.getString(_userStorageKey);

    if (token == null || token.isEmpty) {
      return null;
    }

    // Configurar token en ApiClient
    apiClient.updateAuthToken(token);

    try {
      // Validar con el backend si el token sigue vigente
      final verifiedUser = await remoteDataSource.verifyToken(token);
      await sharedPreferences.setString(
        _userStorageKey,
        jsonEncode(verifiedUser.toJson()),
      );
      return verifiedUser.toEntity();
    } catch (_) {
      // Si la verificación falla pero tenemos usuario en caché, o si es error de red
      if (cachedUserJson != null) {
        try {
          final map = jsonDecode(cachedUserJson) as Map<String, dynamic>;
          return UserModel.fromJson(map, token: token).toEntity();
        } catch (_) {}
      }
      return null;
    }
  }

  @override
  Future<void> logout() async {
    apiClient.updateAuthToken(null);
    await sharedPreferences.remove(_tokenStorageKey);
    await sharedPreferences.remove(_userStorageKey);
  }
}
