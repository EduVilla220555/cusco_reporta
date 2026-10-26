import 'package:flutter_test/flutter_test.dart';
import 'package:cusco_reporta_mobile/features/reports/data/models/report_model.dart';
import 'package:cusco_reporta_mobile/features/reports/domain/entities/report_stats_entity.dart';

void main() {
  group('ReportModel & ReportStatsEntity Tests', () {
    test('ReportModel.fromJson parsea correctamente tipos, prioridades y coordenadas', () {
      final json = {
        'id': 101,
        'code': 'RPT-001',
        'title': 'Bache peligroso en Av. Grau',
        'description': 'Hueco de 30cm que daña vehículos',
        'type': 'vias',
        'priority': 'alta',
        'status': 'progress',
        'citizen_id': 12,
        'citizen_name': 'Yeferson Supa',
        'citizen_email': 'yeferson@gmail.com',
        'latitude': '-13.52550000',
        'longitude': -71.98400000,
        'photo_url': 'http://localhost:5000/uploads/bache.jpg',
        'created_at': '2026-10-19T10:00:00.000Z',
      };

      final report = ReportModel.fromJson(json);

      expect(report.id, 101);
      expect(report.code, 'RPT-001');
      expect(report.title, 'Bache peligroso en Av. Grau');
      expect(report.type, 'vias');
      expect(report.typeDisplayName, 'Vías y Pistas');
      expect(report.priority, 'alta');
      expect(report.status, 'progress');
      expect(report.statusDisplayName, 'En Proceso');
      expect(report.isInProgress, isTrue);
      expect(report.isPending, isFalse);
      expect(report.isResolved, isFalse);
      expect(report.citizenId, 12);
      expect(report.citizenName, 'Yeferson Supa');
      expect(report.latitude, closeTo(-13.5255, 0.0001));
      expect(report.longitude, closeTo(-71.9840, 0.0001));
      expect(report.photoUrl, 'http://localhost:5000/uploads/bache.jpg');
    });

    test('ReportModel.toJson genera mapa JSON completo', () {
      const report = ReportModel(
        id: 202,
        code: 'RPT-002',
        title: 'Poste sin luz',
        type: 'alumbrado',
        priority: 'media',
        status: 'pending',
        citizenId: 15,
      );

      final map = report.toJson();

      expect(map['id'], 202);
      expect(map['code'], 'RPT-002');
      expect(map['type'], 'alumbrado');
      expect(map['citizen_id'], 15);
      expect(map['status'], 'pending');
    });

    test('ReportStatsEntity calcula totales y tasa de resolución con precisión', () {
      final stats = ReportStatsEntity.fromJson({
        'pending': 10,
        'progress': 5,
        'resolved': 15,
      });

      expect(stats.pending, 10);
      expect(stats.progress, 5);
      expect(stats.resolved, 15);
      expect(stats.total, 30);
      expect(stats.resolutionRate, closeTo(50.0, 0.01));
    });
  });
}
