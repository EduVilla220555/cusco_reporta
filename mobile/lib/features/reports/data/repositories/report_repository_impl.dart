import '../../domain/entities/report_entity.dart';
import '../../domain/entities/report_stats_entity.dart';
import '../../domain/repositories/report_repository.dart';
import '../datasources/report_remote_data_source.dart';

/// Implementación del repositorio de reportes urbanos
class ReportRepositoryImpl implements ReportRepository {
  final ReportRemoteDataSource remoteDataSource;

  ReportRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<ReportEntity>> getAllReports() async {
    final models = await remoteDataSource.getAllReports();
    return models.map((m) => m.toEntity()).toList();
  }

  @override
  Future<List<ReportEntity>> getReportsByCitizen(int citizenId) async {
    final models = await remoteDataSource.getReportsByCitizen(citizenId);
    return models.map((m) => m.toEntity()).toList();
  }

  @override
  Future<List<ReportEntity>> getReportsByStatus(String status) async {
    final models = await remoteDataSource.getReportsByStatus(status);
    return models.map((m) => m.toEntity()).toList();
  }

  @override
  Future<ReportEntity> getReportById(int id) async {
    final model = await remoteDataSource.getReportById(id);
    return model.toEntity();
  }

  @override
  Future<ReportEntity> createReport(CreateReportParams params) async {
    final model = await remoteDataSource.createReport(params);
    return model.toEntity();
  }

  @override
  Future<ReportEntity> updateReportStatus({
    required int reportId,
    required String newStatus,
    required int authorityUserId,
    String? comment,
  }) async {
    final model = await remoteDataSource.updateReportStatus(
      reportId: reportId,
      newStatus: newStatus,
      authorityUserId: authorityUserId,
      comment: comment,
    );
    return model.toEntity();
  }

  @override
  Future<ReportStatsEntity> getReportStats() async {
    return await remoteDataSource.getReportStats();
  }

  @override
  Future<List<ReportEntity>> searchReports(String query) async {
    final models = await remoteDataSource.searchReports(query);
    return models.map((m) => m.toEntity()).toList();
  }
}
