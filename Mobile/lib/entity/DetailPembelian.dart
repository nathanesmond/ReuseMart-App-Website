import 'package:reusemart_mobile/entity/Barang.dart';
import 'package:reusemart_mobile/entity/Pembelian.dart';

class DetailPembelian {
  final int id_detail_pembelian;
  final Pembelian pembelian;
  List<Barang> barang;

  DetailPembelian({
    required this.id_detail_pembelian,
    required this.pembelian,
    required this.barang,
  });
  factory DetailPembelian.fromJson(Map<String, dynamic> json) {
    return DetailPembelian(
      id_detail_pembelian: json['items']?[0]?['id_detail_pembelian'] ?? 0,
      pembelian: Pembelian.fromJson(json['pembelian'] ?? {}),
      barang: (json['items'] as List<dynamic>? ?? [])
          .map((e) => Barang.fromJson(e['barang'] as Map<String, dynamic>))
          .toList(),
    );
  }
}
