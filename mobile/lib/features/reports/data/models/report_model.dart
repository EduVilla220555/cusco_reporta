import '../../domain/entities/report_entity.dart';

/// Modelo de datos para Reportes con serialización JSON
class ReportModel extends ReportEntity {
  const ReportModel({
    required super.id,
    required super.code,
    required super.title,
    super.description,
    required super.type,
    super.priority = 'media',
    super.status = 'pending',
    required super.citizenId,
    super.citizenName,
    super.citizenEmail,
    super.latitude,
    super.longitude,
    super.photoUrl,
    super.createdAt,
    super.updatedAt,
  });

  factory ReportModel.fromJson(Map<String, dynamic> json) {
    double? parseCoordinate(dynamic val) {
      if (val == null) return null;
      if (val is num) return val.toDouble();
      return double.tryParse(val.toString());
    }

    DateTime? parseDate(dynamic val) {
      if (val == null) return null;
      return DateTime.tryParse(val.toString());
    }

    return ReportModel(
      id: json['id'] is int ? json['id'] as int : int.parse(json['id'].toString()),
      code: json['code'] as String? ?? 'RPT-000',
      title: json['title'] as String? ?? 'Sin título',
      description: json['description'] as String?,
      type: json['type'] as String? ?? 'otros',
      priority: json['priority'] as String? ?? 'media',
      status: json['status'] as String? ?? 'pending',
      citizenId: json['citizen_id'] != null
          ? int.parse(json['citizen_id'].toString())
          : (json['citizenId'] != null ? int.parse(json['citizenId'].toString()) : 0),
      citizenName: json['citizen_name'] as String? ?? json['citizenName'] as String?,
      citizenEmail: json['citizen_email'] as String? ?? json['citizenEmail'] as String?,
      latitude: parseCoordinate(json['latitude']),
      longitude: parseCoordinate(json['longitude']),
      photoUrl: json['photo_url'] as String? ?? json['photoUrl'] as String?,
      createdAt: parseDate(json['created_at'] ?? json['createdAt']),
      updatedAt: parseDate(json['updated_at'] ?? json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'title': title,
      'description': description,
      'type': type,
      'priority': priority,
      'status': status,
      'citizen_id': citizenId,
      if (citizenName != null) 'citizen_name': citizenName,
      if (citizenEmail != null) 'citizen_email': citizenEmail,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (photoUrl != null) 'photo_url': photoUrl,
      if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updated_at': updatedAt!.toIso8601String(),
    };
  }

  ReportEntity toEntity() => this;
}
