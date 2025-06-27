import 'package:flutter/material.dart';
import 'package:reusemart_mobile/History/DetailPembelian.dart';
import 'package:reusemart_mobile/client/AuthPembelian.dart';
import 'package:reusemart_mobile/entity/DetailPembelian.dart';
import 'package:intl/intl.dart';

class HistoryPembelian extends StatefulWidget {
  const HistoryPembelian({super.key});

  @override
  _HistoryPembelianState createState() => _HistoryPembelianState();
}

class _HistoryPembelianState extends State<HistoryPembelian> {
  late Future<List<DetailPembelian>> _pembelian;
  List<DetailPembelian> pembelianList = [];
  List<DetailPembelian> filteredpembelianList = [];
  final TextEditingController _searchController = TextEditingController();
  DateTime? startDate;
  DateTime? endDate;

  @override
  void initState() {
    super.initState();
    _pembelian = AuthPembelian.getPembelian();
    _pembelian.then((value) {
      setState(() {
        pembelianList = value;
        filteredpembelianList = value;
        _onSearchChanged();
      });
    });
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      filteredpembelianList = pembelianList.where((item) {
        final tanggalLaku = item.pembelian.tanggal_laku;
        final tanggalSelesai = item.pembelian.tanggal_selesai;
        final matchesQuery = item.pembelian.nomor_nota
                .toLowerCase()
                .toString()
                .contains(query) ||
            item.pembelian.tanggal_laku.toLocal().toString().contains(query) ||
            item.pembelian.status_pengiriman.toLowerCase().contains(query) ||
            item.pembelian.metode_pengiriman.toLowerCase().contains(query);

        bool matchesDate = true;
        if (startDate != null) {
          matchesDate = matchesDate && !tanggalLaku.isBefore(startDate!);
        }
        if (endDate != null) {
          matchesDate = matchesDate && !tanggalSelesai!.isAfter(endDate!);
        }

        return matchesQuery && matchesDate;
      }).toList();
    });
  }

  Future<void> _selectStartDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: startDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2700),
    );
    if (picked != null && picked != startDate) {
      setState(() {
        startDate = picked;
        _onSearchChanged();
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: endDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2700),
    );
    if (picked != null && picked != endDate) {
      setState(() {
        endDate = picked;
        _onSearchChanged();
      });
    }
  }

  void _clearDateFilters() {
    setState(() {
      startDate = null;
      endDate = null;
      _onSearchChanged();
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
      backgroundColor: Color(0xFF1F510F),
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
          child: Text('History Pembelian',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 25,
                color: Colors.white,
              )),
        ),
        elevation: 0,
      ),
      body: Container(
        height: MediaQuery.of(context).size.height,
        margin: EdgeInsets.only(top: 40),
        padding: EdgeInsets.only(top: 20),
        width: screenWidth,
        decoration: BoxDecoration(
          color: Color.fromARGB(255, 255, 255, 255),
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(50),
            topRight: Radius.circular(50),
          ),
          border: Border.all(color: Color(0xFFe0e0e0)),
        ),
        child: SingleChildScrollView(
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
                    hintText: 'Cari Riwayat Pembelian',
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
                margin: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => _selectStartDate(context),
                        child: Container(
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            border: Border.all(color: Color(0xFFe0e0e0)),
                            borderRadius: BorderRadius.circular(10),
                            color: Color(0xFFF0F0F0),
                          ),
                          child: Text(
                            startDate == null
                                ? 'Tanggal Mulai'
                                : DateFormat('dd/MM/yyyy').format(startDate!),
                            style: TextStyle(
                              color: startDate == null
                                  ? Color(0xFFBDBDBD)
                                  : Colors.black,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 10),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => _selectEndDate(context),
                        child: Container(
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            border: Border.all(color: Color(0xFFe0e0e0)),
                            borderRadius: BorderRadius.circular(10),
                            color: Color(0xFFF0F0F0),
                          ),
                          child: Text(
                            endDate == null
                                ? 'Tanggal Selesai'
                                : DateFormat('dd/MM/yyyy').format(endDate!),
                            style: TextStyle(
                              color: endDate == null
                                  ? Color(0xFFBDBDBD)
                                  : Colors.black,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.clear, color: Color(0xFF1F510F)),
                      onPressed: _clearDateFilters,
                    ),
                  ],
                ),
              ),
              FutureBuilder<List<DetailPembelian>>(
                future: _pembelian,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(
                        child: Text('Terjadi kesalahan: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text('Tidak ada riwayat pembelian.'));
                  } else {
                    return ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: filteredpembelianList.length,
                      itemBuilder: (context, index) {
                        final item = filteredpembelianList[index];
                        return Card(
                          color: Color(0xFFF0F0F0),
                          margin: EdgeInsets.symmetric(
                              horizontal: 20, vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: ListTile(
                            leading: Icon(Icons.shopping_bag,
                                color: Color(0xFF1F510F)),
                            title: Text("Order No.${item.pembelian.nomor_nota}",
                                style: TextStyle(fontWeight: FontWeight.bold)),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text(
                                    'Tanggal Mulai: ${item.pembelian.tanggal_laku.toLocal().toString().split(' ')[0]}',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 15)),
                                Text(
                                    'Tanggal Selesai: ${item.pembelian.tanggal_selesai?.toLocal().toString().split(' ')[0]}',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 15)),
                                Text(
                                    'Status: ${item.pembelian.status_pengiriman}',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 15)),
                                Text(
                                    'Metode Pengiriman: ${item.pembelian.metode_pengiriman}',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 15)),
                              ],
                            ),
                            trailing: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  'Rp ${item.pembelian.total.toStringAsFixed(0)}',
                                  style: TextStyle(
                                    color: Colors.green,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                SizedBox(height: 5),
                                SizedBox(
                                  width: 70,
                                  child: ElevatedButton(
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              DetailPembelianPage(
                                            id: item.pembelian.id_pembelian,
                                          ),
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Color(0xFF1F510F),
                                      padding: EdgeInsets.zero,
                                      minimumSize: Size(20, 25),
                                      tapTargetSize:
                                          MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    child: Text(
                                      'Detail',
                                      style: TextStyle(
                                          fontSize: 14, color: Colors.white),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ),
                              ],
                            ),
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
    );
  }
}
