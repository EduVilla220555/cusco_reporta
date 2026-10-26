import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

/// Entidad pura del dominio para Reportes Urbanos
class ReportEntity {
  final int id;
  final String code;
  final String title;
  final String? description;
  final String type; // 'vias', 'alumbrado', 'basura', 'otros'
  final String priority; // 'baja', 'media', 'alta'
  final String status; // 'pending', 'progress', 'resolved'
  final int citizenId;
  final String? citizenName;
  final String? citizenEmail;
  final double? latitude;
  final double? longitude;
  final String? photoUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const ReportEntity({
    required this.id,
    required this.code,
    required this.title,
    this.description,
    required this.type,
    this.priority = 'media',
    this.status = 'pending',
    required this.citizenId,
    this.citizenName,
    this.citizenEmail,
    this.latitude,
    this.longitude,
    this.photoUrl,
    this.createdAt,
    this.updatedAt,
  });

  bool get isPending => status == 'pending';
  bool get isInProgress => status == 'progress';
  bool get isResolved => status == 'resolved';

  String get typeDisplayName {
    switch (type.toLowerCase()) {
      case 'vias':
        return 'Vías y Pistas';
      case 'alumbrado':
        return 'Alumbrado Público';
      case 'basura':
        return 'Gestión de Residuos';
      case 'otros':
      default:
        return 'Incidencia General';
    }
  }

  String get statusDisplayName {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'progress':
        return 'En Proceso';
      case 'resolved':
        return 'Resuelto';
      default:
        return status;
    }
  }

  Color get statusColor {
    switch (status.toLowerCase()) {
      case 'pending':
        return AppColors.statusPending;
      case 'progress':
        return AppColors.statusProgress;
      case 'resolved':
        return AppColors.statusResolved;
      default:
        return AppColors.secondary;
    }
  }

  IconData get typeIcon {
    switch (type.toLowerCase()) {
      case 'vias':
        return Icons.add_road_rounded;
      case 'alumbrado':
        return Icons.lightbulb_rounded;
      case 'basura':
        return Icons.delete_outline_rounded;
      case 'otros':
      default:
        return Icons.report_problem_rounded;
    }
  }
}
