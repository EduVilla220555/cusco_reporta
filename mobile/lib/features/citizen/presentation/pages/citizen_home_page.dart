import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../reports/presentation/pages/create_report_page.dart';
import '../../../reports/presentation/pages/report_detail_page.dart';
import '../../../reports/presentation/providers/reports_provider.dart';
import '../../../reports/presentation/widgets/category_filters_widget.dart';
import '../../../reports/presentation/widgets/report_card_widget.dart';

class CitizenHomePage extends StatefulWidget {
  const CitizenHomePage({super.key});

  @override
  State<CitizenHomePage> createState() => _CitizenHomePageState();
}

class _CitizenHomePageState extends State<CitizenHomePage> {
  int _currentTabIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = context.read<AuthProvider>().currentUser;
      final reportsProvider = context.read<ReportsProvider>();
      reportsProvider.loadInitialData();
      if (user != null) {
        reportsProvider.loadCitizenReports(user.id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final reportsProvider = context.watch<ReportsProvider>();
    final user = authProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _currentTabIndex == 0
              ? 'Mis Reportes'
              : (_currentTabIndex == 1 ? 'Explorar Santiago' : 'Mi Perfil'),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () {
              reportsProvider.loadInitialData();
              if (user != null) reportsProvider.loadCitizenReports(user.id);
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentTabIndex,
        children: [
          // TAB 0: Mis Reportes
          _buildMyReportsTab(reportsProvider, user?.id),

          // TAB 1: Explorar Incidencias en Santiago
          _buildExploreTab(reportsProvider),

          // TAB 2: Perfil de Usuario
          _buildProfileTab(authProvider),
        ],
      ),
      floatingActionButton: _currentTabIndex == 0
          ? FloatingActionButton.extended(
              backgroundColor: AppColors.primary,
              foregroundColor: AppColors.textDark,
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const CreateReportPage()),
                );
              },
              icon: const Icon(Icons.add_rounded),
              label: const Text('Nuevo Reporte', style: TextStyle(fontWeight: FontWeight.bold)),
            )
          : null,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentTabIndex,
        onTap: (index) => setState(() => _currentTabIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment_outlined),
            activeIcon: Icon(Icons.assignment_rounded),
            label: 'Mis Reportes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.explore_outlined),
            activeIcon: Icon(Icons.explore_rounded),
            label: 'Explorar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }

  Widget _buildMyReportsTab(ReportsProvider provider, int? citizenId) {
    if (provider.isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primaryLight));
    }

    if (provider.errorMessage != null && provider.citizenReports.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off_rounded, size: 48, color: AppColors.statusRejected),
              const SizedBox(height: 12),
              const Text(
                'Error al conectar con el servidor',
                style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 6),
              Text(
                provider.errorMessage!,
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  provider.loadInitialData();
                  if (citizenId != null) provider.loadCitizenReports(citizenId);
                },
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Reintentar'),
              ),
            ],
          ),
        ),
      );
    }

    final reports = provider.citizenReports;

    if (reports.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.assignment_late_outlined, size: 64, color: AppColors.secondary),
              const SizedBox(height: 16),
              const Text(
                'Aún no has registrado reportes',
                style: TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Presiona el botón "+ Nuevo Reporte" para registrar una incidencia con foto y ubicación.',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CreateReportPage()),
                  );
                },
                icon: const Icon(Icons.add_rounded),
                label: const Text('Crear mi primer reporte'),
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      color: AppColors.primaryLight,
      backgroundColor: AppColors.cardBackground,
      onRefresh: () async {
        if (citizenId != null) await provider.loadCitizenReports(citizenId);
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: reports.length,
        itemBuilder: (context, index) {
          final report = reports[index];
          return ReportCardWidget(
            report: report,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ReportDetailPage(report: report)),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildExploreTab(ReportsProvider provider) {
    return Column(
      children: [
        // Buscador
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Buscar por código, título o calle...',
              prefixIcon: const Icon(Icons.search, color: AppColors.primaryLight),
              suffixIcon: provider.searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, color: AppColors.textSecondary),
                      onPressed: () => provider.setSearchQuery(''),
                    )
                  : null,
            ),
            onChanged: provider.setSearchQuery,
          ),
        ),

        // Filtro horizontal de categorías
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: CategoryFiltersWidget(
            selectedCategory: provider.selectedTypeFilter,
            onCategorySelected: provider.setTypeFilter,
          ),
        ),
        const SizedBox(height: 6),

        // Lista de reportes
        Expanded(
          child: provider.isLoading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
              : (provider.filteredReports.isEmpty
                  ? const Center(
                      child: Text(
                        'No se encontraron incidencias.',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: provider.filteredReports.length,
                      itemBuilder: (context, index) {
                        final report = provider.filteredReports[index];
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
                    )),
        ),
      ],
    );
  }

  Widget _buildProfileTab(AuthProvider auth) {
    final user = auth.currentUser;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 16),
          CircleAvatar(
            radius: 44,
            backgroundColor: AppColors.cardBackground,
            child: const Icon(Icons.person, size: 54, color: AppColors.primaryLight),
          ),
          const SizedBox(height: 16),
          Text(
            user?.name ?? 'Ciudadano',
            style: const TextStyle(
              color: AppColors.primaryLight,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            user?.email ?? '',
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              user?.roleDisplayName ?? 'Ciudadano',
              style: const TextStyle(
                color: AppColors.primaryLight,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 36),
          const Divider(color: AppColors.border),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.statusRejected,
              side: const BorderSide(color: AppColors.statusRejected),
              minimumSize: const Size.fromHeight(48),
            ),
            onPressed: () => auth.logout(),
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Cerrar Sesión'),
          ),
        ],
      ),
    );
  }
}
