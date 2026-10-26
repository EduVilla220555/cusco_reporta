import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:cusco_reporta_mobile/core/theme/app_theme.dart';
import 'package:cusco_reporta_mobile/features/auth/domain/entities/user_entity.dart';
import 'package:cusco_reporta_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:cusco_reporta_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:cusco_reporta_mobile/features/citizen/presentation/pages/citizen_home_page.dart';
import 'package:cusco_reporta_mobile/features/reports/presentation/providers/reports_provider.dart';

import 'features/auth/auth_provider_test.dart';
import 'features/reports/reports_provider_test.dart';

void main() {
  testWidgets('AuthGate muestra LoginPage cuando el usuario no está autenticado', (tester) async {
    final fakeAuthRepo = FakeAuthRepository();
    final fakeReportRepo = FakeReportRepository();

    final authProvider = AuthProvider(authRepository: fakeAuthRepo);
    final reportsProvider = ReportsProvider(reportRepository: fakeReportRepo);

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider.value(value: authProvider),
          ChangeNotifierProvider.value(value: reportsProvider),
        ],
        child: MaterialApp(
          theme: AppTheme.darkGreenTheme,
          home: const LoginPage(),
        ),
      ),
    );

    // Debe mostrarse el título principal y botones de login
    expect(find.text('CUSCO REPORTA'), findsOneWidget);
    expect(find.text('Iniciar Sesión'), findsOneWidget);
    expect(find.text('Correo Electrónico'), findsOneWidget);
  });

  testWidgets('CitizenHomePage renderiza tabs de navegación', (tester) async {
    final fakeAuthRepo = FakeAuthRepository();
    fakeAuthRepo.userToReturn = const UserEntity(
      id: 1,
      name: 'Yeferson Supa',
      email: 'yeferson@example.com',
      role: 'citizen',
    );

    final fakeReportRepo = FakeReportRepository();
    final authProvider = AuthProvider(authRepository: fakeAuthRepo);
    final reportsProvider = ReportsProvider(reportRepository: fakeReportRepo);

    await authProvider.checkAuth();

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider.value(value: authProvider),
          ChangeNotifierProvider.value(value: reportsProvider),
        ],
        child: MaterialApp(
          theme: AppTheme.darkGreenTheme,
          home: const CitizenHomePage(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Mis Reportes'), findsWidgets);
    expect(find.text('Explorar'), findsOneWidget);
    expect(find.text('Perfil'), findsOneWidget);
  });
}
