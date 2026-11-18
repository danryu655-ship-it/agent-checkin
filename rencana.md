# Rencana — Agent ID Hackathon (Binance Wallet x BNB Chain)

Dibuat: 18 Nov 2026 ~19:05 WIB | Submit paling lambat: **9 Des 2026 15:00 WIB**
Sumber aturan: https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf

## 1. Lomba ini buat apa

Binance Wallet + BNB Chain mau ekosistem Agent ID ramai dipakai. Mereka membayar
developer yang membangun dApp nyata di BNB Chain yang memakai Agent ID (nama
on-chain `nama.ai` untuk Agentic Wallet) — untuk akses, pembayaran, atau identitas.

- Total hadiah **60.000 USDC**: Project Award 29.000 (top 10 by data on-chain:
  jumlah alamat Agent ID yang berinteraksi, volume, jumlah transaksi) +
  Innovation Award 29.000 (dinilai juri; syarat produk live + **minimal 30 alamat
  Agent ID berinteraksi selama periode submit**) + Community Promotion 2.000
  (20 pemenang posting X — jalur ini TERTUTUP buat kita karena X @Danryu665
  suspended permanen).
- Pemenang 2 kategori utama juga dapat 1 slot klaim Agent ID 2 digit.
- Periode submit: 18 Nov 15:00 WIB – 9 Des 15:00 WIB. Review internal 9–17 Des,
  review publik 17–20 Des, hadiah dibayar ≤14 hari kerja setelah pengumuman.
- Satu tim hanya boleh submit SATU proyek.

## 2. Konsep yang dibangun — AgentCheckin

**Check-in harian gratis untuk pemegang Agent ID, dapat Badge NFT.**

- `checkIn()` hanya bisa dipanggil wallet yang memegang Agent ID (cek
  `balanceOf` di registry 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F > 0) —
  ini pemakaian Agent ID sebagai **access control + identitas**.
- Check-in pertama mint Badge NFT (ERC-721). Check-in harian menaikkan streak;
  streak 7 hari → tier naik, streak 30 hari → tier tertinggi. Badge menampilkan
  nama Agent ID pemiliknya.
- Gratis kecuali gas (user bayar gasnya sendiri). Tidak ada janji return,
  tidak ada token, tidak ada pembayaran — jadi tidak kena garis merah soal
  "passive income" / janji keuntungan.
- Frontend: GitHub Pages (gratis). Connect wallet → cek Agent ID → tombol
  check-in → lihat streak + badge + leaderboard streak.

Kenapa konsep ini (bukan integrasi ke Glowmoth/Sekolah/Bitconda):
- Paling kecil dan paling cepat jadi (1 kontrak + 1 halaman web).
- Alasan paling jelas buat pemegang Agent ID lain untuk mencoba: gratis,
  harian, kolektibel — persis crowd yang sudah berburu free mint Agent ID.
- Glowmoth/Sekolah audiensnya bukan pemegang Agent ID; Bitconda kontraknya
  sudah ter-deploy dan tidak bisa diubah begitu saja.

## 3. Garis merah keamanan (pelanggaran = diskualifikasi langsung)

- TIDAK ada login QR web / pairing code pihak ketiga; TIDAK menyimpan sesi login
  user di server. (Kita tidak punya server sama sekali — frontend statis.)
- Setiap operasi aset harus dikonfirmasi user sendiri di wallet-nya.
- TIDAK ada transfer tanpa izin, TIDAK ada approval unlimited yang disembunyikan.
- Kontrak open-source, owner permission diumumkan dengan jelas.
- TIDAK memakai nama "Binance"/"BNB" untuk meniru brand resmi.
- TIDAK mengumpulkan seed phrase / private key / API secret / pairing code.
- TIDAK menjanjikan return ("passive income" dilarang).
- Agent ID TIDAK dipakai sebagai alat "lookup wallet orang lain".
- TIDAK ada manipulasi volume / pendaftaran akun massal — 30 user harus asli.

## 4. Arsitektur

- Kontrak (1 file, Solidity): `AgentCheckin.sol`
  - `checkIn()` — cek Agent ID via registry, 1x/hari, update streak, mint badge
    di check-in pertama, naikkan tier di streak 7 dan 30.
  - `streakOf(address)`, `badgeOf(address)`, `totalCheckins()` — view.
  - Owner hanya: `pause()` darurat + `setRegistry()` bila registry pindah
    (didokumentasikan di README + BscScan).
