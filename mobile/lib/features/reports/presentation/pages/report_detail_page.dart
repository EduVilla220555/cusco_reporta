import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../domain/entities/report_entity.dart';
import '../providers/reports_provider.dart';
import '../widgets/status_badge_widget.dart';

class ReportDetailPage extends StatefulWidget {
  final ReportEntity report;

  const ReportDetailPage({super.key, required this.report});

  @override
  State<ReportDetailPage> createState() => _ReportDetailPageState();
}

class _ReportDetailPageState extends State<ReportDetailPage> {
  late ReportEntity _currentReport;

  @override
  void initState() {
    super.initState();
    _currentReport = widget.report;
  }

  void _showStatusUpdateDialog(String targetStatus) {
    final commentController = TextEditingController();
    final authProvider = context.read<AuthProvider>();
    final reportsProvider = context.read<ReportsProvider>();

    String statusTitle;
    switch (targetStatus) {
      case 'progress':
        statusTitle = 'Pasar a "En Proceso"';
        break;
      case 'resolved':
        statusTitle = 'Marcar como "Resuelto"';
        break;
      case 'pending':
      default:
        statusTitle = 'Reabrir como "Pendiente"';
        break;
    }

    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          backgroundColor: AppColors.cardBackground,
          title: Text(
            statusTitle,
            style: const TextStyle(color: AppColors.primaryLight, fontSize: 18),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Ingrese un comentario u orden técnica para la actualización:',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: commentController,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Ej. Cuadrilla municipal asignada para bacheo...',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancelar', style: TextStyle(color: AppColors.textSecondary)),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.pop(dialogContext);
                final success = await reportsProvider.updateReportStatus(
                  reportId: _currentReport.id,
                  newStatus: targetStatus,
                  authorityUserId: authProvider.currentUser?.id ?? 1,
                  comment: commentController.text.trim(),
                );

                if (mounted) {
                  if (success) {
                    setState(() {
                      _currentReport = ReportEntity(
                        id: _currentReport.id,
                        code: _currentReport.code,
                        title: _currentReport.title,
                        description: _currentReport.description,
                        type: _currentReport.type,
                        priority: _currentReport.priority,
                        status: targetStatus,
                        citizenId: _currentReport.citizenId,
                        citizenName: _currentReport.citizenName,
                        citizenEmail: _currentReport.citizenEmail,
                        latitude: _currentReport.latitude,
                        longitude: _currentReport.longitude,
                        photoUrl: _currentReport.photoUrl,
                        createdAt: _currentReport.createdAt,
                        updatedAt: DateTime.now(),
                      );
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Estado actualizado a "$targetStatus" con éxito.'),
                        backgroundColor: AppColors.statusResolved,
                      ),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(reportsProvider.errorMessage ?? 'Error al actualizar estado'),
                        backgroundColor: AppColors.statusRejected,
                      ),
                    );
                  }
                }
              },
              child: const Text('Confirmar'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = context.watch<AuthProvider>().currentUser;
    final isAuthorityOrAdmin = currentUser != null && (currentUser.isAuthority || currentUser.isAdmin);

    return Scaffold(
      appBar: AppBar(
        title: Text(_currentReport.code),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cabecera: Estado e Icono de Tipo
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.cardBackground,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Icon(
                        _currentReport.typeIcon,
                        color: AppColors.primaryLight,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      _currentReport.typeDisplayName,
                      style: const TextStyle(
                        color: AppColors.primaryLight,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
                StatusBadgeWidget(status: _currentReport.status),
              ],
            ),
            const SizedBox(height: 18),

            // Foto de Evidencia
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              clipBehavior: Clip.antiAlias,
              child: _currentReport.photoUrl != null && _currentReport.photoUrl!.isNotEmpty
                  ? Image.network(
                      _currentReport.photoUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.broken_image_rounded, size: 40, color: AppColors.textSecondary),
                            SizedBox(height: 6),
                            Text('Imagen no disponible', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                          ],
                        ),
                      ),
                    )
                  : const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.image_outlined, size: 48, color: AppColors.textSecondary),
                          SizedBox(height: 8),
                          Text('Sin fotografía adjunta', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                        ],
                      ),
                    ),
            ),
            const SizedBox(height: 20),

            // Título
            Text(
              _currentReport.title,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            // Prioridad y Fecha
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.cardBackground,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _currentReport.priority == 'alta'
                              ? AppColors.priorityHigh
                              : (_currentReport.priority == 'baja'
                                  ? AppColors.priorityLow
                                  : AppColors.priorityMedium),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Prioridad ${_currentReport.priority.toUpperCase()}',
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                if (_currentReport.createdAt != null) ...[
                  const SizedBox(width: 12),
                  const Icon(Icons.access_time, size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text(
                    '${_currentReport.createdAt!.day}/${_currentReport.createdAt!.month}/${_currentReport.createdAt!.year}',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 16),
            const Divider(color: AppColors.border),
            const SizedBox(height: 12),

            // Descripción Detallada
            const Text(
              'Descripción de la Incidencia',
              style: TextStyle(
                color: AppColors.primaryLight,
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _currentReport.description ?? 'Sin descripción detallada.',
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 20),

            // Ubicación Geográfica
            const Text(
              'Ubicación en el Distrito',
              style: TextStyle(
                color: AppColors.primaryLight,
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: AppColors.primary, size: 24),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Distrito de Santiago, Cusco',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        Text(
                          'Lat: ${_currentReport.latitude ?? -13.5255}, Lon: ${_currentReport.longitude ?? -71.9840}',
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Acciones para Autoridades
            if (isAuthorityOrAdmin) ...[
              const Divider(color: AppColors.border),
              const SizedBox(height: 12),
              const Text(
                'Gestión Municipal (Rol Autoridad):',
                style: TextStyle(
                  color: AppColors.primaryLight,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  if (_currentReport.isPending)
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.statusProgress,
                        ),
                        onPressed: () => _showStatusUpdateDialog('progress'),
                        icon: const Icon(Icons.play_arrow_rounded, color: Colors.white),
                        label: const Text('En Proceso', style: TextStyle(color: Colors.white)),
                      ),
                    ),
                  if (_currentReport.isInProgress) ...[
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.statusResolved,
                        ),
                        onPressed: () => _showStatusUpdateDialog('resolved'),
                        icon: const Icon(Icons.check_circle_rounded, color: AppColors.textDark),
                        label: const Text('Resolver', style: TextStyle(color: AppColors.textDark)),
                      ),
                    ),
                  ],
                  if (_currentReport.isResolved)
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _showStatusUpdateDialog('pending'),
                        icon: const Icon(Icons.restart_alt_rounded),
                        label: const Text('Reabrir Reporte'),
                      ),
                    ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
