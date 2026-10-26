/// Constantes de configuración de red y rutas de la API REST
class ApiConstants {
  ApiConstants._();

  /// URL base por defecto del backend Node.js/Express
  /// Por defecto localhost:5000 (funciona en Windows, Web y dispositivo físico vía USB adb reverse)
  static String baseUrl = 'http://localhost:5000/api';

  static void useLocalhost() {
    baseUrl = 'http://localhost:5000/api';
  }

  static void useWifi(String hostIp) {
    baseUrl = 'http://$hostIp:5000/api';
  }

  static void useAndroidEmulator() {
    baseUrl = 'http://10.0.2.2:5000/api';
  }

  static void setBaseUrl(String url) {
    if (!url.endsWith('/api')) {
      baseUrl = url.endsWith('/') ? '${url}api' : '$url/api';
    } else {
      baseUrl = url;
    }
  }

  // Rutas de Autenticación
  static const String authLogin = '/auth/login';
  static const String authRegister = '/auth/register';
  static const String authVerify = '/auth/verify';

  // Rutas de Reportes
  static const String reports = '/reports';
  static const String reportStats = '/reports/stats';
  static const String reportSearch = '/reports/search';

  static String citizenReports(int citizenId) => '/reports/citizen/$citizenId';
  static String reportById(int reportId) => '/reports/$reportId';
  static String reportHistory(int reportId) => '/reports/$reportId/history';
  static String reportStatusUpdate(int reportId) => '/reports/$reportId/status';
  static String reportsByStatus(String status) => '/reports/status/$status';

  // Rutas de Usuarios
  static const String users = '/users';
  static const String userStats = '/users/stats';
}
