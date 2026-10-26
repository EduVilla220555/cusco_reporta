import 'package:flutter_test/flutter_test.dart';
import 'package:cusco_reporta_mobile/features/reports/domain/entities/report_entity.dart';
import 'package:cusco_reporta_mobile/features/reports/domain/entities/report_stats_entity.dart';
import 'package:cusco_reporta_mobile/features/reports/domain/repositories/report_repository.dart';
import 'package:cusco_reporta_mobile/features/reports/presentation/providers/reports_provider.dart';

class FakeReportRepository implements ReportRepository {
  List<ReportEntity> reports = [
    const ReportEntity(
      id: 1,
      code: 'RPT-001',
      title: 'Bache en Antonio Lorena',
      description: 'Peligro para motos',
      type: 'vias',
      status: 'pending',
      citizenId: 10,
    ),
    const ReportEntity(
      id: 2,
      code: 'RPT-002',
      title: 'Poste caído en Plaza Santiago',
      description: 'Sin luz en el parque',
      type: 'alumbrado',
      status: 'progress',
      citizenId: 10,
    ),
    const ReportEntity(
      id: 3,
      code: 'RPT-003',
      title: 'Acumulación de basura en mercado',
      description: 'Desechos orgánicos',
      type: 'basura',
      status: 'resolved',
      citizenId: 12,
    ),
  ];

  @override
  Future<List<ReportEntity>> getAllReports() async => List<ReportEntity>.from(reports);

  @override
  Future<List<ReportEntity>> getReportsByCitizen(int citizenId) async =>
      reports.where((r) => r.citizenId == citizenId).toList();

  @override
  Future<List<ReportEntity>> getReportsByStatus(String status) async =>
      reports.where((r) => r.status == status).toList();

  @override
  Future<ReportEntity> getReportById(int id) async =>
      reports.firstWhere((r) => r.id == id);

  @override
  Future<ReportEntity> createReport(CreateReportParams params) async {
    final newReport = ReportEntity(
      id: reports.length + 1,
      code: 'RPT-00${reports.length + 1}',
      title: params.title,
      description: params.description,
      type: params.type,
      priority: params.priority,
      status: 'pending',
      citizenId: params.citizenId,
    );
    reports.insert(0, newReport);
    return newReport;
  }

  @override
  Future<ReportEntity> updateReportStatus({
    required int reportId,
    required String newStatus,
    required int authorityUserId,
    String? comment,
  }) async {
    final index = reports.indexWhere((r) => r.id == reportId);
    final old = reports[index];
    final updated = ReportEntity(
      id: old.id,
      code: old.code,
      title: old.title,
      description: old.description,
      type: old.type,
      priority: old.priority,
      status: newStatus,
      citizenId: old.citizenId,
    );
    reports[index] = updated;
    return updated;
  }

  @override
  Future<ReportStatsEntity> getReportStats() async {
    int pending = reports.where((r) => r.status == 'pending').length;
    int progress = reports.where((r) => r.status == 'progress').length;
    int resolved = reports.where((r) => r.status == 'resolved').length;
    return ReportStatsEntity(
      pending: pending,
      progress: progress,
      resolved: resolved,
    );
  }

  @override
  Future<List<ReportEntity>> searchReports(String query) async {
    return reports.where((r) => r.title.contains(query)).toList();
  }
}

void main() {
  late FakeReportRepository fakeRepository;
  late ReportsProvider reportsProvider;

  setUp(() {
    fakeRepository = FakeReportRepository();
    reportsProvider = ReportsProvider(reportRepository: fakeRepository);
  });

  group('ReportsProvider State & Filtering Tests', () {
    test('loadInitialData carga lista completa y calcula estadísticas', () async {
      await reportsProvider.loadInitialData();

      expect(reportsProvider.isLoading, isFalse);
      expect(reportsProvider.allReports.length, 3);
      expect(reportsProvider.stats.total, 3);
      expect(reportsProvider.stats.pending, 1);
      expect(reportsProvider.stats.progress, 1);
      expect(reportsProvider.stats.resolved, 1);
    });

    test('Filtro por categoría funciona correctamente', () async {
      await reportsProvider.loadInitialData();

      // Filtrar por vías
      reportsProvider.setTypeFilter('vias');
      expect(reportsProvider.filteredReports.length, 1);
      expect(reportsProvider.filteredReports.first.type, 'vias');

      // Filtrar por todos
      reportsProvider.setTypeFilter('todos');
      expect(reportsProvider.filteredReports.length, 3);
    });

    test('Filtro por estado de atención funciona correctamente', () async {
      await reportsProvider.loadInitialData();

      reportsProvider.setStatusFilter('resolved');
      expect(reportsProvider.filteredReports.length, 1);
      expect(reportsProvider.filteredReports.first.status, 'resolved');
    });

    test('Búsqueda por texto filtra títulos o códigos coincidentes', () async {
      await reportsProvider.loadInitialData();

      reportsProvider.setSearchQuery('Lorena');
      expect(reportsProvider.filteredReports.length, 1);
      expect(reportsProvider.filteredReports.first.title, contains('Antonio Lorena'));

      reportsProvider.setSearchQuery('RPT-002');
      expect(reportsProvider.filteredReports.length, 1);
      expect(reportsProvider.filteredReports.first.code, 'RPT-002');
    });

    test('createReport agrega la nueva incidencia e incrementa pendientes', () async {
      await reportsProvider.loadInitialData();

      const params = CreateReportParams(
        title: 'Fuga de agua',
        description: 'Tubería rota en esquina',
        type: 'otros',
        citizenId: 10,
      );

      final created = await reportsProvider.createReport(params);

      expect(created, isNotNull);
      expect(created?.code, 'RPT-004');
      expect(reportsProvider.allReports.length, 4);
      expect(reportsProvider.allReports.first.title, 'Fuga de agua');
      expect(reportsProvider.stats.pending, 2);
    });

    test('updateReportStatus actualiza en memoria el reporte intervenido', () async {
      await reportsProvider.loadInitialData();

      final success = await reportsProvider.updateReportStatus(
        reportId: 1,
        newStatus: 'resolved',
        authorityUserId: 5,
        comment: 'Bacheo concluido por el equipo municipal',
      );

      expect(success, isTrue);
      final updated = reportsProvider.allReports.firstWhere((r) => r.id == 1);
      expect(updated.status, 'resolved');
    });
  });
}
