import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../reports/presentation/pages/report_detail_page.dart';
import '../../../reports/presentation/providers/reports_provider.dart';
import '../../../reports/presentation/widgets/category_filters_widget.dart';
import '../../../reports/presentation/widgets/report_card_widget.dart';
import '../../../reports/presentation/widgets/stats_summary_widget.dart';

class AuthorityHomePage extends StatefulWidget {
  const AuthorityHomePage({super.key});

  @override
  State<AuthorityHomePage> createState() => _AuthorityHomePageState();
}

class _AuthorityHomePageState extends State<AuthorityHomePage> {
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
    final user = authProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel de Autoridad Municipal'),
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
      body: Column(
        children: [
          // Banner de bienvenida y rol
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: AppColors.cardBackground,
            child: Row(
              children: [
                const Icon(Icons.admin_panel_settings_rounded, color: AppColors.primaryLight, size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user?.name ?? 'Autoridad Municipal',
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const Text(
                        'Gerencia de Infraestructura y Servicios Municipales',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Tarjetas de estadísticas KPI
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: StatsSummaryWidget(stats: reportsProvider.stats),
          ),

          // Filtro de estados (Chips)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildStatusFilterChip(reportsProvider, 'todos', 'Todos'),
                  const SizedBox(width: 8),
                  _buildStatusFilterChip(reportsProvider, 'pending', 'Pendientes', AppColors.statusPending),
                  const SizedBox(width: 8),
                  _buildStatusFilterChip(reportsProvider, 'progress', 'En Proceso', AppColors.statusProgress),
                  const SizedBox(width: 8),
                  _buildStatusFilterChip(reportsProvider, 'resolved', 'Resueltos', AppColors.statusResolved),
                ],
              ),
            ),
          ),

          // Filtro de categorías
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: CategoryFiltersWidget(
              selectedCategory: reportsProvider.selectedTypeFilter,
              onCategorySelected: reportsProvider.setTypeFilter,
            ),
          ),

          const SizedBox(height: 4),

          // Listado de reportes para gestión
          Expanded(
            child: _buildReportsContent(reportsProvider),
          ),
        ],
      ),
    );
  }

  Widget _buildReportsContent(ReportsProvider reportsProvider) {
    if (reportsProvider.isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primaryLight));
    }
    if (reportsProvider.errorMessage != null && reportsProvider.allReports.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off_rounded, size: 48, color: AppColors.statusRejected),
              const SizedBox(height: 12),
              const Text('Error al conectar con el backend', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 6),
              Text(reportsProvider.errorMessage!, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12), textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => reportsProvider.loadInitialData(),
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Reintentar'),
              ),
            ],
          ),
        ),
      );
    }
    if (reportsProvider.filteredReports.isEmpty) {
      return const Center(
        child: Text(
          'No hay reportes con los filtros seleccionados.',
          style: TextStyle(color: AppColors.textSecondary),
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: reportsProvider.filteredReports.length,
      itemBuilder: (context, index) {
        final report = reportsProvider.filteredReports[index];
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
    );
  }

  Widget _buildStatusFilterChip(
    ReportsProvider provider,
    String statusKey,
    String label, [
    Color? accentColor,
  ]) {
    final isSelected = provider.selectedStatusFilter == statusKey;
    final color = accentColor ?? AppColors.primaryLight;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: color.withValues(alpha: 0.3),
      backgroundColor: AppColors.cardBackground,
      side: BorderSide(
        color: isSelected ? color : AppColors.border,
        width: 1.5,
      ),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textSecondary,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        fontSize: 12,
      ),
      onSelected: (_) => provider.setStatusFilter(statusKey),
    );
  }
}
