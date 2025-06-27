import 'package:flutter/material.dart';
import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';
import 'package:reusemart_mobile/HunterPage/HunterHome.dart';
import 'package:reusemart_mobile/HunterPage/ProfileHunter.dart';
import 'package:reusemart_mobile/KurirPage/ProfileKurir.dart';
import 'package:reusemart_mobile/homepage/home.dart';
import 'package:reusemart_mobile/homepage/mainMenu.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;

const AndroidNotificationChannel channel = AndroidNotificationChannel(
  'reusemart_channel',
  'ReUseMart Notifications',
  description: 'Channel for ReUseMart notifications',
  importance: Importance.high,
);

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool _isHidden = true;
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  void _toggleVisibility() {
    setState(() {
      _isHidden = !_isHidden;
    });
  }

  @override
  void initState() {
    super.initState();
    _emailController.text = '';
    _passwordController.text = '';
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        var response = await AuthClient.login(
            _emailController.text, _passwordController.text);
        if (response.statusCode == 200) {
          var data = jsonDecode(response.body);
          final user = data['user'];
          String role = data['role'];
          int? id;

          if (role == 'Penitip') {
            id = user['id_penitip'];
          } else if (role == 'Kurir' || role == 'Hunter') {
            id = user['id_pegawai'];
          } else if (role == 'Pembeli') {
            id = user['id_pembeli'];
          }
          data['id'] = id;

          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', data['token']);
          await prefs.setString('role', data['role']);
          await prefs.setInt('id', data['id']);

          FirebaseMessaging messaging = FirebaseMessaging.instance;
          String? fcmToken = await messaging.getToken();
          print("FCM Token: $fcmToken");
          print(
              "Updating FCM token for user ID: ${data['id']} and role: ${data['role']}");

          await http
              .post(
            Uri.parse('http://10.0.2.2:8000/api/update-fcm-token'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ${data['token']}',
            },
            body: jsonEncode({
              'id': data['id'],
              'user_type': data['role'],
              'fcm_token': fcmToken,
            }),
          )
              .then((response) {
            print(response.statusCode);
            if (response.statusCode == 200) {
              print("FCM token updated successfully");
            } else {
              print("Response body: ${response.body}");
            }
          }).catchError((error) {
            print("Error updating FCM token: $error");
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: AwesomeSnackbarContent(
                title: 'Success',
                message: 'Login Successful',
                contentType: ContentType.success,
              ),
              duration: Duration(seconds: 2),
              elevation: 0,
              behavior: SnackBarBehavior.floating,
              backgroundColor: Colors.transparent,
            ),
          );

          if (data['role'] == 'Pembeli') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => Mainmenu()),
            );
          } else if (data['role'] == 'Kurir') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => Mainmenu()),
            );
          } else if (data['role'] == 'Hunter') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => Profilehunter(id: id!)),
            );
          } else if (data['role'] == 'Penitip') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => Mainmenu()),
            );
          }
        }else{
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: AwesomeSnackbarContent(
                title: 'Login Failed',
                message: 'Email or Password is incorrect',
                contentType: ContentType.failure,
              ),
              duration: Duration(seconds: 2),
              elevation: 0,
              behavior: SnackBarBehavior.floating,
              backgroundColor: Colors.transparent,
            ),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: AwesomeSnackbarContent(
              title: 'Error',
              message: 'Login Failed: $e',
              contentType: ContentType.failure,
            ),
            duration: Duration(seconds: 2),
            elevation: 0,
            behavior: SnackBarBehavior.floating,
            backgroundColor: Colors.transparent,
          ),
        );
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  Container(
                    margin: MediaQuery.of(context).size.height > 600
                        ? EdgeInsets.only(top: 230)
                        : EdgeInsets.only(top: 50),
                    child: Text('Welcome Back!',
                        style: TextStyle(
                            fontSize: 36, fontWeight: FontWeight.w900)),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 50, left: 25, right: 25),
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                        border: Border.all(color: Color(0xFA8A8A95))),
                    child: TextFormField(
                      controller: _emailController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Email tidak boleh kosong';
                        }
                        if (!value.contains('@')) return 'Email tidak valid';
                        return null;
                      },
                      style: TextStyle(color: Color(0xFF8D92A3), fontSize: 15),
                      decoration: InputDecoration(
                        hintText: 'Email',
                        hintStyle:
                            TextStyle(color: Color(0xFF8D92A3), fontSize: 15),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        contentPadding: EdgeInsets.all(15),
                        prefixIcon: Icon(
                          Icons.person,
                          color: Color(0xFF8D92A3),
                        ),
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 35, left: 25, right: 25),
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                        border: Border.all(color: Color(0xFA8A8A95))),
                    child: TextFormField(
                      controller: _passwordController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Password tidak boleh kosong';
                        }
                        return null;
                      },
                      obscureText: _isHidden,
                      style: TextStyle(color: Color(0xFF8D92A3), fontSize: 15),
                      decoration: InputDecoration(
                          hintText: 'Password',
                          hintStyle:
                              TextStyle(color: Color(0xFF8D92A3), fontSize: 15),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: EdgeInsets.all(15),
                          prefixIcon: Icon(
                            Icons.lock,
                            color: Color(0xFF8D92A3),
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isHidden
                                  ? Icons.visibility_off
                                  : Icons.visibility,
                              color: Color(0xFF8D92A3),
                            ),
                            onPressed: _toggleVisibility,
                          )),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 10, right: 25),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => Mainmenu()),
                            );
                          },
                          child: Text('Lupa Password?',
                              style: TextStyle(
                                  color: Color.fromARGB(255, 255, 41, 77),
                                  fontSize: 12)),
                        )
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  Container(
                    height: MediaQuery.sizeOf(context).height > 600
                        ? MediaQuery.sizeOf(context).height * 0.05
                        : MediaQuery.sizeOf(context).height * 0.1,
                    decoration: BoxDecoration(
                      color: Color(0xFF1F510F),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: ElevatedButton(
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          _login();
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: AwesomeSnackbarContent(
                                title: 'Warning',
                                message: 'Please fill all the fields',
                                contentType: ContentType.warning,
                              ),
                              duration: Duration(seconds: 2),
                              elevation: 0,
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: Colors.transparent,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        padding: MediaQuery.of(context).size.height > 600
                            ? EdgeInsets.only(left: 130, right: 130)
                            : EdgeInsets.only(
                                left: 350,
                                right: 350,
                              ),
                      ),
                      child: Text('Login',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                  SizedBox(
                    height: 50,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
