<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penitip;
use App\Models\Barang;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PenitipController extends Controller
{

    public function addPenitip(Request $request)
    {
        try {
            $request->validate(
                [
                    'nama' => 'required|string|max:255',
                    'telepon' => 'required|string',
                    'email' => 'required|string|email|max:255|unique:penitip,email',
                    'foto_ktp' => 'required|image|max:2048',
                    'no_ktp' => 'required|string|unique:penitip,no_ktp',
                    'password' => 'required|string',
                ],
                [
                    'email.required' => 'Email is required',
                    'email.email' => 'Email must be a valid email address',
                    'email.max' => 'Email must not exceed 255 characters',
                    'foto_ktp.max' => 'Picture must not exceed 2 mb',
                    'foto_ktp.image' => 'Picture must be an image',
                    'foto_ktp.mimes' => 'Picture must be a file of type: jpeg, png, jpg, gif, svg',
                    'nama.required' => 'Name is required',
                    'telepon.required' => 'Phone number is required',
                    'no_ktp.required' => 'KTP number is required',
                    'no_ktp.unique' => 'KTP number must be unique',
                ]
            );

            if ($request->hasFile('foto_ktp')) {
                $foto = $request->file('foto_ktp');
                $fotoPath = $foto->store('images/penitip', 'public');
            }
            \Log::info('no_ktp from request:', ['no_ktp' => $request->no_ktp]);

            $penitip = Penitip::create([
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'no_ktp' => $request->no_ktp,
                'foto_ktp' => isset($fotoPath) ? $fotoPath : null,
            ]);
            return response()->json([
                'message' => 'Data added successfully',
                'penitip' => $penitip,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->validator->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to add data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function fetchPenitipByLogin(Request $request)
    {
        try {
            $penitip = Auth::guard('penitip')->user();
            return response()->json([
                'penitip' => $penitip,
                'message' => 'Data retrieved successfully',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchPenitip(Request $request)
    {
        try {
            $penitip = Penitip::all();
            ;
            return response()->json([
                'penitip' => $penitip,
                'message' => 'Data retrieved successfully',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function updatePenitip(Request $request, $id_penitip)
    {
        try {
            $penitip = Penitip::findOrFail($id_penitip);

            $request->validate(
                [
                    'nama' => 'required|string|max:255',
                    'telepon' => 'required|string',
                    'email' => 'required|string|email|max:255|unique:penitip,email,' . $id_penitip . ',id_penitip',
                    'foto_ktp' => 'nullable|image|max:2048',
                    'no_ktp' => 'required|string|unique:penitip,no_ktp,' . $id_penitip . ',id_penitip',
                    'password' => 'nullable|string',
                ],
                [
                    'email.required' => 'Email is required',
                    'email.email' => 'Email must be a valid email address',
                    'email.max' => 'Email must not exceed 255 characters',
                    'foto_ktp.max' => 'Picture must not exceed 2 mb',
                    'foto_ktp.image' => 'Picture must be an image',
                    'foto_ktp.mimes' => 'Picture must be a file of type: jpeg, png, jpg, gif, svg',
                    'nama.required' => 'Name is required',
                    'telepon.required' => 'Phone number is required',
                    'no_ktp.required' => 'KTP number is required',
                    'no_ktp.unique' => 'KTP number must be unique',
                ]
            );

            if ($request->password == NULL) {
                $request->password = $penitip->password;
            }
            $cekEmail = Penitip::where('email', $request->email)->where('id_penitip', '!=', $id_penitip)->exists() ||
                DB::table('pembeli')->where('email', $request->email)->exists() ||
                DB::table('organisasi')->where('email', $request->email)->exists();

            if ($cekEmail) {
                return response()->json([
                    'message' => 'Email already exists',
                ], 400);
            }
            if ($request->hasFile('foto_ktp')) {
                if ($penitip->foto_ktp) {
                    Storage::disk('public')->delete($penitip->foto_ktp);
                }
                $foto = $request->file('foto_ktp');
                $fotoPath = $foto->store('images/penitip', 'public');
            }

            $penitip->update([
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'no_ktp' => $request->no_ktp,
                'foto_ktp' => asset($fotoPath) ? $fotoPath : $penitip->foto_ktp,
            ]);
            return response()->json([
                'message' => 'Data updated successfully',
                'penitip' => $penitip,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->validator->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deletePenitip($id_penitip)
    {
        try {
            $penitip = Penitip::findOrFail($id_penitip);
            if ($penitip->foto_ktp) {
                Storage::disk('public')->delete($penitip->foto_ktp);
            }
            $penitip->delete();
            return response()->json([
                'message' => 'Data deleted successfully',
            ], 200);
        } catch (Exception $e) {
            \Log::error("Failed to delete penitip: " . $e->getMessage());

            return response()->json([
                'message' => 'Failed to delete data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchHistoryTransaksi()
    {
        try {

            $penitip = Auth::guard('penitip')->user();

            $idPenitip = $penitip->id_penitip;

            $data = DB::table('pembelian')
                ->join('keranjang', 'pembelian.id_keranjang', '=', 'keranjang.id_keranjang')
                ->join('detail_keranjang', 'keranjang.id_keranjang', '=', 'detail_keranjang.id_keranjang')
                ->join('barang', 'detail_keranjang.id_barang', '=', 'barang.id_barang')
                ->join('komisi', 'barang.id_barang', '=', 'komisi.id_barang')
                ->join('penitipan', 'barang.id_penitipan', '=', 'penitipan.id_penitipan')
                ->join('penitip', 'penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('penitip.id_penitip', $idPenitip)
                ->select(
                    'barang.id_barang as id_barang',
                    'penitip.nama as nama_penitip',
                    'barang.nama as nama_barang',
                    'pembelian.tanggal_lunas',
                    'barang.harga as harga',
                    'barang.foto as foto_barang',
                    'barang.status_barang as status_barang'

                )
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $data,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchHistoryTransaksiById($id_barang)
    {
        try {
            $penitip = Auth::guard('penitip')->user();
            $data = DB::table('pembelian')
                ->join('keranjang', 'pembelian.id_keranjang', '=', 'keranjang.id_keranjang')
                ->join('detail_keranjang', 'keranjang.id_keranjang', '=', 'detail_keranjang.id_keranjang')
                ->join('barang', 'detail_keranjang.id_barang', '=', 'barang.id_barang')
                ->join('komisi', 'barang.id_barang', '=', 'komisi.id_barang')
                ->join('penitipan', 'barang.id_penitipan', '=', 'penitipan.id_penitipan')
                ->join('penitip', 'penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('penitip.id_penitip', $penitip->id_penitip)
                ->where('barang.id_barang', $id_barang)
                ->select(
                    'barang.id_barang as id_barang',
                    'penitip.nama as nama_penitip',
                    'barang.nama as nama_barang',
                    'pembelian.tanggal_lunas',
                    'barang.harga as harga',
                    'barang.foto as foto_barang',
                    'barang.status_barang as status_barang',
                    'barang.deskripsi',
                    'barang.status_barang'
                )
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $data,
            ]);


        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchBarangbyPenitip()
    {
        try {
            $penitip = Auth::guard('penitip')->user();
            $idPenitip = $penitip->id_penitip;

            $today = Carbon::now()->toDateString();



            Barang::whereIn('status_barang', ['Tersedia', 'Belum Diambil'])
                ->whereDate('tanggal_akhir', '<', $today)
                ->update(['status_barang' => 'Belum Diambil']);

            Barang::whereNot('status_barang', 'didonasikan')
                ->whereDate('batas_ambil', '<', $today)
                ->update(['status_barang' => 'didonasikan']);

            $data = DB::table('barang')
                ->join('penitipan', 'barang.id_penitipan', '=', 'penitipan.id_penitipan')
                ->join('penitip', 'penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('penitip.id_penitip', $idPenitip)
                ->where('barang.status_barang', '!=', 'terjual')
                ->select(
                    'barang.id_barang as id_barang',
                    'barang.nama as nama_barang',
                    'barang.foto as foto_barang',
                    'barang.harga as harga',
                    'barang.status_perpanjangan as status_perpanjangan',

                    'barang.status_barang as status_barang',
                    'barang.tanggal_akhir as tanggal_akhir',
                    'barang.batas_ambil as batas_ambil'
                )
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $data,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchBarangPenitipById($id_barang)
    {
        try {
            $penitip = auth('penitip')->user();
            $today = Carbon::now()->toDateString();



            $data = DB::table('barang')
                ->join('penitipan', 'barang.id_penitipan', '=', 'penitipan.id_penitipan')
                ->join('penitip', 'penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('penitip.id_penitip', $penitip->id_penitip)
                ->where('barang.id_barang', $id_barang)
                ->select(
                    'barang.id_barang as id_barang',
                    'barang.nama as nama_barang',
                    'barang.foto as foto',
                    'barang.harga as harga',
                    'barang.status_barang as status_barang',
                    'barang.status_perpanjangan as status_perpanjangan',
                    'barang.tanggal_akhir as tanggal_akhir',
                    'barang.batas_ambil as batas_ambil',
                    'barang.deskripsi',
                    'penitip.wallet as wallet',

                )
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $data,
            ]);


        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function extendBarangPenitip(Request $request)
    {
        $detailTransaksi = Barang::where('id_barang', $request->id_barang)->first();

        if (!$detailTransaksi) {
            return response()->json([
                'message' => 'Detail Transaksi not found',
            ], 404);
        }

        $minussaldo = $detailTransaksi->harga * 0.05;
        $saldo = $detailTransaksi->penitip->wallet;

        if ($saldo < $minussaldo) {
            return response()->json([
                'message' => 'Saldo tidak mencukupi untuk perpanjangan',
            ], 400);
        }

        DB::table('penitip')
            ->where('id_penitip', $detailTransaksi->id_penitipan)
            ->update(['wallet' => $saldo - $minussaldo]);

        DB::table('barang')
            ->where('id_barang', $detailTransaksi->id_barang)
            ->update(['status_perpanjangan' => 2]);



        $tanggalAkhir = Carbon::parse($detailTransaksi->tanggal_akhir);

        if ($tanggalAkhir->toDateString() < Carbon::now()->toDateString()) {
            return response()->json([
                'message' => 'Barang sudah kadaluarsa',
            ], 400);
        }

        $tanggalBerakhirBaru = $tanggalAkhir->copy()->addDays(30);
        $batasPengambilanBaru = $tanggalBerakhirBaru->copy()->addDays(7);

        $detailTransaksi->update([
            'tanggal_akhir' => $tanggalBerakhirBaru,
            'batas_ambil' => $batasPengambilanBaru,
            'status_perpanjangan' => 1,
        ]);

        return response()->json([
            'message' => 'Perpanjangan berhasil',
        ], 200);
    }


    public function fetchPenitipandua()
    {
        try {
            $penitip = Auth::guard('penitip')->user();
            $idPenitip = $penitip->id_penitip;


            $data = DB::table('barang')
                ->join('penitipan', 'barang.id_penitipan', '=', 'penitipan.id_penitipan')
                ->join('penitip', 'penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('penitip.id_penitip', $idPenitip)
                ->where('barang.status_perpanjangan', '!=', 0)
                ->where('barang.status_perpanjangan', '!=', 2)
                ->select(
                    'barang.id_barang as id_barang',
                    'barang.nama as nama_barang',
                    'barang.status_perpanjangan as status_perpanjangan',
                    'penitipan.tanggal_masuk as tanggal_masuk',
                    'barang.tanggal_akhir as tanggal_akhir',
                )
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $data,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function fetchBarangPenitipByIdExtend($id_barang)
    {
        try {
            $penitip = auth('penitip')->user();
            $today = Carbon::now()->toDateString();



            $data = DB::table('barang')
                ->join('penitipan', 'barang.id_penitipan', '=', 'penitipan.id_penitipan')
                ->join('penitip', 'penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('penitip.id_penitip', $penitip->id_penitip)
                ->where('barang.id_barang', $id_barang)
                ->select(
                    'barang.id_barang as id_barang',
                    'barang.nama as nama_barang',
                    'barang.harga as harga',
                    'penitip.wallet as wallet',

                )
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $data,
            ]);


        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function extendBarangPenitipLagi(Request $request)
    {
        $detailTransaksi = Barang::where('id_barang', $request->id_barang)->first();

        if (!$detailTransaksi) {
            return response()->json([
                'message' => 'Detail Transaksi not found',
            ], 404);
        }

        $minussaldo = $detailTransaksi->harga * 0.05;
        $saldo = $detailTransaksi->penitip->wallet;

        if ($saldo < $minussaldo) {
            return response()->json([
                'message' => 'Saldo tidak mencukupi untuk perpanjangan',
            ], 400);
        }

        DB::table('penitip')
            ->where('id_penitip', $detailTransaksi->id_penitipan)
            ->update(['wallet' => $saldo - $minussaldo]);

        $tanggalAkhir = Carbon::parse($detailTransaksi->tanggal_akhir);

        if ($tanggalAkhir->toDateString() < Carbon::now()->toDateString()) {
            return response()->json([
                'message' => 'Barang sudah kadaluarsa',
            ], 400);
        }

        $tanggalBerakhirBaru = $tanggalAkhir->copy()->addDays(30);
        $batasPengambilanBaru = $tanggalBerakhirBaru->copy()->addDays(7);

        $detailTransaksi->update([
            'tanggal_akhir' => $tanggalBerakhirBaru,
            'batas_ambil' => $batasPengambilanBaru,
            'status_perpanjangan' => 1,
        ]);

        return response()->json([
            'message' => 'Perpanjangan berhasil',
        ], 200);
    }

    public function ambilBarangPenitip(Request $request)
    {
        $detailTransaksi = Barang::where('id_barang', $request->id_barang)->first();

        if (!$detailTransaksi) {
            return response()->json([
                'message' => 'Detail Transaksi not found',
            ], 404);
        }

        // Convert tanggal_akhir to Carbon instance 
        $tanggalAkhir = Carbon::parse($detailTransaksi->tanggal_akhir);

        if ($tanggalAkhir->toDateString() < Carbon::now()->toDateString()) {
            $detailTransaksi->update([
                'status_barang' => 'hangus',
            ]);
            return response()->json([
                'message' => 'Barang Sudah Hangus',
            ], 200);
        } else {

            $detailTransaksi->update([
                'status_barang' => 'Diambil Kembali',
            ]);

            return response()->json([
                'message' => 'Barang dalam masa pengambilan',
            ], 200);
        }
    }

    public function saveFcmToken(Request $request)
    {
        \Log::info('Request data:', $request->all()); // Debugging
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $penitip = Auth::guard('penitip')->user();
        if ($penitip) {
            $penitip->fcm_token = $request->fcm_token;
            $penitip->save();
            \Log::info('FCM token saved for penitip ID: ' . $penitip->id);
            return response()->json(['message' => 'FCM token saved']);
        }

        return response()->json(['message' => 'Penitip not found'], 404);

    }

    public function getTopSeller()
    {
        try {
            $bulan = Carbon::now()->subMonth()->month;
            $tahun = Carbon::now()->year;

            $getSebelumnya = Penitip::where('badges', true)->first();
            $initPenitip = Penitip::all();
            foreach ($initPenitip as $penitip) {
                $penitip->badges = false;
                $penitip->save();
            }

            $topSeller = DB::table('penitip')
                ->join('penitipan', 'penitip.id_penitip', '=', 'penitipan.id_penitip')
                ->join('barang', 'penitipan.id_penitipan', '=', 'barang.id_penitipan')
                ->join('detail_pembelian', 'barang.id_barang', '=', 'detail_pembelian.id_barang')
                ->join('pembelian', 'detail_pembelian.id_pembelian', '=', 'pembelian.id_pembelian')
                ->where('barang.status_barang', 'terjual')
                ->whereMonth('pembelian.tanggal_laku', $bulan)
                ->whereYear('pembelian.tanggal_laku', $tahun)
                ->when(request('order') === 'asc', function ($query) {
                    return $query->orderBy('total_penjualan', 'asc');
                })
                ->when(request('order') === 'desc', function ($query) {
                    return $query->orderBy('total_penjualan', 'desc');
                })
                ->select(
                    'penitip.id_penitip',
                    'penitip.nama',
                    DB::raw('SUM(barang.harga) as total_penjualan')
                )
                ->groupBy('penitip.id_penitip', 'penitip.nama')
                ->orderByDesc('total_penjualan')
                ->limit(1)
                ->get();

            if ($topSeller->isNotEmpty()) {
                $penitip = Penitip::find($topSeller[0]->id_penitip);
                $penitip->badges = true;
                if ($getSebelumnya->id_penitip != $topSeller[0]->id_penitip) {
                    $bonusBadges = 0.01 * $topSeller[0]->total_penjualan;
                    $penitip->poin += $bonusBadges;
                }
                $penitip->save();
            }

            return response()->json([
                'message' => 'Data retrieved successfully',
                'penitip' => $topSeller,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function benefitTopSeller()
    {
        try {
            $month = Carbon::now()->subMonth()->month;
            $year = Carbon::now()->year;

            $penitip = Penitip::where('badges', true)->first();
            $totalPenjualan = DB::table('penitip')
                ->join('penitipan', 'penitip.id_penitip', '=', 'penitipan.id_penitip')
                ->join('barang', 'penitipan.id_penitipan', '=', 'barang.id_penitipan')
                ->join('detail_pembelian', 'barang.id_barang', '=', 'detail_pembelian.id_barang')
                ->join('pembelian', 'detail_pembelian.id_pembelian', '=', 'pembelian.id_pembelian')
                ->leftJoin('komisi', function ($join) {
                    $join->on('barang.id_barang', '=', 'komisi.id_barang')
                        ->whereColumn('komisi.id_penitip', '=', 'penitip.id_penitip');
                })
                ->where('barang.status_barang', 'terjual')
                ->where('penitip.id_penitip', $penitip->id_penitip)
                ->whereMonth('pembelian.tanggal_laku', $month)
                ->whereYear('pembelian.tanggal_laku', $year)
                ->select(DB::raw('COALESCE(SUM(komisi.komisi_penitip), 0) as total_penjualan'))
                ->first();

            $bonusBadges = 0.01 * $totalPenjualan->total_penjualan;
            $penitip->poin += $bonusBadges;
            $penitip->save();
            $totalKeuntungan = $totalPenjualan->total_penjualan + $bonusBadges;
            return response()->json([
                'message' => 'Data retrieved successfully',
                'penitip' => $penitip,
                'total_penjualan' => $totalPenjualan->total_penjualan,
                'bonus_badges' => $bonusBadges,
                'total_keuntungan' => $totalKeuntungan,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
