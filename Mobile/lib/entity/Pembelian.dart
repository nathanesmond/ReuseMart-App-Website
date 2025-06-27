import 'dart:convert';

class Pembelian {
  int id_pembelian;
  int? id_pegawai;
  int id_alamat;
  int id_pembeli;
  DateTime tanggal_laku;
  DateTime? tanggal_lunas;
  DateTime? tanggal_pengiriman;
  DateTime? tanggal_selesai;
  double ongkir;
  String status_pengiriman;
  String status_pembayaran;
  String bukti_pembayaran;
  int poin_digunakan;
  int poin_didapat;
  String metode_pengiriman;
  double total;
  String nomor_nota;

  Pembelian({
    required this.id_pembelian,
    this.id_pegawai,
    required this.id_alamat,
    required this.id_pembeli,
    required this.tanggal_laku,
    required this.tanggal_lunas,
    required this.tanggal_pengiriman,
    required this.ongkir,
    required this.status_pengiriman,
    required this.status_pembayaran,
    required this.bukti_pembayaran,
    required this.poin_digunakan,
    required this.poin_didapat,
    required this.metode_pengiriman,
    required this.total,
    required this.nomor_nota,
    required this.tanggal_selesai,
  });

  factory Pembelian.fromRawJson(String str) =>
      Pembelian.fromJson(json.decode(str));
  factory Pembelian.fromJson(Map<String, dynamic> json) {
    return Pembelian(
      id_pembelian: json["id_pembelian"] ?? 0,
      id_pegawai: json["id_pegawai"],
      id_alamat: json["id_alamat"] ?? 0,
      id_pembeli: json["id_pembeli"] ?? 0,
      tanggal_laku: json["tanggal_laku"] != null
          ? DateTime.parse(json["tanggal_laku"])
          : DateTime.now(),
      tanggal_lunas: json["tanggal_lunas"] != null
          ? DateTime.parse(json["tanggal_lunas"])
          : null,
      tanggal_pengiriman: json["tanggal_pengiriman"] != null
          ? DateTime.parse(json["tanggal_pengiriman"])
          : null,
      ongkir: (json["ongkir"] ?? 0).toDouble(),
      status_pengiriman: json["status_pengiriman"] ?? '',
      status_pembayaran: json["status_pembayaran"] ?? '',
      bukti_pembayaran: json['bukti_pembayaran'] != null &&
              json['bukti_pembayaran'].toString().isNotEmpty
          ? 'http://10.0.2.2:8000/${json['bukti_pembayaran']}'
          : '',
      poin_digunakan: json["poin_digunakan"] ?? 0,
      poin_didapat: json["poin_didapat"] ?? 0,
      metode_pengiriman: json["metode_pengiriman"] ?? '',
      total: (json["total"] ?? 0).toDouble(),
      nomor_nota: json["nomor_nota"] ?? '',
      tanggal_selesai: json["tanggal_selesai"] != null
          ? DateTime.parse(json["tanggal_selesai"])
          : null,
    );
  }

  String toRawJson() => json.encode(toJson());
  Map<String, dynamic> toJson() => {
        "id_pembelian": id_pembelian,
        "id_pegawai": id_pegawai ?? 0,
        "id_alamat": id_alamat,
        "id_pembeli": id_pembeli,
        "tanggal_laku": tanggal_laku,
        "tanggal_lunas": tanggal_lunas,
        "tanggal_pengiriman": tanggal_pengiriman,
        "ongkir": ongkir,
        "status_pengiriman": status_pengiriman,
        "status_pembayaran": status_pembayaran,
        "bukti_pembayaran": bukti_pembayaran,
        "poin_digunakan": poin_digunakan,
        "poin_didapat": poin_didapat,
        "metode_pengiriman": metode_pengiriman,
        "total": total,
        "nomor_nota": nomor_nota,
        "tanggal_selesai": tanggal_selesai,
      };
}
