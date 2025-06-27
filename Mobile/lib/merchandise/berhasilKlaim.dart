import 'package:flutter/material.dart';
import 'package:reusemart_mobile/homepage/mainMenu.dart';
import 'package:reusemart_mobile/homepage/profilePenitip.dart';

class BerhasilKlaim extends StatefulWidget {
  const BerhasilKlaim({super.key});

  @override
  _BerhasilKlaimState createState() => _BerhasilKlaimState();
}

class _BerhasilKlaimState extends State<BerhasilKlaim> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            margin: EdgeInsets.only(top: 300),
            child: Text(
              'Berhasil Klaim Merchandise',
              style: TextStyle(fontSize: 38, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ),
          Container(
            margin: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: Text(
              'Terima kasih telah melakukan klaim merchandise. Silakan ambil barang di kantor ReUseMart.',
              style: TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
          ),
          Container(
            margin: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => Mainmenu()),
                    (Route<dynamic> route) => false,
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF76C78E),
                  padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                ),
                child: Text(
                  'Kembali ke Profile',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
