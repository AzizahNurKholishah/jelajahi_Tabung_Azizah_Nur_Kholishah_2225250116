from app.config import Settings, get_settings
from app.main import app
from conftest import TOKEN, buat_event

HEADER = {"X-Peneliti-Token": TOKEN}


def isi_data(client) -> None:
    events = [
        # S01: L2-1 salah (MK1) lalu benar
        buat_event(kode_siswa="S01", soal="L2-1", benar=False, miskonsepsi="MK1", tingkat_petunjuk=0),
        buat_event(kode_siswa="S01", soal="L2-1", benar=True, miskonsepsi=None, tingkat_petunjuk=1),
        # S02: L2-1 benar langsung
        buat_event(kode_siswa="S02", soal="L2-1", benar=True, miskonsepsi=None, tingkat_petunjuk=0),
        # S02: L1-1 salah satuan (MK7)
        buat_event(kode_siswa="S02", soal="L1-1", benar=False, miskonsepsi="MK7", tingkat_petunjuk=2),
        # bukan jawaban arena → tidak masuk ringkasan per soal
        buat_event(kode_siswa="S02", layar="kenali-tabung", soal=None, aksi="selesai_modul", benar=None, miskonsepsi=None),
    ]
    assert client.post("/api/log/batch", json={"events": events}).status_code == 200


def test_tanpa_token_ditolak(client) -> None:
    for path in ["/api/peneliti/log", "/api/peneliti/ringkasan", "/api/peneliti/export.csv"]:
        assert client.get(path).status_code == 401
        assert client.get(path, headers={"X-Peneliti-Token": "salah"}).status_code == 401


def test_token_belum_diatur(client) -> None:
    app.dependency_overrides[get_settings] = lambda: Settings(peneliti_token="")
    assert client.get("/api/peneliti/ringkasan", headers=HEADER).status_code == 503


def test_ringkasan_per_soal(client) -> None:
    isi_data(client)
    data = client.get("/api/peneliti/ringkasan", headers=HEADER).json()
    assert data["jumlah_siswa"] == 2
    assert data["jumlah_event"] == 5

    per_soal = {s["soal"]: s for s in data["per_soal"]}
    assert set(per_soal) == {"L1-1", "L2-1"}
    l21 = per_soal["L2-1"]
    assert l21["jumlah_siswa"] == 2
    assert l21["percobaan"] == 3
    assert l21["persen_benar"] == 66.7
    assert l21["rata_petunjuk"] == 0.33
    assert l21["miskonsepsi"] == {"MK1": 1}
    assert per_soal["L1-1"]["miskonsepsi"] == {"MK7": 1}


def test_filter_kode_siswa(client) -> None:
    isi_data(client)
    log = client.get("/api/peneliti/log", params={"kode_siswa": "S01"}, headers=HEADER).json()
    assert len(log) == 2
    assert {e["kode_siswa"] for e in log} == {"S01"}


def test_ekspor_csv_untuk_excel(client) -> None:
    isi_data(client)
    res = client.get("/api/peneliti/export.csv", headers=HEADER)
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("text/csv")
    teks = res.content.decode("utf-8")
    assert teks.startswith("﻿")  # BOM agar Excel membaca UTF-8
    baris = teks.lstrip("﻿").strip().splitlines()
    assert baris[0].split(";")[:3] == ["id", "kode_siswa", "kode_kelas"]
    assert len(baris) == 1 + 5
