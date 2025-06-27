import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/AuthPenitipan.dart';
import 'package:reusemart_mobile/entity/Penitipan.dart';

class HistoryPenitipan extends StatefulWidget {
  final int id;
  const HistoryPenitipan({super.key, required this.id});

  @override
  _HistoryPenitipanState createState() => _HistoryPenitipanState();
}

class _HistoryPenitipanState extends State<HistoryPenitipan> {
  late Future<List<Penitipan>> _penitipan;
  List<Penitipan> penitipanList = [];
  List<Penitipan> filteredPenitipanList = [];
  Set<int> expandedIndexes = {};
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _penitipan = AuthPenitipan.getPenitipan(widget.id);
    _penitipan.then((value) {
      setState(() {
        penitipanList = value;
        filteredPenitipanList = value;
      });
    });
    _searchController.addListener(_onSearchChanged);
    print(_penitipan);
  }

  void _onSearchChanged() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      filteredPenitipanList = penitipanList.where((item) {
        return item.id_penitipan.toString().contains(query) ||
            item.tanggal_masuk.toString().toLowerCase().contains(query) ||
            item.barang.any((barang) =>
                barang.nama.toLowerCase().contains(query) ||
                barang.harga.toString().contains(query));
      }).toList();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 255, 255, 255),
      // backgroundColor: Color(0xFF1F510F),
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
          child: Text('History Penitipan',
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
          decoration: BoxDecoration(
            color: Color(0xFF1F510F),
          ),
          child: Container(
            margin: EdgeInsets.only(top: 40),
            width: screenWidth,
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 255, 255, 255),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(50),
                topRight: Radius.circular(50),
              ),
              border: Border.all(color: Color(0xFFe0e0e0)),
            ),
            child: Column(
              children: [
                Container(
                  margin:
                      EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 35),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Color(0xFFF0F0F0),
                    border: Border.all(color: Color(0xFFe0e0e0)),
                  ),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Cari Riwayat Penitipan',
                      hintStyle:
                          TextStyle(color: Color(0xFFBDBDBD), fontSize: 15),
                      prefixIcon: Icon(Icons.search, color: Color(0xFFBDBDBD)),
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      contentPadding: EdgeInsets.all(10),
                    ),
                  ),
                ),
                FutureBuilder<List<Penitipan>>(
                  future: _penitipan,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return Center(
                          child: Text('Terjadi kesalahan: ${snapshot.error}'));
                    } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return Center(
                          child: Text('Tidak ada riwayat penitipan.'));
                    } else {
                      if (filteredPenitipanList.isEmpty &&
                          _searchController.text.isEmpty) {
                        filteredPenitipanList = List.from(snapshot.data!);
                        penitipanList = List.from(snapshot.data!);
                      }
                      return ListView.builder(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        itemCount: filteredPenitipanList.length,
                        itemBuilder: (context, index) {
                          final item = filteredPenitipanList[index];
                          final isExpanded = expandedIndexes.contains(index);
                          return Card(
                            color: Color(0xFFF0F0F0),
                            margin: EdgeInsets.symmetric(
                                horizontal: 20, vertical: 10),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Column(
                              children: [
                                ListTile(
                                  leading: Icon(Icons.inventory_2,
                                      color: Color(0xFF1F510F)),
                                  title: Text(
                                      "Penitipan No.${item.id_penitipan}",
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  subtitle: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Text('Tanggal Masuk: ',
                                          style: TextStyle(
                                              color: Colors.grey,
                                              fontSize: 12)),
                                      Text(
                                        (item.tanggal_masuk != null
                                            ? item.tanggal_masuk
                                                .toLocal()
                                                .toString()
                                                .split(' ')[0]
                                            : '-'),
                                        style: TextStyle(
                                            color: Colors.grey, fontSize: 13),
                                      ),
                                    ],
                                  ),
                                  trailing: SizedBox(
                                    width: 70,
                                    height: 22,
                                    child: ElevatedButton(
                                      onPressed: () {
                                        setState(() {
                                          if (isExpanded) {
                                            expandedIndexes.remove(index);
                                          } else {
                                            expandedIndexes.add(index);
                                          }
                                        });
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Color(0xFF1F510F),
                                        padding: EdgeInsets.zero,
                                        minimumSize: Size(20, 25),
                                        tapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      child: Text(
                                        isExpanded ? 'Tutup' : 'Detail',
                                        style: TextStyle(
                                            fontSize: 12, color: Colors.white),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ),
                                ),
                                if (isExpanded)
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16.0, vertical: 8.0),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Divider(),
                                        Text("Barang:",
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        ListView.builder(
                                          shrinkWrap: true,
                                          physics:
                                              NeverScrollableScrollPhysics(),
                                          itemCount: item.barang.length,
                                          itemBuilder: (context, barangIndex) {
                                            final barang =
                                                item.barang[barangIndex];
                                            return Padding(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      vertical: 4.0),
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    barang.nama,
                                                    style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold),
                                                  ),
                                                  SizedBox(height: 2),
                                                  Text(
                                                      "Harga: Rp${barang.harga}"),
                                                  Text(
                                                      "Garansi: ${barang.isGaransi ? 'Ya' : 'Tidak'}"),
                                                  Text(
                                                      "Berat: ${barang.berat} kg"),
                                                  Text(
                                                      "Status: ${barang.status_barang}"),
                                                  Text(
                                                      "Deskripsi: ${barang.deskripsi}"),
                                                  Text(
                                                      "Perpanjangan: ${barang.status_perpanjangan ? 'Ya' : 'Tidak'}"),
                                                  Text(
                                                    "Tanggal Akhir: ${barang.tanggal_akhir != null ? barang.tanggal_akhir?.toLocal().toString().split(' ')[0] : '-'}",
                                                  ),
                                                  Text(
                                                    "Batas Ambil: ${barang.batas_ambil != null ? barang.batas_ambil?.toLocal().toString().split(' ')[0] : '-'}",
                                                  ),
                                                  Text(
                                                    "Tanggal Garansi: ${barang.akhir_garansi != null ? barang.akhir_garansi?.toLocal().toString().split(' ')[0] : '-'}",
                                                  ),
                                                  Text(
                                                    "Durasi Penitipan: ${barang.durasi_penitipan} hari",
                                                  ),  
                                                  Container(
                                                    width: 100,
                                                    height: 100,
                                                    decoration: BoxDecoration(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              8),
                                                      image: DecorationImage(
                                                        image: NetworkImage(
                                                            'http://10.0.2.2:8000/storage/${barang.foto}'),
                                                        fit: BoxFit.cover,
                                                      ),
                                                    ),
                                                  ),
                                                  SizedBox(height: 4),
                                                  Divider(),
                                                ],
                                              ),
                                            );
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          );
                        },
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
