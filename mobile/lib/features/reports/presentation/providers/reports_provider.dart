import 'package:flutter/foundation.dart';
import '../../domain/entities/report_entity.dart';
import '../../domain/entities/report_stats_entity.dart';
import '../../domain/repositories/report_repository.dart';

/// Gestor de estado de reportes e incidencias urbanas
class ReportsProvider extends ChangeNotifier {
  final ReportRepository reportRepository;

  bool _isLoading = false;
  bool _isActionLoading = false;
  String? _errorMessage;

  List<ReportEntity> _allReports = [];
  List<ReportEntity> _citizenReports = [];
  ReportStatsEntity _stats = const ReportStatsEntity();

  String _selectedTypeFilter = 'todos';
  String _selectedStatusFilter = 'todos';
  String _searchQuery = '';

  ReportsProvider({required this.reportRepository});

  bool get isLoading => _isLoading;
  bool get isActionLoading => _isActionLoading;
  String? get errorMessage => _errorMessage;

  List<ReportEntity> get allReports => _allReports;
  List<ReportEntity> get citizenReports => _citizenReports;
  ReportStatsEntity get stats => _stats;

  String get selectedTypeFilter => _selectedTypeFilter;
  String get selectedStatusFilter => _selectedStatusFilter;
  String get searchQuery => _searchQuery;

  /// Lista filtrada dinámicamente según filtros aplicados
  List<ReportEntity> get filteredReports {
    return _allReports.where((report) {
      final matchesType = _selectedTypeFilter == 'todos' ||
          report.type.toLowerCase() == _selectedTypeFilter.toLowerCase();
      final matchesStatus = _selectedStatusFilter == 'todos' ||
          report.status.toLowerCase() == _selectedStatusFilter.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty ||
          report.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          report.code.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (report.description != null &&
              report.description!.toLowerCase().contains(_searchQuery.toLowerCase()));

      return matchesType && matchesStatus && matchesSearch;
    }).toList();
  }

  /// Carga el listado completo de reportes y las estadísticas
  Future<void> loadInitialData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        reportRepository.getAllReports(),
        reportRepository.getReportStats(),
      ]);

      _allReports = results[0] as List<ReportEntity>;
      _stats = results[1] as ReportStatsEntity;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Carga los reportes de un ciudadano específico
  Future<void> loadCitizenReports(int citizenId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _citizenReports = await reportRepository.getReportsByCitizen(citizenId);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Crea un nuevo reporte urbano con foto y ubicación
  Future<ReportEntity?> createReport(CreateReportParams params) async {
    _isActionLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final createdReport = await reportRepository.createReport(params);
      _allReports.insert(0, createdReport);
      _citizenReports.insert(0, createdReport);
      // Actualizar stats
      _stats = ReportStatsEntity(
        pending: _stats.pending + 1,
        progress: _stats.progress,
        resolved: _stats.resolved,
      );
      return createdReport;
    } catch (e) {
      _errorMessage = e.toString();
      return null;
    } finally {
      _isActionLoading = false;
      notifyListeners();
    }
  }

  /// Actualiza el estado de un reporte (solo Autoridades)
  Future<bool> updateReportStatus({
    required int reportId,
    required String newStatus,
    required int authorityUserId,
    String? comment,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updatedReport = await reportRepository.updateReportStatus(
        reportId: reportId,
        newStatus: newStatus,
        authorityUserId: authorityUserId,
        comment: comment,
      );

      // Reemplazar en la lista
      final index = _allReports.indexWhere((r) => r.id == reportId);
      if (index != -1) {
        _allReports[index] = updatedReport;
      }
      final citizenIndex = _citizenReports.indexWhere((r) => r.id == reportId);
      if (citizenIndex != -1) {
        _citizenReports[citizenIndex] = updatedReport;
      }

      // Recargar stats
      try {
        _stats = await reportRepository.getReportStats();
      } catch (_) {}

      return true;
    } catch (e) {
      _errorMessage = e.toString();
      return false;
    } finally {
      _isActionLoading = false;
      notifyListeners();
    }
  }

  void setTypeFilter(String type) {
    _selectedTypeFilter = type;
    notifyListeners();
  }

  void setStatusFilter(String status) {
    _selectedStatusFilter = status;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void clearFilters() {
    _selectedTypeFilter = 'todos';
    _selectedStatusFilter = 'todos';
    _searchQuery = '';
    notifyListeners();
  }
}
