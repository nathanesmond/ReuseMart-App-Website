import 'dart:convert';
import 'dart:async';

class Penitip {
  int id_penitip;
  String nama;
  String email;
  String password;
  String telepon;
  double wallet;
  int poin;
  String foto_ktp;
  int no_ktp;
  bool badges;
  double? total_rating;

  Penitip({
    required this.id_penitip,
    required this.nama,
    required this.email,
    required this.password,
    required this.telepon,
    required this.wallet,
    required this.poin,
    required this.foto_ktp,
    required this.no_ktp,
    required this.badges,
    this.total_rating,
  });

  factory Penitip.fromRawJson(String str) => Penitip.fromJson(json.decode(str));

  factory Penitip.fromJson(Map<String, dynamic> json) => Penitip(
        id_penitip: json["id_penitip"] ?? 0,
        nama: json["nama"] ?? '',
        email: json["email"] ?? '',
        password: json["password"] ?? '',
        telepon: json["telepon"] ?? '',
        wallet: (json["wallet"] ?? 0).toDouble(),
        poin: json["poin"] ?? 0,
        foto_ktp: json["foto_ktp"] ?? '',
        no_ktp: json["no_ktp"] ?? 0,
        badges: json["badges"] == null
            ? false
            : (json["badges"] is bool ? json["badges"] : json["badges"] == 1),
        total_rating: json["total_rating"] != null
            ? (json["total_rating"] as num).toDouble()
            : null,
      );

  String toRawJson() => json.encode(toJson());

  Map<String, dynamic> toJson() => {
        "id_penitip": id_penitip,
        "nama": nama,
        "email": email,
        "password": password,
        "telepon": telepon,
        "wallet": wallet,
        "poin": poin,
        "foto_ktp": foto_ktp,
        "no_ktp": no_ktp,
        "badges": badges,
        "total_rating": total_rating,
      };
}
