import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../errors/app_exceptions.dart';

/// Cliente HTTP centralizado con inyección de dependencias para tests unitarios
/// y mapeo estricto de códigos de estado HTTP según la Rúbrica de Evaluación.
class ApiClient {
  final http.Client _httpClient;
  String? _authToken;

  ApiClient({http.Client? httpClient}) : _httpClient = httpClient ?? http.Client();

  /// Actualiza o limpia el token JWT de sesión
  void updateAuthToken(String? token) {
    _authToken = token;
  }

  Map<String, String> _buildHeaders({bool isJson = true}) {
    final headers = <String, String>{
      'Accept': 'application/json',
    };
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    if (_authToken != null && _authToken!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  Uri _buildUri(String path, [Map<String, dynamic>? queryParams]) {
    final cleanPath = path.startsWith('/') ? path : '/$path';
    final fullUrl = '${ApiConstants.baseUrl}$cleanPath';
    if (queryParams != null && queryParams.isNotEmpty) {
      final stringParams = queryParams.map(
        (key, value) => MapEntry(key, value.toString()),
      );
      return Uri.parse(fullUrl).replace(queryParameters: stringParams);
    }
    return Uri.parse(fullUrl);
  }

  /// Petición GET idempotente
  Future<dynamic> get(String path, {Map<String, dynamic>? queryParams}) async {
    try {
      final uri = _buildUri(path, queryParams);
      final response = await _httpClient
          .get(uri, headers: _buildHeaders())
          .timeout(const Duration(seconds: 8));
      return _processResponse(response);
    } on SocketException catch (_) {
      throw NetworkException(
        'No se pudo conectar a ${ApiConstants.baseUrl}. Verifique que el backend esté iniciado.',
      );
    } on TimeoutException catch (_) {
      throw NetworkException(
        'Tiempo de espera agotado al conectar con ${ApiConstants.baseUrl}.',
      );
    } on http.ClientException catch (e) {
      throw NetworkException('Error de conexión con el servidor: ${e.message}');
    }
  }

  /// Petición POST no idempotente (creación o autenticación)
  Future<dynamic> post(String path, {dynamic body}) async {
    try {
      final uri = _buildUri(path);
      final encodedBody = body != null ? jsonEncode(body) : null;
      final response = await _httpClient
          .post(uri, headers: _buildHeaders(), body: encodedBody)
          .timeout(const Duration(seconds: 8));
      return _processResponse(response);
    } on SocketException catch (_) {
      throw NetworkException(
        'No se pudo conectar a ${ApiConstants.baseUrl}. Verifique que el backend esté iniciado.',
      );
    } on TimeoutException catch (_) {
      throw NetworkException(
        'Tiempo de espera agotado al conectar con ${ApiConstants.baseUrl}.',
      );
    } on http.ClientException catch (e) {
      throw NetworkException('Error de conexión con el servidor: ${e.message}');
    }
  }

  /// Petición PUT idempotente (actualizaciones de recursos o estados)
  Future<dynamic> put(String path, {dynamic body}) async {
    try {
      final uri = _buildUri(path);
      final encodedBody = body != null ? jsonEncode(body) : null;
      final response = await _httpClient
          .put(uri, headers: _buildHeaders(), body: encodedBody)
          .timeout(const Duration(seconds: 8));
      return _processResponse(response);
    } on SocketException catch (_) {
      throw NetworkException(
        'No se pudo conectar a ${ApiConstants.baseUrl}. Verifique que el backend esté iniciado.',
      );
    } on TimeoutException catch (_) {
      throw NetworkException(
        'Tiempo de espera agotado al conectar con ${ApiConstants.baseUrl}.',
      );
    } on http.ClientException catch (e) {
      throw NetworkException('Error de conexión con el servidor: ${e.message}');
    }
  }

  /// Petición DELETE idempotente
  Future<dynamic> delete(String path) async {
    try {
      final uri = _buildUri(path);
      final response = await _httpClient
          .delete(uri, headers: _buildHeaders())
          .timeout(const Duration(seconds: 8));
      return _processResponse(response);
    } on SocketException catch (_) {
      throw NetworkException(
        'No se pudo conectar a ${ApiConstants.baseUrl}. Verifique que el backend esté iniciado.',
      );
    } on TimeoutException catch (_) {
      throw NetworkException(
        'Tiempo de espera agotado al conectar con ${ApiConstants.baseUrl}.',
      );
    } on http.ClientException catch (e) {
      throw NetworkException('Error de conexión con el servidor: ${e.message}');
    }
  }

  /// Petición Multipart para subida de reportes con fotos binarias
  Future<dynamic> postMultipart(
    String path, {
    required Map<String, String> fields,
    String? fileField,
    String? filePath,
  }) async {
    try {
      final uri = _buildUri(path);
      final request = http.MultipartRequest('POST', uri);

      request.headers.addAll(_buildHeaders(isJson: false));
      request.fields.addAll(fields);

      if (fileField != null && filePath != null && filePath.isNotEmpty) {
        final file = File(filePath);
        if (await file.exists()) {
          request.files.add(
            await http.MultipartFile.fromPath(fileField, filePath),
          );
        }
      }

      final streamedResponse = await request.send().timeout(const Duration(seconds: 15));
      final response = await http.Response.fromStream(streamedResponse);
      return _processResponse(response);
    } on SocketException catch (_) {
      throw NetworkException(
        'No se pudo conectar a ${ApiConstants.baseUrl}. Verifique que el backend esté iniciado.',
      );
    } on TimeoutException catch (_) {
      throw NetworkException('Tiempo de espera agotado durante la subida.');
    } on http.ClientException catch (e) {
      throw NetworkException('Error de subida al servidor: ${e.message}');
    }
  }

  /// Procesamiento tipado de códigos de estado HTTP
  dynamic _processResponse(http.Response response) {
    dynamic decodedBody;
    if (response.body.isNotEmpty) {
      try {
        decodedBody = jsonDecode(response.body);
      } catch (_) {
        decodedBody = {'message': response.body};
      }
    }

    final message = decodedBody is Map && decodedBody['message'] != null
        ? decodedBody['message'].toString()
        : 'Código de respuesta HTTP ${response.statusCode}';

    switch (response.statusCode) {
      case 200:
      case 201:
        return decodedBody;
      case 204:
        return null;
      case 400:
        throw ValidationException(
          message,
          errors: decodedBody is Map && decodedBody['errors'] is Map<String, dynamic>
              ? decodedBody['errors'] as Map<String, dynamic>
              : null,
        );
      case 401:
        throw UnauthorizedException(message);
      case 403:
        throw ForbiddenException(message);
      case 404:
        throw ResourceNotFoundException(message);
      case 409:
        throw ConflictException(message);
      case 500:
      case 502:
      case 503:
        throw ServerException(message);
      default:
        throw GeneralAppException(message, response.statusCode);
    }
  }
}
