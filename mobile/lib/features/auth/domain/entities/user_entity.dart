/// Entidad de dominio pura que representa a un Usuario del sistema
class UserEntity {
  final int id;
  final String name;
  final String email;
  final String role; // 'citizen', 'authority', 'admin'
  final String? token;

  const UserEntity({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.token,
  });

  bool get isCitizen => role == 'citizen';
  bool get isAuthority => role == 'authority';
  bool get isAdmin => role == 'admin';

  String get roleDisplayName {
    switch (role) {
      case 'authority':
        return 'Autoridad Municipal';
      case 'admin':
        return 'Administrador';
      case 'citizen':
      default:
        return 'Ciudadano';
    }
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          email == other.email &&
          role == other.role;

  @override
  int get hashCode => id.hashCode ^ email.hashCode ^ role.hashCode;
}
