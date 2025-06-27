import 'package:flutter/material.dart';
import 'package:reusemart_mobile/auth/login.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/AuthPembeli.dart';
import 'package:reusemart_mobile/entity/Pembeli.dart';
import 'package:reusemart_mobile/merchandise/isimerc.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePembeli extends StatefulWidget {
  const ProfilePembeli({super.key});

  @override
  _ProfilePembeliState createState() => _ProfilePembeliState();
}

class _ProfilePembeliState extends State<ProfilePembeli> {
  Future<void> _logout() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      print("Token: $token");
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

  late Future<Pembeli> _currentUser;

  @override
  void initState() {
    super.initState();
    _currentUser = AuthPembeli.fetchCurrentUser();
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
      body: FutureBuilder<Pembeli>(
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
              margin: EdgeInsets.only(top: 40, left: 20, right: 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: EdgeInsets.only(top: 10, left: 20, right: 30),
                        child: CircleAvatar(
                          radius: 50,
                          backgroundImage: user.foto.isNotEmpty
                              ? NetworkImage(user.foto)
                              : AssetImage('images/cin.png'),
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 40),
                        child: Text(
                          user.nama,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 40, left: 20),
                    child: Text(
                      'Deskripsi',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 10, left: 20, right: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Email :',
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        Text(
                          user.email,
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
                  Container(
                    margin: EdgeInsets.only(
                        top: 10, left: 20, right: 20, bottom: 20),
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
                  Divider(
                    color: Color(0xFFF5CB58),
                    thickness: 1,
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 15, left: 20),
                    child: Text(
                      'Klaim Merchandise',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 15, left: 20),
                    child: Text(
                      'Tukarkan poin dengan merchandise',
                      style: TextStyle(
                        fontSize: 15,
                      ),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => katalogmerchandise(),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF1F510F),
                          minimumSize: Size(25, 30),
                        ),
                        child: Text('Tukar',
                            style:
                                TextStyle(fontSize: 15, color: Colors.white)),
                      ),
                    ],
                  ),
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
