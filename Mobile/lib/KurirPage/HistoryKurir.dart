import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/KurirClient.dart';
import 'package:reusemart_mobile/entity/JadwalPengiriman.dart';
import 'package:intl/intl.dart';

class Historykurir extends StatefulWidget {
  const Historykurir({super.key});

  @override
  State<Historykurir> createState() => _HistorykurirState();
}

class _HistorykurirState extends State<Historykurir> {
  late Future<List<JadwalPengiriman>> _historyPengiriman;
  List<JadwalPengiriman> jadwalList = [];

  @override
  void initState() {
    super.initState();
    _historyPengiriman = KurirClient.getHistoryPengirimanKurir();
    _historyPengiriman.then((value) {
      setState(() {
        jadwalList = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          title: Text('Riwayat',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                  color: Colors.black)),
          centerTitle: true,
          elevation: 0,
        ),
        body: Container(
          margin: EdgeInsets.only(top: 5),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular(30), topRight: Radius.circular(30)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Container(
              //   margin:
              //       EdgeInsets.only(top: 40, left: 20, right: 20, bottom: 35),
              //   decoration: BoxDecoration(
              //       borderRadius: BorderRadius.circular(10),
              //       color: Color(0xFFF0F0F0),
              //       border: Border.all(color: Color(0xFFe0e0e0))),
              //   child: TextField(
              //     decoration: InputDecoration(
              //       hintText: 'Cari',
              //       hintStyle:
              //           TextStyle(color: Color(0xFFBDBDBD), fontSize: 15),
              //       prefixIcon: Icon(Icons.search, color: Color(0xFFBDBDBD)),
              //       enabledBorder: InputBorder.none,
              //       focusedBorder: InputBorder.none,
              //       contentPadding: EdgeInsets.all(10),
              //     ),
              //   ),
              // ),
              SizedBox(height:50),
              Expanded(
                child: FutureBuilder(
                    future: _historyPengiriman,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (snapshot.hasError) {
                        return Center(
                            child:
                                Text('Terjadi kesalahan: ${snapshot.error}'));
                      } else if (!snapshot.hasData) {
                        return const Center(
                            child: Text('Data tidak ditemukan.'));
                      }

                      final detail = snapshot.data!;
                      return ListView.builder(
                        itemCount: detail.length,
                        itemBuilder: (context, index) {
                          return Container(
                            margin: EdgeInsets.only(
                                bottom: 15, left: 20, right: 20),
                            child: Container(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        width:
                                            MediaQuery.of(context).size.width -
                                                40,
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Align(
                                              alignment: Alignment.centerRight,
                                              child: Text(
                                                "${DateFormat('dd MMMM yyyy').format(detail[index].tanggal_pengiriman)}",
                                                style: TextStyle(
                                                  fontSize: 17,
                                                ),
                                                textAlign: TextAlign.right,
                                              ),
                                            ),
                                            Container(
                                              margin:
                                                  EdgeInsets.only(bottom: 5),
                                              child: Text(
                                                "${detail[index].nama_pembeli}",
                                                style: TextStyle(fontSize: 17),
                                              ),
                                            ),
                                            Container(
                                              margin:
                                                  EdgeInsets.only(bottom: 5),
                                              child: Text(
                                                "${detail[index].nama_jalan}",
                                                style: TextStyle(
                                                    fontSize: 18,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                              
                                            ),
                                            Container(
                                              margin:
                                                  EdgeInsets.only(bottom: 5),
                                              child: Text(
                                                "${detail[index].nomor_nota}",
                                                style: TextStyle(
                                                    fontSize: 18,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                  Divider(
                                    color: Colors.black45,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    }),
              ),
            ],
          ),
        ));
  }
}
