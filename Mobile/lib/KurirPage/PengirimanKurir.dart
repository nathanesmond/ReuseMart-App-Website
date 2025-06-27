import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';
import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/KurirClient.dart';
import 'package:reusemart_mobile/entity/JadwalPengiriman.dart';
import 'package:intl/intl.dart';

class PengirimanKurir extends StatefulWidget {
  const PengirimanKurir({Key? key}) : super(key: key);

  @override
  _PengirimanKurirState createState() => _PengirimanKurirState();
}

class _PengirimanKurirState extends State<PengirimanKurir> {
  late Future<List<JadwalPengiriman>> _jadwalPengiriman;
  List<JadwalPengiriman> jadwalList = [];

  @override
  void initState() {
    super.initState();
    _jadwalPengiriman = KurirClient.getJadwalPengirimanKurir();
    _jadwalPengiriman.then((value) {
      setState(() {
        jadwalList = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.green[900],
          surfaceTintColor: Colors.transparent,
          title: Text('Pengiriman',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                  color: Colors.white)),
          centerTitle: true,
          leading: Padding(
            padding: const EdgeInsets.only(left: 30.0),
            child: IconButton(
              icon: Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ),
          elevation: 0,
        ),
        body: Container(
          decoration: BoxDecoration(
            color: Colors.green[900],
          ),
          child: Container(
            margin: EdgeInsets.only(top: 20),
            width: double.infinity,
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
                SizedBox(
                  height: 50,
                ),
                Expanded(
                  child: FutureBuilder<List<JadwalPengiriman>>(
                      future: _jadwalPengiriman,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Center(
                              child: CircularProgressIndicator());
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
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
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
                                            Text(
                                              "${DateFormat('dd MMMM yyyy').format(detail[index].tanggal_pengiriman)}",
                                              style: TextStyle(
                                                fontSize: 17,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    Container(
                                      margin: EdgeInsets.only(top: 10),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.end,
                                        children: [
                                          ElevatedButton(
                                            onPressed: () {
                                              _acceptModal(
                                                  context, detail[index].id_pembelian, detail[index].nomor_nota);
                                            },
                                            style: ElevatedButton.styleFrom(
                                              shape: RoundedRectangleBorder(
                                                borderRadius:
                                                    BorderRadius.circular(30),
                                              ),
                                              minimumSize: Size(80, 30),
                                              backgroundColor:
                                                  Colors.green[900],
                                            ),
                                            child: Text("Selesai",
                                                style: TextStyle(
                                                    fontSize: 15,
                                                    color: Colors.white,
                                                    fontWeight:
                                                        FontWeight.bold)),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Divider(
                                      color: Color.fromARGB(255, 245, 203, 88),
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
          ),
        ));
  }

  Future<void> _acceptModal(BuildContext context, int id, String nota) {
    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
            backgroundColor: Colors.white,
          title: const Text('Selesaikan Pengiriman'),
          content: Text(
            'Apakah anda yakin ingin menyelesaikan pengiriman untuk nomor nota : $nota',
          ),
          actions: <Widget>[
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                textStyle: TextStyle(
                  fontSize: 16,
                ),
              ),
              child: const Text('Batal'),
              onPressed: () {
                
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.green[900],
                foregroundColor: Colors.white,
                textStyle: TextStyle(
                  fontSize: 16,
                ),
              ),
              child: const Text('Selesaikan'),
              onPressed: () {
                selesaikanPengiriman(id);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> selesaikanPengiriman(int idPembelian) async {
    try {
      await KurirClient.selesaikanStatusPengiriman(idPembelian);
      setState(() {
        _jadwalPengiriman = KurirClient.getJadwalPengirimanKurir();
      });
      ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: AwesomeSnackbarContent(
                title: 'Success',
                message: 'Berhasil menyelesaikan pengiriman',
                contentType: ContentType.success,
              ),
              duration: Duration(seconds: 2),
              elevation: 0,
              behavior: SnackBarBehavior.floating,
              backgroundColor: Colors.transparent,
            ),
          );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: AwesomeSnackbarContent(
                title: 'Failed',
                message: 'Gagal menyelesaikan pengiriman',
                contentType: ContentType.success,
              ),
              duration: Duration(seconds: 2),
              elevation: 0,
              behavior: SnackBarBehavior.floating,
              backgroundColor: Colors.transparent,
            ),
          );
    }
  }
}
