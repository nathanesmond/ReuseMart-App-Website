import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/AuthPembelian.dart';
import 'package:reusemart_mobile/entity/DetailPembelian.dart';

class DetailPembelianPage extends StatefulWidget {
  final int id;
  const DetailPembelianPage({super.key, required this.id});

  @override
  State<DetailPembelianPage> createState() => _DetailPembelianPageState();
}

class _DetailPembelianPageState extends State<DetailPembelianPage> {
  late Future<DetailPembelian> _detailPembelian;
  String alamat = "";

  @override
  void initState() {
    super.initState();
    AuthPembelian.getAlamatUtama().then((_) {
      AuthPembelian.loadAlamatUtama().then((value) {
        setState(() {
          alamat = value;
        });
      });
    });
    _detailPembelian = AuthPembelian.getPembelianById(widget.id);
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        leading: IconButton(
          padding: EdgeInsets.only(top: 10, left: 20),
          icon: Icon(Icons.arrow_back_ios_new),
          iconSize: screenWidth * 0.04,
          color: Color(0xFFF5CB58),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        backgroundColor: Color(0xFF1F510F),
        title: Container(
          margin: EdgeInsets.only(top: 10),
          child: Text('Detail Pembelian',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 25,
                color: Colors.white,
              )),
        ),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Container(
          decoration: const BoxDecoration(
            color: Color(0xFF1F510F),
          ),
          child: Container(
            margin: const EdgeInsets.only(top: 40),
            width: screenWidth,
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(50),
                topRight: Radius.circular(50),
              ),
            ),
            child: FutureBuilder<DetailPembelian>(
              future: _detailPembelian,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(
                      child: Text('Terjadi kesalahan: ${snapshot.error}'));
                } else if (!snapshot.hasData) {
                  return const Center(child: Text('Data tidak ditemukan.'));
                }

                final detail = snapshot.data!;
                final pembelian = detail.pembelian;
                final items = detail.barang;

                return Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Order No. ${pembelian.nomor_nota}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${pembelian.tanggal_laku.day.toString().padLeft(2, '0')} ${_getMonthName(pembelian.tanggal_laku.month)} ${pembelian.tanggal_laku.year}, '
                        '${pembelian.tanggal_laku.hour.toString().padLeft(2, '0')}:${pembelian.tanggal_laku.minute.toString().padLeft(2, '0')}',
                        style: const TextStyle(fontSize: 14),
                      ),
                      const Divider(
                        height: 32,
                        color: Color(0xFFF5CB58),
                      ),
                      ...items.map((item) => Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: Row(
                              children: [
                                Container(
                                  width: 100,
                                  height: 100,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8),
                                    image: DecorationImage(
                                      image: NetworkImage(item.foto),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.nama,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Text(
                                        'Rp ${item.harga}',
                                        style: const TextStyle(
                                          color: Colors.grey,
                                          fontSize: 16,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          )),
                      const Divider(
                        height: 32,
                        color: Color(0xFFF5CB58),
                      ),
                      const Text(
                        'Alamat Pengiriman',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        alamat,
                        style: const TextStyle(fontSize: 16),
                      ),
                      const Divider(
                        height: 32,
                        color: Color(0xFFF5CB58),
                      ),
                      const Text(
                        'Tanggal',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Tanggal Laku',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.tanggal_laku.day
                                    .toString()
                                    .padLeft(2, '0') +
                                ' ${_getMonthName(pembelian.tanggal_laku.month)} ' +
                                pembelian.tanggal_laku.year.toString(),
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Tanggal Lunas',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.tanggal_lunas != null
                                ? '${pembelian.tanggal_lunas!.day.toString().padLeft(2, '0')} ${_getMonthName(pembelian.tanggal_lunas!.month)} ${pembelian.tanggal_lunas!.year}'
                                : '-',
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Tanggal Pengiriman',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            pembelian.tanggal_pengiriman != null
                                ? '${pembelian.tanggal_pengiriman!.day.toString().padLeft(2, '0')} ${_getMonthName(pembelian.tanggal_pengiriman!.month)} ${pembelian.tanggal_pengiriman!.year}'
                                : '-',
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Tanggal Selesai',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            pembelian.tanggal_selesai != null
                                ? '${pembelian.tanggal_selesai!.day.toString().padLeft(2, '0')} ${_getMonthName(pembelian.tanggal_selesai!.month)} ${pembelian.tanggal_selesai!.year}'
                                : '-',
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const Divider(
                        height: 32,
                        color: Color(0xFFF5CB58),
                      ),
                      Text(
                        'Informasi Pembelian',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Metode Pengiriman',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.metode_pengiriman,
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Status Pembayaran',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.status_pembayaran,
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Status Pengiriman',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.status_pengiriman,
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Poin digunakan',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.poin_digunakan.toString(),
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Poin didapat',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pembelian.poin_didapat.toString(),
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                      const Divider(
                        height: 32,
                        color: Color(0xFFF5CB58),
                      ),
                      const Text(
                        'Bukti Pembayaran',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Image.network(
                        pembelian.bukti_pembayaran,
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                      const Divider(
                        height: 32,
                        color: Color(0xFFF5CB58),
                      ),
                      const Text(
                        'Biaya',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Ongkir',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Rp ${pembelian.ongkir.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total Harga Barang',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            'Rp ${items.fold<double>(0, (sum, item) => sum + item.harga).toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total Pembayaran',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Rp ${pembelian.total.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  String _getMonthName(int month) {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];
    return months[month - 1];
  }
}
