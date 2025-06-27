class DetailBarang {
  final int idBarang;
  final String nama;
  final String deskripsi;
  final String foto;
  final double harga;
  final double berat;
  final String namaPenitip;
  final String namaKategori;
  final bool isGaransi;

  DetailBarang({
    required this.idBarang,
    required this.nama,
    required this.deskripsi,
    required this.foto,
    required this.harga,
    required this.berat,
    required this.namaPenitip,
    required this.namaKategori,
    required this.isGaransi,
  });

  factory DetailBarang.fromJson(Map<String, dynamic> json) {
    return DetailBarang(
      idBarang: json['id_barang'],
      nama: json['nama'] ?? '',
      deskripsi: json['deskripsi'] ?? '',
      foto: json["foto"]?.toString() ?? '',
      harga: (json['harga'] ?? 0).toDouble(),
      berat: (json['berat'] ?? 0).toDouble(),
      namaPenitip: json['nama_penitip'] ?? '',
      namaKategori: json['nama_kategori'] ?? '',
      isGaransi: json['isGaransi'] == null
          ? false
          : (json['isGaransi'] is bool
              ? json['isGaransi']
              : json['isGaransi'] == 1),
    );
  }
}
