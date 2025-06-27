<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Detail_donasi;
use App\Models\Request_donasi;
use App\Models\Barang;
use App\Models\Organisasi;
use App\Http\Controllers\Request_donasiController;
use App\Http\Controllers\OrganisasiController;
use App\Models\Penitipan;
use App\Models\Penitip;
use App\Http\Controllers\PenitipController;
use App\Http\Controllers\PenitipanController;
use Exception;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class Detail_donasiController extends Controller
{
    public function fetchRequest()
    {
        try {
            $request_donasi = Request_donasi::all();
            return response()->json([
                'status' => true,
                'message' => 'Data Request Donasi',
                'data' => $request_donasi
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengambil data request donasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_request' => 'required|integer',
            'id_barang' => 'required|integer',
            'tanggal_donasi' => 'required|date',
            'nama_penerima' => 'required|string'
        ], [
            'id_request.required' => 'ID Request is required',
            'id_barang.required' => 'ID Barang is required',
            'tanggal_donasi.required' => 'Tanggal Donasi is required',
            'nama_penerima.required' => 'Nama Penerima is required'
        ]);

        try {
            $barang = Barang::findOrFail($validatedData['id_barang']);
            $barang->status_barang = 'didonasikan';
            $barang->save();

            $request_donasi = Request_donasi::findOrFail($validatedData['id_request']);
            $request_donasi->status_terpenuhi = 1;
            $request_donasi->save();
            $poin_reward = (int) floor($barang->harga / 10000);

            $detail_donasi = Detail_donasi::create($validatedData);

            $detail_donasi->reward_sosial = $poin_reward;
            $detail_donasi->save();

            $penitipan = Penitipan::where('id_penitipan', $barang->id_penitipan)->first();
            $penitip = Penitip::where('id_penitip', $penitipan->id_penitip)->first();
            $penitip->poin = $penitip->poin + $poin_reward;
            $penitip->save();
            $this->sendNotificationToPenitip($barang, 'Donasi Barang Berhasil', "Barang '{$barang->nama}' Anda telah berhasil didonasikan. Anda mendapat {$poin_reward} poin. Terima kasih telah berbagi!");

            return response()->json([
                'status' => true,
                'message' => 'Detail Donasi created successfully',
                'data' => $detail_donasi
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal membuat detail donasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    private function sendNotificationToPenitip($barang, $title, $body)
    {
        $user = $barang->barangPenitipan?->penitipanPenitip;

        if ($user && $user->fcm_token) {
            $keyFile = config('firebase.projects.app.credentials.file');

            $scopes = ['https://www.googleapis.com/auth/firebase.messaging'];

            $credentials = new ServiceAccountCredentials($scopes, $keyFile);

            $token = $credentials->fetchAuthToken()['access_token'];

            $projectId = 'reusemart-a150d';

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ])->post("https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send", [
                        'message' => [
                            'token' => $user->fcm_token,
                            'notification' => [
                                'title' => $title,
                                'body' => $body,
                            ],
                        ],
                    ]);


        }
    }

    public function updateDonasi(Request $request, $id)
    {
        $validatedData = $request->validate([
            'tanggal_donasi' => 'required|date',
            'nama_penerima' => 'required|string',
        ], [
            'tanggal_donasi.required' => 'Tanggal Donasi is required',
            'nama_penerima.required' => 'Nama Penerima is required',
        ]);

        try {

            $detail_donasi = Detail_donasi::findOrFail($id);
            $detail_donasi->update($validatedData);

            return response()->json([
                'status' => true,
                'message' => 'Detail Donasi updated successfully',
                'data' => $detail_donasi
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal memperbarui detail donasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showOrganisasi()
    {
        try {
            $organisasi = Organisasi::all();
            return response()->json([
                'status' => true,
                'message' => 'Data Organisasi',
                'data' => $organisasi
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengambil data organisasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function historyDonasibyOrganisasi($id)
    {
        try {
            $detail_donasi = Detail_donasi::whereHas('dtDonasiReqDonasi', function ($query) use ($id) {
                $query->where('id_organisasi', $id);
            })->get();

            return response()->json([
                'status' => true,
                'message' => 'History Donasi by Organisasi',
                'data' => $detail_donasi
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengambil history donasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchDetailDonasi()
    {
        try {
            $detail_donasi = Detail_donasi::with('dtDonasiReqDonasi')->get();
            return response()->json([
                'status' => true,
                'message' => 'Data Detail Donasi',
                'data' => $detail_donasi
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengambil data detail donasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchBarangForDonasi()
    {
        try {
            $barang = Barang::where('tanggal_akhir', '<=', Carbon::now()->addDay())
                ->where('status_barang', '!=', 'terjual')->get();
            return response()->json([
                'status' => true,
                'message' => 'Data Barang',
                'data' => $barang
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengambil data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchAllBarang()
    {
        try {
            $barang = Barang::all();
            return response()->json([
                'status' => true,
                'message' => 'Data Barang',
                'data' => $barang
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengambil data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
