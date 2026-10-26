import '../../domain/entities/user_entity.dart';

/// Modelo de datos para Usuario con serialización JSON
class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    required super.role,
    super.token,
  });

  /// Factory constructor para instanciar desde JSON retornado por la API
  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserModel(
      id: json['id'] is int ? json['id'] as int : int.parse(json['id'].toString()),
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? 'citizen',
      token: token ?? json['token'] as String?,
    );
  }

  /// Conversión a Map para persistencia en cache local o envíos
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      if (token != null) 'token': token,
    };
  }

  /// Convierte de UserModel a UserEntity del dominio
  UserEntity toEntity() => UserEntity(
        id: id,
        name: name,
        email: email,
        role: role,
        token: token,
      );

  UserModel copyWith({
    int? id,
    String? name,
    String? email,
    String? role,
    String? token,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      token: token ?? this.token,
    );
  }
}
