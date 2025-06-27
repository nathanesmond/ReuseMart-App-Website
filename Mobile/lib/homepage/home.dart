import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/AuthPenitip.dart';
import 'package:reusemart_mobile/client/AuthPenitipan.dart';
import 'package:reusemart_mobile/entity/Barang.dart';
import 'package:reusemart_mobile/client/AuthBarang.dart';
import 'package:reusemart_mobile/homepage/detailBarang.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int selectedIndex = 0;
  final String _search = '';
  late Future<List<Map<String, dynamic>>> _getTopSellers;
  late Future<List<Barang>> _barang;
  List<Barang> barangList = [];
  @override
  void initState() {
    super.initState();
    _getTopSellers = AuthPenitip.getTopSeller();
    AuthPenitipan.updateBarangLebihTujuhHari();
    _barang = Authbarang.getBarang();
  }

  final List<Map<String, dynamic>> categories = [
    {'icon': Icons.checkroom, 'label': 'Pakaian'},
    {'icon': Icons.park, 'label': 'Outdoor'},
    {'icon': Icons.chair, 'label': 'Furniture'},
    {'icon': Icons.school, 'label': 'Sekolah'},
    {'icon': Icons.car_repair, 'label': 'Otomotif'},
    {'icon': Icons.child_care, 'label': 'Bayi'},
    {'icon': Icons.videogame_asset, 'label': 'Koleksi'},
    {'icon': Icons.memory, 'label': 'Elektronik'},
    {'icon': Icons.work, 'label': 'Pekerjaan'},
    {'icon': Icons.brush, 'label': 'Skincare'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        title: Center(
          child: Text('ReuseMart',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 25,
              )),
        ),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.all(10),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                margin:
                    EdgeInsets.only(top: 10, left: 20, right: 20, bottom: 35),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Color(0xFFF0F0F0),
                    border: Border.all(color: Color(0xFFe0e0e0))),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Cari Produk',
                    hintStyle:
                        TextStyle(color: Color(0xFFBDBDBD), fontSize: 15),
                    prefixIcon: Icon(Icons.search, color: Color(0xFFBDBDBD)),
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    contentPadding: EdgeInsets.all(10),
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.only(bottom: 15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: Colors.black,
                            endIndent: 20,
                            indent: 10,
                          ),
                        ),
                        Text(
                          "Papan Peringkat Top Seller",
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Expanded(
                          child: Divider(
                            color: Colors.black,
                            endIndent: 20,
                            indent: 10,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    FutureBuilder<List<Map<String, dynamic>>>(
                      future: _getTopSellers,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return Center(child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Text('Gagal memuat data');
                        } else if (!snapshot.hasData ||
                            snapshot.data!.isEmpty) {
                          return Card(
                            elevation: 3,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            color: Colors.grey.shade100,
                            child: Container(
                              padding: EdgeInsets.symmetric(
                                  vertical: 24, horizontal: 16),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.grey.shade300,
                                  width: 1,
                                ),
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.hourglass_empty,
                                    color: Colors.grey.shade600,
                                    size: 40,
                                  ),
                                  SizedBox(height: 12),
                                  Text(
                                    'Belum Ada Top Seller',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                      color: Colors.grey.shade800,
                                    ),
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Tunggu hingga penjual terbaik muncul di leaderboard!',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey.shade600,
                                      fontStyle: FontStyle.italic,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
                          );
                        }
                        final sellers = snapshot.data!;
                        final seller = sellers.first;
                        return Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          color: Colors.amber.shade200,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.amber.shade300,
                                  Colors.amber.shade100
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.amber.shade700,
                                width: 2,
                              ),
                            ),
                            child: ListTile(
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 12),
                              leading: Icon(
                                Icons.star,
                                color: Colors.amber.shade900,
                                size: 36,
                              ),
                              title: Text(
                                seller['nama'],
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: Colors.black87,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              subtitle: Text(
                                '#1 Leaderboard',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black54,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                              trailing: Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.amber.shade700,
                                  borderRadius: BorderRadius.circular(12),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.amber.shade900
                                          .withOpacity(0.3),
                                      blurRadius: 4,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                  border: Border.all(
                                    color: Colors.amber.shade900,
                                    width: 1,
                                  ),
                                ),
                                child: Text(
                                  'Top Seller',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 13,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 15, bottom: 15),
                      child: Row(
                        children: [
                          Expanded(
                            child: Divider(
                              color: Colors.black,
                              endIndent: 20,
                              indent: 10,
                            ),
                          ),
                          Text(
                            "Kategori Barang",
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          Expanded(
                            child: Divider(
                              color: Colors.black,
                              endIndent: 20,
                              indent: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: EdgeInsets.all(16),
                child: GridView.builder(
                  itemCount: categories.length,
                  physics: NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount:
                        MediaQuery.of(context).size.width > 600 ? 10 : 5,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 20,
                    childAspectRatio: 0.6,
                  ),
                  itemBuilder: (context, index) {
                    bool isSelected = selectedIndex == index;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedIndex = index;
                        });
                      },
                      child: Column(
                        children: [
                          Container(
                            padding: EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? Color(0xFF1F510F)
                                  : Colors.grey[300],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              categories[index]['icon'],
                              color: isSelected ? Colors.white : Colors.black,
                              size: 25,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            categories[index]['label'],
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.black,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Container(
                margin: EdgeInsets.only(bottom: 15),
                child: Row(
                  children: [
                    Expanded(
                      child: Divider(
                        color: Colors.black,
                        endIndent: 20,
                        indent: 10,
                      ),
                    ),
                    Text(
                      "Lihat Barang",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Expanded(
                      child: Divider(
                        color: Colors.black,
                        endIndent: 20,
                        indent: 10,
                      ),
                    ),
                  ],
                ),
              ),
              FutureBuilder<List<Barang>>(
                future: Authbarang
                    .getBarang(), // Replace with your own future variable if needed
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text('Tidak ada barang tersedia.'));
                  }

                  final barangList = snapshot.data!;

                  return GridView.builder(
                    physics: NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: barangList.length,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount:
                          MediaQuery.of(context).size.width > 600 ? 4 : 2,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 20,
                      childAspectRatio: 0.9,
                    ),
                    itemBuilder: (context, index) {
                      final barang = barangList[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => Detailbarang(
                                id: barang.id_barang,
                              ),
                            ),
                          );
                        },
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              margin: EdgeInsets.symmetric(horizontal: 10),
                              height: 150,
                              width: 150,
                              decoration: BoxDecoration(
                                color: Colors.grey[300],
                                borderRadius: BorderRadius.circular(10),
                                image: DecorationImage(
                                  image: NetworkImage(barang.foto),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.only(left: 13, top: 10),
                              child: Text(
                                barang.nama,
                                style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.bold),
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.only(
                                left: 13,
                              ),
                              child:
                                  Text('Rp ${barang.harga.toStringAsFixed(0)}'),
                            ),
                          ],
                        ),
                      );
                    },
                  );
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
