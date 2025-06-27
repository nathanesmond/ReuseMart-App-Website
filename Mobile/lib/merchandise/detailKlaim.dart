import 'package:flutter/material.dart';
import 'package:reusemart_mobile/homepage/profilePembeli.dart';
import 'package:reusemart_mobile/merchandise/berhasilKlaim.dart';
import 'package:reusemart_mobile/entity/Merchandise.dart';
import 'package:reusemart_mobile/client/AuthMerchandise.dart';

class DetailKlaim extends StatefulWidget {
  final int id;
  const DetailKlaim({super.key, required this.id});
  @override
  _DetailKlaimState createState() => _DetailKlaimState();
}

class _DetailKlaimState extends State<DetailKlaim> {
  late Future<Merchandise> _merchandise;

  @override
  void initState() {
    print("Loading Merch ID: ${widget.id}");

    super.initState();
    _merchandise = Authmerchandise.fetchDetailMerch(widget.id);
  }

  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF1F510F),
      appBar: AppBar(
        leading: IconButton(
          padding: EdgeInsets.only(top: 10, left: 20),
          icon: Icon(Icons.arrow_back_ios_new),
          iconSize: MediaQuery.of(context).size.height * 0.04,
          color: Color(0xFFF5CB58),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        backgroundColor: Color(0xFF1F510F),
        title: Container(
          margin: EdgeInsets.only(top: 10),
          child: Text('Detail Merchandise',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: Colors.white,
              )),
        ),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: FutureBuilder<Merchandise>(
            future: _merchandise,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              } else if (!snapshot.hasData) {
                return const Center(child: Text('Barang tidak ditemukan.'));
              }
              final merchandise = snapshot.data!;
              print(
                  "Detail fetched: ${merchandise.nama}, ID: ${merchandise.idMerchandise}");

              return Container(
                margin: EdgeInsets.only(top: 40),
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                  color: Color.fromARGB(255, 255, 255, 255),
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(50),
                    topRight: Radius.circular(50),
                  ),
                  border: Border.all(color: Color(0xFFe0e0e0)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      margin: EdgeInsets.only(top: 50, left: 20, right: 20),
                      width: MediaQuery.of(context).size.width > 600
                          ? MediaQuery.of(context).size.width * 0.6
                          : MediaQuery.of(context).size.width * 0.8,
                      height: MediaQuery.of(context).size.width > 600
                          ? MediaQuery.of(context).size.height * 0.50
                          : MediaQuery.of(context).size.height * 0.25,
                      decoration: BoxDecoration(
                        color: Color(0xFFF5CB58),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Image.network(
                          merchandise.foto,
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
                    Container(
                      margin: EdgeInsets.only(top: 20, left: 20, right: 20),
                      child: Text(
                        merchandise.nama,
                        style: TextStyle(
                            fontSize: MediaQuery.of(context).size.width > 600
                                ? MediaQuery.of(context).size.width * 0.03
                                : MediaQuery.of(context).size.width * 0.05,
                            fontWeight: FontWeight.bold,
                            color: Colors.black),
                      ),
                    ),
                    Container(
                      margin: MediaQuery.of(context).size.width > 600
                          ? EdgeInsets.only(top: 50, right: 650)
                          : EdgeInsets.only(
                              top: 50,
                            ),
                      child: Text(
                        '${merchandise.poin.toStringAsFixed(0)} Poin',
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width > 600
                              ? MediaQuery.of(context).size.width * 0.03
                              : MediaQuery.of(context).size.width * 0.05,
                          color: Color(0xFF1F510F),
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.left,
                      ),
                    ),
                    Divider(
                      color: Color(0xFFF5CB58),
                      thickness: 2,
                      indent: 50,
                      endIndent: 50,
                    ),
                    Container(
                      margin: MediaQuery.of(context).size.width > 600
                          ? EdgeInsets.only(top: 5, right: 675)
                          : EdgeInsets.only(top: 5, right: 220),
                      child: Text(
                        'Stok: ${merchandise.stok.toStringAsFixed(0)}',
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width > 600
                              ? MediaQuery.of(context).size.width * 0.025
                              : MediaQuery.of(context).size.width * 0.04,
                          color: Colors.black,
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.left,
                      ),
                    ),
                    Container(
                      margin: MediaQuery.of(context).size.width > 600
                          ? EdgeInsets.only(
                              top: 5,
                            )
                          : EdgeInsets.only(
                              top: 5,
                            ),
                      child: Text(
                        merchandise.deskripsi,
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width > 600
                              ? MediaQuery.of(context).size.width * 0.025
                              : MediaQuery.of(context).size.width * 0.04,
                          color: Colors.black,
                        ),
                        textAlign: TextAlign.left,
                      ),
                    ),
                    SizedBox(
                      height: MediaQuery.of(context).size.height * 0.22,
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF1F510F),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: EdgeInsets.symmetric(
                            horizontal: MediaQuery.of(context).size.width * 0.2,
                            vertical: MediaQuery.of(context).size.width > 600
                                ? MediaQuery.of(context).size.width * 0.012
                                : MediaQuery.of(context).size.height * 0.01),
                      ),
                      onPressed: () async {
                        await Authmerchandise.claimMerchandise(
                            context, merchandise.idMerchandise);

                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProfilePembeli(),
                          ),
                        );
                      },
                      child: Text(
                        'Redeem',
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width > 600
                              ? MediaQuery.of(context).size.width * 0.03
                              : MediaQuery.of(context).size.width * 0.05,
                          color: Color.fromARGB(255, 255, 255, 255),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 100,
                    ),
                  ],
                ),
              );
            }),
      ),
    );
  }
}
