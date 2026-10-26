import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/api_client.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login({
    required String email,
    required String password,
    String? userType,
  });

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
  });

  Future<UserModel> verifyToken(String token);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<UserModel> login({
    required String email,
    required String password,
    String? userType,
  }) async {
    final payload = <String, dynamic>{
      'email': email,
      'password': password,
    };
    if (userType != null) {
      payload['userType'] = userType;
    }

    final response = await apiClient.post(ApiConstants.authLogin, body: payload);
    final userJson = response['user'] as Map<String, dynamic>;
    final token = response['token'] as String?;

    return UserModel.fromJson(userJson, token: token);
  }

  @override
  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final payload = {
      'name': name,
      'email': email,
      'password': password,
    };

    final response = await apiClient.post(ApiConstants.authRegister, body: payload);
    final userJson = response['user'] as Map<String, dynamic>;

    return UserModel.fromJson(userJson);
  }

  @override
  Future<UserModel> verifyToken(String token) async {
    apiClient.updateAuthToken(token);
    final response = await apiClient.get(ApiConstants.authVerify);
    final userJson = response['user'] as Map<String, dynamic>;

    return UserModel.fromJson(userJson, token: token);
  }
}
