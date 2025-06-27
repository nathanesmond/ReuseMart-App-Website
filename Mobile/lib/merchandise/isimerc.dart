import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/AuthMerchandise.dart';
import 'package:reusemart_mobile/homepage/mainMenu.dart';
import 'package:reusemart_mobile/merchandise/detailKlaim.dart';
import 'package:reusemart_mobile/entity/Merchandise.dart';

class katalogmerchandise extends StatefulWidget {
  const katalogmerchandise({super.key});

  @override
  _katalogmerchandiseState createState() => _katalogmerchandiseState();
}

class _katalogmerchandiseState extends State<katalogmerchandise> {
  late Future<List<Merchandise>> _merchandise;
  List<Merchandise> merchandiseList = [];

  @override
  void initState() {
    super.initState();
    _merchandise = Authmerchandise.getMerchandise();
  }

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
          child: Text('Merchandise',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 25,
                color: Colors.white,
              )),
        ),
        elevation: 0,
      ),
      body: Expanded(
        child: SingleChildScrollView(
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
                      border: Border.all(color: Color(0xFFe0e0e0))),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Cari Merchandise',
                      hintStyle:
                          TextStyle(color: Color(0xFFBDBDBD), fontSize: 15),
                      prefixIcon: Icon(Icons.search, color: Color(0xFFBDBDBD)),
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      contentPadding: EdgeInsets.all(10),
                    ),
                  ),
                ),
                FutureBuilder<List<Merchandise>>(
                    future: Authmerchandise.getMerchandise(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return Center(child: CircularProgressIndicator());
                      } else if (snapshot.hasError) {
                        return Center(child: Text('Error: ${snapshot.error}'));
                      } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                        return Center(
                            child: Text('Tidak ada barang tersedia.'));
                      }
                      final merchList = snapshot.data!;

                      return SizedBox(
                        height: MediaQuery.of(context).size.width > 600
                            ? MediaQuery.of(context).size.height * 0.6
                            : MediaQuery.of(context).size.height * 0.78,
                        child: GridView.builder(
                          physics: AlwaysScrollableScrollPhysics(),
                          shrinkWrap: true,
                          gridDelegate:
                              SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount:
                                MediaQuery.of(context).size.width > 600 ? 4 : 2,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 20,
                            childAspectRatio: 0.9,
                          ),
                          itemCount: merchList.length,
                          itemBuilder: (context, index) {
                            final merchandise = merchList[index];
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ElevatedButton(
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => DetailKlaim(
                                            id: merchandise.idMerchandise),
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.transparent,
                                    shadowColor: Colors.transparent,
                                    padding: EdgeInsets.all(0),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                  ),
                                  child: Container(
                                      height: 150,
                                      width: 150,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[300],
                                        borderRadius: BorderRadius.circular(10),
                                        image: DecorationImage(
                                          image: NetworkImage(merchandise.foto),
                                          fit: BoxFit.cover,
                                        ),
                                      )),
                                ),
                                Container(
                                  margin: EdgeInsets.only(top: 10),
                                  child: Text(
                                    merchandise.nama,
                                    style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.only(top: 3),
                                  child: Text(
                                      '${merchandise.poin.toStringAsFixed(0)}'),
                                ),
                              ],
                            );
                          },
                        ),
                      );
                    }),
                SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
