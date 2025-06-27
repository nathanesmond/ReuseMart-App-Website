import 'dart:convert';

class Merchandise {
  int idMerchandise;
  String nama;
  String deskripsi;
  String foto;
  int poin;
  int stok;

  Merchandise({
    required this.idMerchandise,
    required this.nama,
    required this.deskripsi,
    required this.foto,
    required this.poin,
    required this.stok,
  });

  factory Merchandise.fromRawJson(String str) =>
      Merchandise.fromJson(json.decode(str));

  factory Merchandise.fromJson(Map<String, dynamic> json) => Merchandise(
        idMerchandise: json["id_merchandise"] ?? 0,
        nama: json["nama_merchandise"]?.toString() ?? '',
        deskripsi: json["deskripsi"]?.toString() ?? '',
        foto: json["foto"]?.toString() ?? '',
        poin: json["poin"] ?? 0,
        stok: json["stok"] ?? 0,
      );
}
