import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/constants/api_constants.dart';
import 'core/constants/app_colors.dart';
import 'core/network/api_client.dart';
import 'core/theme/app_theme.dart';
import 'features/admin/presentation/pages/admin_dashboard_page.dart';
import 'features/auth/data/datasources/auth_remote_data_source.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'features/authority/presentation/pages/authority_home_page.dart';
import 'features/citizen/presentation/pages/citizen_home_page.dart';
import 'features/reports/data/datasources/report_remote_data_source.dart';
import 'features/reports/data/repositories/report_repository_impl.dart';
import 'features/reports/presentation/providers/reports_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicialización de persistencia local
  final sharedPreferences = await SharedPreferences.getInstance();

  // Detección de URL base guardada o por defecto localhost
  final savedBaseUrl = sharedPreferences.getString('custom_base_url');
  if (savedBaseUrl != null && savedBaseUrl.isNotEmpty) {
    ApiConstants.setBaseUrl(savedBaseUrl);
  } else {
    // localhost:5000 funciona en Windows, Web y dispositivo Android físico con 'adb reverse tcp:5000 tcp:5000'
    ApiConstants.useLocalhost();
  }

  // Inyección de dependencias
  final apiClient = ApiClient();

  final authRemoteDataSource = AuthRemoteDataSourceImpl(apiClient: apiClient);
  final authRepository = AuthRepositoryImpl(
    remoteDataSource: authRemoteDataSource,
    apiClient: apiClient,
    sharedPreferences: sharedPreferences,
  );

  final reportRemoteDataSource = ReportRemoteDataSourceImpl(apiClient: apiClient);
  final reportRepository = ReportRepositoryImpl(
    remoteDataSource: reportRemoteDataSource,
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authRepository: authRepository)..checkAuth(),
        ),
        ChangeNotifierProvider(
          create: (_) => ReportsProvider(reportRepository: reportRepository),
        ),
      ],
      child: const CuscoReportaApp(),
    ),
  );
}

class CuscoReportaApp extends StatelessWidget {
  const CuscoReportaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cusco Reporta',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkGreenTheme,
      home: const AuthGate(),
    );
  }
}

/// Enrutador reactivo según estado de autenticación y rol
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    // Estado inicial de carga o verificación de token
    if (authProvider.status == AuthStatus.initial ||
        (authProvider.isLoading && authProvider.currentUser == null)) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: AppColors.primaryLight),
              SizedBox(height: 16),
              Text(
                'Iniciando Cusco Reporta...',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
              ),
            ],
          ),
        ),
      );
    }

    // Usuario autenticado: Redirección según rol institucional
    if (authProvider.isAuthenticated && authProvider.currentUser != null) {
      final user = authProvider.currentUser!;
      if (user.isAdmin) {
        return const AdminDashboardPage();
      } else if (user.isAuthority) {
        return const AuthorityHomePage();
      } else {
        return const CitizenHomePage();
      }
    }

    // Usuario no autenticado
    return const LoginPage();
  }
}
