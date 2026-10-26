/// Entidad de estadísticas de reportes
class ReportStatsEntity {
  final int pending;
  final int progress;
  final int resolved;

  const ReportStatsEntity({
    this.pending = 0,
    this.progress = 0,
    this.resolved = 0,
  });

  int get total => pending + progress + resolved;

  double get resolutionRate => total > 0 ? (resolved / total) * 100 : 0.0;

  factory ReportStatsEntity.fromJson(Map<String, dynamic> json) {
    int parseInt(dynamic val) {
      if (val == null) return 0;
      if (val is int) return val;
      return int.tryParse(val.toString()) ?? 0;
    }

    return ReportStatsEntity(
      pending: parseInt(json['pending']),
      progress: parseInt(json['progress']),
      resolved: parseInt(json['resolved']),
    );
  }
}
