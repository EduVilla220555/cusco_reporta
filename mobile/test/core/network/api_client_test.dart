import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:cusco_reporta_mobile/core/errors/app_exceptions.dart';
import 'package:cusco_reporta_mobile/core/network/api_client.dart';

void main() {
  group('ApiClient Network & HTTP Code Mapping Tests', () {
    test('Petición GET exitosa retorna JSON decodificado (HTTP 200)', () async {
      final mockHttp = MockClient((request) async {
        expect(request.method, 'GET');
        return http.Response(jsonEncode({'success': true, 'data': 'ok'}), 200);
      });

      final apiClient = ApiClient(httpClient: mockHttp);
      final result = await apiClient.get('/test');

      expect(result['success'], isTrue);
      expect(result['data'], 'ok');
    });

    test('Petición POST exitosa incluye Bearer token en headers (HTTP 201)', () async {
      final mockHttp = MockClient((request) async {
        expect(request.method, 'POST');
        expect(request.headers['Authorization'], 'Bearer jwt_secret_123');
        expect(request.headers['Content-Type'], 'application/json');
        return http.Response(jsonEncode({'id': 10, 'message': 'Creado'}), 201);
      });

      final apiClient = ApiClient(httpClient: mockHttp);
      apiClient.updateAuthToken('jwt_secret_123');

      final result = await apiClient.post('/create', body: {'title': 'Nuevo'});
      expect(result['id'], 10);
    });

    test('HTTP 204 No Content retorna null', () async {
      final mockHttp = MockClient((request) async {
        return http.Response('', 204);
      });

      final apiClient = ApiClient(httpClient: mockHttp);
      final result = await apiClient.delete('/item/1');
      expect(result, isNull);
    });

    test('HTTP 400 lanza ValidationException', () async {
      final mockHttp = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Campos obligatorios faltantes'}),
          400,
        );
      });

      final apiClient = ApiClient(httpClient: mockHttp);

      expect(
        () => apiClient.post('/invalid'),
        throwsA(isA<ValidationException>().having(
          (e) => e.message,
          'message',
          'Campos obligatorios faltantes',
        )),
      );
    });

    test('HTTP 401 lanza UnauthorizedException', () async {
      final mockHttp = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Credenciales incorrectas'}),
          401,
        );
      });

      final apiClient = ApiClient(httpClient: mockHttp);

      expect(
        () => apiClient.get('/protected'),
        throwsA(isA<UnauthorizedException>()),
      );
    });

    test('HTTP 403 lanza ForbiddenException', () async {
      final mockHttp = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Requiere rol de autoridad'}),
          403,
        );
      });

      final apiClient = ApiClient(httpClient: mockHttp);

      expect(
        () => apiClient.put('/reports/1/status'),
        throwsA(isA<ForbiddenException>()),
      );
    });

    test('HTTP 404 lanza ResourceNotFoundException', () async {
      final mockHttp = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Reporte no encontrado'}),
          404,
        );
      });

      final apiClient = ApiClient(httpClient: mockHttp);

      expect(
        () => apiClient.get('/reports/999'),
        throwsA(isA<ResourceNotFoundException>()),
      );
    });

    test('HTTP 500 lanza ServerException', () async {
      final mockHttp = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Error interno de base de datos MySQL'}),
          500,
        );
      });

      final apiClient = ApiClient(httpClient: mockHttp);

      expect(
        () => apiClient.get('/error'),
        throwsA(isA<ServerException>()),
      );
    });
  });
}
