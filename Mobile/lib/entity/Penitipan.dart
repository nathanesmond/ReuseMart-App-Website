import 'package:reusemart_mobile/entity/Barang.dart';

class Penitipan {
  int id_penitipan;
  int id_penitip;
  int id_pegawai;
  DateTime tanggal_masuk;
  List<Barang> barang;

  Penitipan(
      {required this.id_penitipan,
      required this.id_penitip,
      required this.id_pegawai,
      required this.tanggal_masuk,
      required this.barang});

  factory Penitipan.fromJson(Map<String, dynamic> json) {
    return Penitipan(
      id_penitipan: json['id_penitipan'] ?? 0,
      id_penitip: json['id_penitip'] ?? 0,
      id_pegawai: json['id_pegawai'] ?? 0,
      tanggal_masuk: json['tanggal_masuk'] == null
          ? DateTime.now()
          : DateTime.parse(json['tanggal_masuk']),
      barang: (json['penitipan_barang'] as List<dynamic>? ?? [])
          .map((e) => Barang.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
