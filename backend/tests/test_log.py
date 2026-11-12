from conftest import TOKEN, buat_event


def kirim(client, events):
    return client.post("/api/log/batch", json={"events": events})


def test_batch_diterima(client) -> None:
    res = kirim(client, [buat_event(), buat_event(benar=True, miskonsepsi=None)])
    assert res.status_code == 200
    assert res.json() == {"diterima": 2, "duplikat": 0}


def test_kirim_ulang_tidak_menggandakan_data(client) -> None:
    """Aplikasi mengirim ulang antrean setelah koneksi putus: id yang sama harus dilewati."""
    events = [buat_event(), buat_event()]
    kirim(client, events)
    res = kirim(client, events + [buat_event()])
    assert res.json() == {"diterima": 1, "duplikat": 2}

    log = client.get("/api/peneliti/log", headers={"X-Peneliti-Token": TOKEN}).json()
    assert len(log) == 3


def test_id_ganda_dalam_satu_batch(client) -> None:
    e = buat_event()
    assert kirim(client, [e, e]).json() == {"diterima": 1, "duplikat": 1}


def test_kode_siswa_harus_kode_bukan_nama(client) -> None:
    for kode in ["Budi", "s01", "S1", "S0001", ""]:
        res = kirim(client, [buat_event(kode_siswa=kode)])
        assert res.status_code == 422, kode


def test_aksi_tidak_dikenal_ditolak(client) -> None:
    assert kirim(client, [buat_event(aksi="hapus_semua")]).status_code == 422


def test_tingkat_petunjuk_dibatasi(client) -> None:
    assert kirim(client, [buat_event(tingkat_petunjuk=5)]).status_code == 422


def test_batch_maksimal_200(client) -> None:
    assert kirim(client, [buat_event() for _ in range(201)]).status_code == 422
    assert kirim(client, [buat_event() for _ in range(200)]).status_code == 200


def test_batch_kosong(client) -> None:
    assert kirim(client, []).json() == {"diterima": 0, "duplikat": 0}
