import 'package:flutter/material.dart';
import 'package:reusemart_mobile/auth/login.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/AuthPenitip.dart';
import 'package:reusemart_mobile/entity/Penitip.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePenitip extends StatefulWidget {
  const ProfilePenitip({super.key});

  @override
  _ProfilePenitipState createState() => _ProfilePenitipState();
}

class _ProfilePenitipState extends State<ProfilePenitip> {
  late Future<Map<String, dynamic>> _getBonusTopSellers;
  late Future<Penitip> _currentUser;
  @override
  void initState() {
    super.initState();
    _currentUser = AuthPenitip.fetchCurrentUser();
    _getBonusTopSellers = AuthPenitip.bonusTopSeller();
  }

  Future<void> _logout() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');

      await AuthClient.logout(token!);

      await prefs.remove('token');

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const Login()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Terjadi kesalahan saat logout: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        title: Center(
          child: Text('        Profile',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 25,
              )),
        ),
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {
              _logout();
            },
            icon: Icon(Icons.logout),
            color: Colors.black,
          )
        ],
      ),
      body: FutureBuilder<Penitip>(
        future: _currentUser,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Terjadi kesalahan: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('Data pengguna tidak ditemukan.'));
          }

          final user = snapshot.data!;
          return SingleChildScrollView(
            child: Container(
              margin: EdgeInsets.only(top: 20, left: 20, right: 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: EdgeInsets.only(top: 40),
                    alignment: Alignment.center,
                    child: Text(
                      user.nama,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 20, left: 20, right: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Rating : ',
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        Row(
                          children: [
                            for (int i = 1; i <= 5; i++)
                              Icon(
                                i <= (user.total_rating ?? 0).floor()
                                    ? Icons.star
                                    : ((i - (user.total_rating ?? 0)) == 0.5
                                        ? Icons.star_half
                                        : Icons.star_border),
                                color: Colors.amber,
                                size: 20,
                              ),
                            SizedBox(width: 6),
                            Text(
                              user.total_rating?.toStringAsFixed(0) ?? '0',
                              style: TextStyle(
                                fontSize: 15,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 10, left: 20, right: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Telepon : ',
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        Text(
                          user.telepon,
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 10, left: 20, right: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Wallet : ',
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        Text(
                          user.wallet.toStringAsFixed(0),
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(
                        top: 10, left: 20, right: 20, bottom: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Poin yang dimiliki :',
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        Text(
                          user.poin.toString(),
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Divider(
                    color: Color(0xFFF5CB58),
                    thickness: 1,
                  ),
                  user.badges
                      ? FutureBuilder<Map<String, dynamic>>(
                          future: _getBonusTopSellers,
                          builder: (context, snapshot) {
                            if (snapshot.connectionState ==
                                ConnectionState.waiting) {
                              return Center(child: CircularProgressIndicator());
                            } else if (snapshot.hasError) {
                              return Center(
                                  child: Text(
                                      'Terjadi kesalahan: ${snapshot.error}'));
                            } else if (!snapshot.hasData ||
                                snapshot.data!.isEmpty) {
                              return Container(
                                margin: EdgeInsets.only(top: 20, left: 20),
                                child: Text(
                                  'Tidak ada Top Seller untuk User ini.',
                                  style: TextStyle(fontSize: 15),
                                ),
                              );
                            }
                            final topSellers = snapshot.data!;
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  margin: EdgeInsets.only(top: 15, left: 20),
                                  width: double.infinity,
                                  height: 60,
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    color: Color(0xFFFEFFB1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  padding: EdgeInsets.symmetric(
                                      vertical: 8, horizontal: 16),
                                  child: Text(
                                    'Top Seller',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.only(top: 20, left: 20),
                                  child: Text(
                                    'Keuntungan',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    textAlign: TextAlign.left,
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsets.only(
                                      left: 20, right: 20, top: 5),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Diskon Komisi Sebesar : ',
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                      Text(
                                        "1%",
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsets.only(
                                      left: 20, right: 20, top: 5),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Total Penjualan : ',
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                      Text(
                                        "Rp ${topSellers['total_penjualan']?.toStringAsFixed(0) ?? '0'}",
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsets.only(
                                      left: 20, right: 20, top: 5),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Bonus Keuntungan : ',
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                      Text(
                                        "Rp ${topSellers['bonus_badges']?.toStringAsFixed(0) ?? '0'}",
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsets.only(
                                      left: 20, right: 20, top: 5),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Total Keuntungan : ',
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                      Text(
                                        "Rp ${topSellers['total_keuntungan']?.toStringAsFixed(0) ?? '0'}",
                                        style: TextStyle(
                                          fontSize: 15,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            );
                          },
                        )
                      : SizedBox.shrink(),
                  Divider(
                    color: Color(0xFFF5CB58),
                    thickness: 1,
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 15, left: 20),
                    child: Text(
                      'Informasi Akun',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 15, left: 20),
                    child: Text(
                      'Nonaktifkan Akun',
                      style: TextStyle(
                        fontSize: 15,
                      ),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF9A282A),
                          minimumSize: Size(25, 30),
                        ),
                        child: Text('Nonaktif',
                            style:
                                TextStyle(fontSize: 15, color: Colors.white)),
                      ),
                    ],
                  ),
                  Divider(
                    color: Color(0xFFF5CB58),
                    thickness: 1,
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
