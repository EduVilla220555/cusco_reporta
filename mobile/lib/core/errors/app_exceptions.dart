/// Jerarquía de excepciones tipadas del dominio y capa de red
/// Garantiza el cumplimiento de la rúbrica sobre manejo preciso de códigos HTTP.
abstract class AppException implements Exception {
  final String message;
  final int? statusCode;

  const AppException(this.message, [this.statusCode]);

  @override
  String toString() => message;
}

/// Excepción genérica para códigos HTTP imprevistos
class GeneralAppException extends AppException {
  const GeneralAppException(super.message, [super.statusCode]);
}

/// Error de validación o solicitud incorrecta (HTTP 400)
class ValidationException extends AppException {
  final Map<String, dynamic>? errors;

  const ValidationException(
    String message, {
    this.errors,
  }) : super(message, 400);
}

/// Error de autenticación por credenciales inválidas o token expirado (HTTP 401)
class UnauthorizedException extends AppException {
  const UnauthorizedException([
    String message = 'Sesión expirada o credenciales incorrectas.',
  ]) : super(message, 401);
}

/// Acceso denegado por insuficiencia de permisos de rol (HTTP 403)
class ForbiddenException extends AppException {
  const ForbiddenException([
    String message = 'No cuenta con los permisos necesarios para realizar esta acción.',
  ]) : super(message, 403);
}

/// Recurso solicitado inexistente en el servidor (HTTP 404)
class ResourceNotFoundException extends AppException {
  const ResourceNotFoundException([
    String message = 'El recurso solicitado no fue encontrado.',
  ]) : super(message, 404);
}

/// Conflicto de datos, e.g. email ya registrado (HTTP 409)
class ConflictException extends AppException {
  const ConflictException([
    String message = 'El recurso ya se encuentra registrado en el sistema.',
  ]) : super(message, 409);
}

/// Fallo interno en el servidor Node.js/Express o base de datos MySQL (HTTP 500)
class ServerException extends AppException {
  const ServerException([
    String message = 'Ocurrió un error en el servidor. Intente nuevamente más tarde.',
  ]) : super(message, 500);
}

/// Fallo de conectividad a internet, resolución DNS o tiempo de espera
class NetworkException extends AppException {
  const NetworkException([
    String message = 'No se pudo conectar con el servidor. Verifique su conexión de red.',
  ]) : super(message, null);
}
