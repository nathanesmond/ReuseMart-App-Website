import 'dart:async';
import 'dart:convert';

class Pegawai {
  int id_pegawai;
  int id_role;
  String nama;
  String email;
  String password;
  DateTime tanggal_masuk;
  DateTime tanggal_lahir;
  double wallet;

  Pegawai({
    required this.id_pegawai,
    required this.id_role,
    required this.nama,
    required this.email,
    required this.password,
    required this.tanggal_masuk,
    required this.tanggal_lahir,
    required this.wallet,
  });

  factory Pegawai.fromRawJson(String str) => Pegawai.fromJson(json.decode(str));
  factory Pegawai.fromJson(Map<String, dynamic> json) {
    return Pegawai(
      id_pegawai: json["id_pegawai"] ?? 0,
      id_role: json["id_role"] ?? 0,
      nama: json["nama"] ?? '',
      email: json["email"] ?? '',
      password: json["password"] ?? '',
      tanggal_masuk: json["tanggal_masuk"] != null
          ? DateTime.parse(json["tanggal_masuk"])
          : DateTime.now(),
      tanggal_lahir: json["tanggal_lahir"] != null
          ? DateTime.parse(json["tanggal_lahir"])
          : DateTime.now(),
      wallet: json["wallet"] != null
          ? double.tryParse(json["wallet"].toString())
          : null,
    );
  }

  String toRawJson() => json.encode(toJson());
  Map<String, dynamic> toJson() => {
        "id_pegawai": id_pegawai,
        "id_role": id_role,
        "nama": nama,
        "email": email,
        "password": password,
        "tanggal_masuk": tanggal_masuk.toIso8601String(),
        "tanggal_lahir": tanggal_lahir.toIso8601String(),
        "wallet": wallet,
      };
}
