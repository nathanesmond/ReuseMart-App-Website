import 'dart:convert';

class Barang {
  int id_barang;
  int id_penitipan;
  String id_kategori;
  int id_hunter;
  String nama;
  String deskripsi;
  String foto;
  double berat;
  bool isGaransi;
  DateTime? akhir_garansi;
  bool status_perpanjangan;
  double harga;
  DateTime? tanggal_akhir;
  DateTime? batas_ambil;
  String status_barang;
  DateTime? tanggal_ambil;
  DateTime? tanggal_garansi;
  int durasi_penitipan;

  Barang({
    required this.id_barang,
    required this.id_penitipan,
    required this.id_kategori,
    required this.id_hunter,
    required this.nama,
    required this.deskripsi,
    required this.foto,
    required this.berat,
    required this.isGaransi,
    required this.akhir_garansi,
    required this.status_perpanjangan,
    required this.harga,
    required this.tanggal_akhir,
    required this.batas_ambil,
    required this.status_barang,
    required this.tanggal_ambil,
    required this.tanggal_garansi,
    required this.durasi_penitipan,
  });

  factory Barang.fromRawJson(String str) => Barang.fromJson(json.decode(str));

  factory Barang.fromJson(Map<String, dynamic> json) => Barang(
        id_barang: json["id_barang"] ?? 0,
        id_penitipan: json["id_penitipan"] ?? 0,
        id_kategori: json["id_kategori"]?.toString() ?? '',
        id_hunter: json["id_hunter"] ?? 0,
        nama: json["nama"]?.toString() ?? '',
        deskripsi: json["deskripsi"]?.toString() ?? '',
        foto: json["foto"]?.toString() ?? '',
        berat: (json["berat"] ?? 0).toDouble(),
        isGaransi: json["isGaransi"] == null
            ? false
            : (json["isGaransi"] is bool
                ? json["isGaransi"]
                : json["isGaransi"] == 1),
        akhir_garansi: (json["akhir_garansi"] == null ||
                json["akhir_garansi"].toString().isEmpty)
            ? null
            : DateTime.parse(json["akhir_garansi"].toString()),
        status_perpanjangan: json["status_perpanjangan"] == null
            ? false
            : (json["status_perpanjangan"] is bool
                ? json["status_perpanjangan"]
                : json["status_perpanjangan"] == 1),
        harga: (json["harga"] ?? 0).toDouble(),
        tanggal_akhir: (json["tanggal_akhir"] == null ||
                json["tanggal_akhir"].toString().isEmpty)
            ? null
            : DateTime.parse(json["tanggal_akhir"].toString()),
        batas_ambil: (json["batas_ambil"] == null ||
                json["batas_ambil"].toString().isEmpty)
            ? null
            : DateTime.parse(json["batas_ambil"].toString()),
        status_barang: json["status_barang"]?.toString() ?? '',
        tanggal_ambil: (json["tanggal_ambil"] == null ||
                json["tanggal_ambil"].toString().isEmpty)
            ? null
            : DateTime.parse(json["tanggal_ambil"].toString()),
        tanggal_garansi: (json["tanggal_garansi"] == null ||
                json["tanggal_garansi"].toString().isEmpty)
            ? null
            : DateTime.parse(json["tanggal_garansi"].toString()),
        durasi_penitipan: json["durasi_penitipan"] ?? 0,
      );
}
