class Komisi {
  final int idKomisi;
  final double komisiHunter;
  final String namaBarang;
  final String namaPenitip;
  final double harga;

  Komisi({
    required this.idKomisi,
    required this.komisiHunter,
    required this.namaBarang,
    required this.namaPenitip,
    required this.harga,
  });

  factory Komisi.fromJson(Map<String, dynamic> json) {
    return Komisi(
      idKomisi: json['id_komisi'],
      komisiHunter: (json['komisi_hunter'] ?? 0).toDouble(),
      namaBarang: json['nama_barang'] ?? '',
      namaPenitip: json['nama_penitip'] ?? '',
      harga: (json['harga'] ?? 0).toDouble(),
    );
  }
}
