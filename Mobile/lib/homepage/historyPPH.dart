import 'package:flutter/material.dart';

class HistoryPPH extends StatefulWidget {
  const HistoryPPH({super.key});

  @override
  _HistoryPPHState createState() => _HistoryPPHState();
}

class _HistoryPPHState extends State<HistoryPPH> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          title: Center(
            child: Text('History',
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
                ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: 5,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: EdgeInsets.only(bottom: 15, left: 20, right: 20),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                margin: EdgeInsets.only(right: 40),
                                child: Image.asset(
                                  "images/icon.png",
                                  width: 50,
                                  height: 50,
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    margin: EdgeInsets.only(bottom: 5),
                                    child: Text(
                                      "Tanggal",
                                      style: TextStyle(fontSize: 17),
                                    ),
                                  ),
                                  Container(
                                    margin: EdgeInsets.only(bottom: 5),
                                    child: Text(
                                      "Nama Barang",
                                      style: TextStyle(fontSize: 18),
                                    ),
                                  ),
                                  Text(
                                    "Harga",
                                    style: TextStyle(
                                        fontSize: 17,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            margin: EdgeInsets.only(top: 10),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                ElevatedButton(
                                  onPressed: () {},
                                  style: ElevatedButton.styleFrom(
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    minimumSize: Size(80, 30),
                                    backgroundColor: Color(0xFFFFDB85),
                                  ),
                                  child: Text("Detail",
                                      style: TextStyle(
                                          fontSize: 15,
                                          color: Colors.black,
                                          fontWeight: FontWeight.normal)),
                                ),
                              ],
                            ),
                          ),
                          Divider(
                            color: Color(0xFFD9D9D9),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ));
  }
}
