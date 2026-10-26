import '../entities/report_entity.dart';
import '../entities/report_stats_entity.dart';

/// Parámetros para la creación de un nuevo reporte
class CreateReportParams {
  final String title;
  final String description;
  final String type;
  final String priority;
  final int citizenId;
  final double? latitude;
  final double? longitude;
  final String? imagePath;

  const CreateReportParams({
    required this.title,
    required this.description,
    required this.type,
    this.priority = 'media',
    required this.citizenId,
    this.latitude,
    this.longitude,
    this.imagePath,
  });
}

/// Contrato del repositorio de reportes urbanos
abstract class ReportRepository {
  Future<List<ReportEntity>> getAllReports();

  Future<List<ReportEntity>> getReportsByCitizen(int citizenId);

  Future<List<ReportEntity>> getReportsByStatus(String status);

  Future<ReportEntity> getReportById(int id);

  Future<ReportEntity> createReport(CreateReportParams params);

  Future<ReportEntity> updateReportStatus({
    required int reportId,
    required String newStatus,
    required int authorityUserId,
    String? comment,
  });

  Future<ReportStatsEntity> getReportStats();

  Future<List<ReportEntity>> searchReports(String query);
}