- Frontend (statis, GitHub Pages): connect wallet (Binance Wallet /
  WalletConnect), baca Agent ID + streak, tombol check-in, leaderboard.
- Repo: `danryu655-ship-it/agent-checkin` (publik, MIT).

## 5. Timeline (21 hari)

| Kapan | Apa |
|---|---|
| 18 Nov malam | Rencana ini + repo + tugas Aneko (kontrak). Aneko mulai 19 Nov pagi — malam ini dia backup make.fun (tenggat 01:00). |
| 19–20 Nov | Kontrak + test lokal (Aneko). Rias review. |
| 21 Nov | Deploy mainnet + verifikasi BscScan + open-source. Estimasi gas deploy kontrak kecil <0,0005 BNB — cek estimasi dulu; saldo wallet ~0,000955 BNB. Deploy HANYA dengan Gas user + preview bersih. |
| 22–25 Nov | Frontend + uji end-to-end (Rias + Miku desain). |
| 26 Nov | Produk live. Mulai promosi + pantau interaksi harian. |
| 26 Nov–9 Des | Promosi + iterasi. Target: ≥30 alamat Agent ID berinteraksi. |
| 9 Des 12:00 WIB | Submit (buffer 3 jam sebelum tenggat 15:00). |

## 6. Pembagian kerja

- **Aneko** — kontrak Solidity + test + script deploy + verifikasi BscScan.
  (Mulai 19 Nov pagi, setelah tugas backup make.fun malam ini selesai.)
- **Miku** — desain frontend (tampilan check-in, badge, leaderboard).
- **Rias** — koordinasi, review kontrak, deploy (dengan Gas user), submit,
  pantau interaksi harian, promosi.
- **Mia** — TIDAK terlibat (fokus make.fun + sosial Nihongo Santai).

## 7. 30 Agent ID dari mana? (risiko TERBESAR — bukan kode)

Fakta: 30 user harus 30 wallet BERBEDA yang memegang Agent ID dan memanggil
kontrak kita antara 18 Nov–9 Des. Kita baru punya 1 (wallet user sendiri).
Tidak ada jalan pintas — interaksi palsu / akun massal = diskualifikasi.

Jalur yang ada:
1. **Komunitas pemburu Agent ID di Telegram** (Airdrop Finder, Goedang Duit
   Reborn) — ribuan pemburu Agent ID berkumpul di sana. MASALAH: itu channel
   broadcast (hanya admin yang bisa posting), bukan grup diskusi. Perlu dicari
   jalur posting yang sah: grup diskusi terkait, atau minta admin membagikan.
2. **Sosial kita sendiri** (IG/Threads/FB Nihongo Santai) — audiensnya pelajar
   bahasa Jepang, bukan pemegang Agent ID. Kecil kemungkinannya, tapi gratis
   dicoba.
3. **X — TERTUTUP** (akun @Danryu665 suspended permanen, tidak bisa posting).
4. **Dari mulut ke mulut di komunitas agent/make.fun** — belum ada jalur yang
   pasti.

Rencana mitigasi:
- Produknya harus gratis + langsung memberi sesuatu (badge) supaya orang mau
  coba tanpa pikir panjang.
- Setiap hari pantau jumlah alamat Agent ID yang berinteraksi; kalau sampai
  30 Nov masih <10, evaluasi ulang (tetap submit apa adanya — submit tidak
  ada ruginya selain gas deploy yang sudah keluar).
- JANGAN PERNAH membeli/membuat interaksi palsu.

## 8. Biaya

- Deploy kontrak: gas saja (estimasi <0,0005 BNB untuk kontrak kecil —
  diverifikasi sebelum deploy). Frontend: Rp0 (GitHub Pages). Submit: Rp0.
- TIDAK ada biaya lain. Tidak ada top-up, tidak ada paid service.

## 9. Kriteria sukses

- Kontrak live + terverifikasi + open-source di BscScan.
- Frontend live, check-in end-to-end jalan dari wallet biasa.
- ≥30 alamat Agent ID berinteraksi selama periode submit.
- Submit terkirim sebelum 9 Des 12:00 WIB.
