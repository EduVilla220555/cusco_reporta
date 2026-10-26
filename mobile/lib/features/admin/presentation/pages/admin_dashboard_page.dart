import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../reports/presentation/pages/report_detail_page.dart';
import '../../../reports/presentation/providers/reports_provider.dart';
import '../../../reports/presentation/widgets/report_card_widget.dart';
import '../../../reports/presentation/widgets/stats_summary_widget.dart';

class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReportsProvider>().loadInitialData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final reportsProvider = context.watch<ReportsProvider>();
    final stats = reportsProvider.stats;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel de Administración General'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => reportsProvider.loadInitialData(),
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppColors.statusRejected),
            tooltip: 'Cerrar Sesión',
            onPressed: () => authProvider.logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Resumen Ejecutivo de Métricas
            const Text(
              'Métricas y Rendimiento Municipal',
              style: TextStyle(
                color: AppColors.primaryLight,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            StatsSummaryWidget(stats: stats),
            const SizedBox(height: 18),

            // Tasa de Resolución Porcentual
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Efectividad de Atención',
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        '${stats.resolutionRate.toStringAsFixed(1)}%',
                        style: const TextStyle(
                          color: AppColors.primaryLight,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: stats.total > 0 ? (stats.resolved / stats.total) : 0,
                      minHeight: 10,
                      backgroundColor: AppColors.background,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Distribución por Categoría de Problema
            const Text(
              'Distribución de Problemas Urbanos',
              style: TextStyle(
                color: AppColors.primaryLight,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            _buildCategoryDistribution(reportsProvider),
            const SizedBox(height: 24),

            // Últimos Reportes Registrados
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Últimas Incidencias Reportadas',
                  style: TextStyle(
                    color: AppColors.primaryLight,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Total: ${reportsProvider.allReports.length}',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (reportsProvider.isLoading)
              const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
            else if (reportsProvider.allReports.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Text(
                    'No hay reportes registrados en la plataforma.',
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: reportsProvider.allReports.take(5).length,
                itemBuilder: (context, index) {
                  final report = reportsProvider.allReports[index];
                  return ReportCardWidget(
                    report: report,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ReportDetailPage(report: report),
                        ),
                      );
                    },
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryDistribution(ReportsProvider provider) {
    int countVias = 0;
    int countAlumbrado = 0;
    int countBasura = 0;
    int countOtros = 0;

    for (final r in provider.allReports) {
      switch (r.type.toLowerCase()) {
        case 'vias':
          countVias++;
          break;
        case 'alumbrado':
          countAlumbrado++;
          break;
        case 'basura':
          countBasura++;
          break;
        default:
          countOtros++;
          break;
      }
    }

    final total = provider.allReports.length;

    Widget buildBar(String label, int count, Color color, IconData icon) {
      final percentage = total > 0 ? (count / total) : 0.0;
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: color),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    label,
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
                  ),
                ),
                Text(
                  '$count (${(percentage * 100).toStringAsFixed(0)}%)',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 4),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: percentage,
                minHeight: 6,
                backgroundColor: AppColors.background,
                color: color,
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          buildBar('Vías y Pistas', countVias, AppColors.primary, Icons.add_road_rounded),
          const SizedBox(height: 6),
          buildBar('Alumbrado Público', countAlumbrado, Colors.amberAccent, Icons.lightbulb_rounded),
          const SizedBox(height: 6),
          buildBar('Gestión de Residuos', countBasura, Colors.lightGreenAccent, Icons.delete_outline_rounded),
          const SizedBox(height: 6),
          buildBar('Incidencias Generales', countOtros, AppColors.statusProgress, Icons.report_problem_rounded),
        ],
      ),
    );
  }
}
