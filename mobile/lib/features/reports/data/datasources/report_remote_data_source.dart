import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/entities/report_stats_entity.dart';
import '../../domain/repositories/report_repository.dart';
import '../models/report_model.dart';

abstract class ReportRemoteDataSource {
  Future<List<ReportModel>> getAllReports();
  Future<List<ReportModel>> getReportsByCitizen(int citizenId);
  Future<List<ReportModel>> getReportsByStatus(String status);
  Future<ReportModel> getReportById(int id);
  Future<ReportModel> createReport(CreateReportParams params);
  Future<ReportModel> updateReportStatus({
    required int reportId,
    required String newStatus,
    required int authorityUserId,
    String? comment,
  });
  Future<ReportStatsEntity> getReportStats();
  Future<List<ReportModel>> searchReports(String query);
}

class ReportRemoteDataSourceImpl implements ReportRemoteDataSource {
  final ApiClient apiClient;

  ReportRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<ReportModel>> getAllReports() async {
    final response = await apiClient.get(ApiConstants.reports);
    final list = response['reports'] as List<dynamic>? ?? [];
    return list
        .map((item) => ReportModel.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<List<ReportModel>> getReportsByCitizen(int citizenId) async {
    final response = await apiClient.get(ApiConstants.citizenReports(citizenId));
    final list = response['reports'] as List<dynamic>? ?? [];
    return list
        .map((item) => ReportModel.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<List<ReportModel>> getReportsByStatus(String status) async {
    final response = await apiClient.get(ApiConstants.reportsByStatus(status));
    final list = response['reports'] as List<dynamic>? ?? [];
    return list
        .map((item) => ReportModel.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<ReportModel> getReportById(int id) async {
    final response = await apiClient.get(ApiConstants.reportById(id));
    final reportJson = response['report'] as Map<String, dynamic>;
    return ReportModel.fromJson(reportJson);
  }

  @override
  Future<ReportModel> createReport(CreateReportParams params) async {
    final fields = <String, String>{
      'title': params.title,
      'description': params.description,
      'type': params.type,
      'priority': params.priority,
      'citizen_id': params.citizenId.toString(),
      if (params.latitude != null) 'latitude': params.latitude.toString(),
      if (params.longitude != null) 'longitude': params.longitude.toString(),
    };

    final response = await apiClient.postMultipart(
      ApiConstants.reports,
      fields: fields,
      fileField: 'photo',
      filePath: params.imagePath,
    );

    final reportJson = response['report'] as Map<String, dynamic>;
    return ReportModel.fromJson(reportJson);
  }

  @override
  Future<ReportModel> updateReportStatus({
    required int reportId,
    required String newStatus,
    required int authorityUserId,
    String? comment,
  }) async {
    final body = {
      'status': newStatus,
      'user_id': authorityUserId,
      if (comment != null && comment.isNotEmpty) 'comment': comment,
    };

    final response = await apiClient.put(
      ApiConstants.reportStatusUpdate(reportId),
      body: body,
    );

    final reportJson = response['report'] as Map<String, dynamic>;
    return ReportModel.fromJson(reportJson);
  }

  @override
  Future<ReportStatsEntity> getReportStats() async {
    final response = await apiClient.get(ApiConstants.reportStats);
    final statsJson = response['stats'] as Map<String, dynamic>;
    return ReportStatsEntity.fromJson(statsJson);
  }

  @override
  Future<List<ReportModel>> searchReports(String query) async {
    final response = await apiClient.get(
      ApiConstants.reportSearch,
      queryParams: {'q': query},
    );
    final list = response['reports'] as List<dynamic>? ?? [];
    return list
        .map((item) => ReportModel.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
