import 'package:flutter/material.dart';
import '../client/AuthBarang.dart';
import '../entity/DetailBarang.dart';

class Detailbarang extends StatefulWidget {
  final int id;

  const Detailbarang({super.key, required this.id});

  @override
  _DetailbarangState createState() => _DetailbarangState();
}

class _DetailbarangState extends State<Detailbarang> {
  late Future<DetailBarang> _barang;

  @override
  void initState() {
    super.initState();
    print("Loading barang ID: ${widget.id}");
    _barang = Authbarang.fetchDetailBarang(widget.id);
  }

  @override
  void didUpdateWidget(covariant Detailbarang oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.id != widget.id) {
      print("ID changed: Refetching detail for ID ${widget.id}");
      setState(() {
        _barang = Authbarang.fetchDetailBarang(widget.id);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Barang')),
      body: FutureBuilder<DetailBarang>(
        future: _barang,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('Barang tidak ditemukan.'));
          }

          final barang = snapshot.data!;
          print("Detail fetched: ${barang.nama}, ID: ${barang.idBarang}");

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 10),
                    height: 150,
                    width: 340,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        barang.foto,
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 200,
                            width: double.infinity,
                            color: Colors.grey[300], // Light gray box
                            child: const Icon(
                              Icons.broken_image,
                              size: 60,
                              color: Colors.grey,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    barang.nama,
                    style: const TextStyle(
                        fontSize: 26, fontWeight: FontWeight.bold),
                  ),
                  const Divider(),
                  infoRow(Icons.category, "Kategori", barang.namaKategori),
                  infoRow(Icons.person, "Penitip", barang.namaPenitip),
                  infoRow(Icons.monetization_on, "Harga",
                      "Rp ${barang.harga.toStringAsFixed(0)}",
                      valueColor: Colors.green),
                  infoRow(Icons.scale, "Berat", "${barang.berat} kg"),
                  if (barang.isGaransi == true)
                    infoRow(Icons.check_circle, "Garansi", "Ya",
                        valueColor: Colors.green)
                  else
                    infoRow(Icons.cancel, "Garansi", "Tidak",
                        valueColor: Colors.red),
                  const Divider(),
                  const Text(
                    "Deskripsi:",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    barang.deskripsi,
                    style: const TextStyle(fontSize: 14, height: 1.4),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget infoRow(IconData icon, String label, String value,
      {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 8),
          Text(
            "$label: ",
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: valueColor ?? Colors.black),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
