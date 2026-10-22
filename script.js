// Storage Key & Global Chart Instances
const PEKALONGAN_DATA_KEY = 'SIPEMAS_PEKALONGAN_DB_2026';
let chartKategoriRef = null;
let chartStatusRef = null;

// Keyword list untuk deteksi darurat (Logika Algoritma Manual)
const KATA_KUNCI_DARURAT = [
'darurat', 'kecelakaan', 'ambruk', 'kebakaran', 'parah', 'berbahaya',
'longsor', 'banjir', 'putus', 'patah', 'korban', 'luka', 'darah'
];

document.addEventListener('DOMContentLoaded', () => {
lucide.createIcons();
inisialisasiDataLocalStorage();
perbaruiStatistikDashboard();
muatDaftarPengaduanTerbaru();
});

// Setup Initial Dummy Data bila LocalStorage kosong
function inisialisasiDataLocalStorage() {
if (!localStorage.getItem(PEKALONGAN_DATA_KEY)) {
const dummyAwal = [
{
ticketId: "TKT-20261021-1001",
nama: "Budi Santoso",
nik: "3326111204980001",
kategori: "Infrastruktur & Jalan",
wilayah: "Kecamatan Pekalongan Barat",
judul: "Jalan Berlubang Parah Berpotensi Kecelakaan",
isi: "Di sepanjang Jalan Veteran terjadi kerusakan aspal dan lubang yang cukup dalam. Sangat membahayakan pengendara motor terutama di malam hari.",
foto: "",
tanggal: "2026-10-21 10:15",
status: "Diproses",
isDarurat: true,
catatanSistem: "Kategori Darurat: Terdeteksi kata kunci resiko keselamatan jalan raya.",
tanggapan: "Dinas Pekerjaan Umum telah menjadwalkan perbaikan penambalan jalan untuk besok pagi."
},
{
ticketId: "TKT-20261020-1002",
nama: "Siti Aminah",
nik: "3326115508950002",
kategori: "Kebersihan & Lingkungan",
wilayah: "Kecamatan Pekalongan Utara",
judul: "Penumpukan Sampah Liar di Bantaran Sungai",
isi: "Terdapat tumpukan sampah plastik yang menyumbat aliran sungai dan menimbulkan bau menyengat.",
foto: "",
tanggal: "2026-10-20 14:30",
status: "Selesai",
isDarurat: false,
catatanSistem: "Kategori Reguler: Pengaduan fasilitas umum kebersihan lingkungan.",
tanggapan: "Dinas Lingkungan Hidup telah mengangkut sampah tersebut dan memasang plang larangan membuang sampah."
}
 ];
localStorage.setItem(PEKALONGAN_DATA_KEY, JSON.stringify(dummyAwal));
}
}

function ambilSemuaLaporan() {
return JSON.parse(localStorage.getItem(PEKALONGAN_DATA_KEY)) || [];
}

function simpanLaporanKeStorage(dataArray) {
localStorage.setItem(PEKALONGAN_DATA_KEY, JSON.stringify(dataArray));
perbaruiStatistikDashboard();
muatDaftarPengaduanTerbaru();
}

function gantiTab(namaTab) {
document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
document.getElementById(tab-${namaTab}`).classList.remove('hidden');

document.querySelectorAll('.nav-btn').forEach(btn => {
btn.classList.remove('bg-blue-600', 'text-white');
btn.classList.add('text-slate-300');
});

const navAktif = document.getElementById(nav-${namaTab}`);
if (navAktif) {
navAktif.classList.add('bg-blue-600', 'text-white');
navAktif.classList.remove('text-slate-300');
}

if (namaTab === 'admin') {
muatTabelAdmin();
muatGrafikMonitoring();
}
window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenuMobile() {
document.getElementById('menu-mobile').classList.toggle('hidden');
}

function previewFotoUpload(event) {
const fileInput = event.target;
if (fileInput.files && fileInput.files[0]) {
const reader = new FileReader();
reader.onload = function(e) {
document.getElementById('preview-img').src = e.target.result;
document.getElementById('preview-box').classList.remove('hidden');
};
reader.readAsDataURL(fileInput.files[0]);
}
}

function cekValidasiNik() {
const nilaiNik = document.getElementById('input-nik').value;
const infoEl = document.getElementById('nik-status');
if (nilaiNik.length === 16 && /^\d+$/.test(nilaiNik)) { infoEl.className = "text-[11px] mt-1 text-emerald-600 font-bold flex items-center gap-1"; infoEl.innerHTML =<i data-lucide="check-circle" class="w-3.5 h-3.5"></i> NIK Terverifikasi Valid (Sistem Kependudukan)`;
} else {
infoEl.className = "text-[11px] mt-1 text-rose-600 font-bold";
infoEl.textContent = "Format NIK tidak valid. Harus 16 digit angka!";
}
lucide.createIcons();
}

// Analisis Tingkat Urgensi Berbasis Aturan Logika Kata Kunci
function analisisUrgensiLaporan(judul, isi) {
const teksGabungan = (judul + " " + isi).toLowerCase();
const terdeteksi = KATA_KUNCI_DARURAT.some(kata => teksGabungan.includes(kata));

if (terdeteksi) {
return {
isDarurat: true,
catatan: "Kategori Darurat: Mengandung kata kunci indikator bahaya atau resiko tinggi."
};
}
return {
isDarurat: false,
catatan: "Kategori Reguler: Pengaduan umum diproses sesuai antrean operasional."
};
}

function submitFormLaporan(e) {
e.preventDefault();
const tombolKirim = document.getElementById('btn-kirim');
tombolKirim.disabled = true;
tombolKirim.innerHTML = <i data-lucide="loader" class="w-4 h-4 animate-spin"&gt;&lt;/i&gt; Menyimpan Laporan...;
lucide.createIcons();

const nama = document.getElementById('input-nama').value;
const nik = document.getElementById('input-nik').value;
const kategori = document.getElementById('input-kategori').value;
const wilayah = document.getElementById('input-wilayah').value;
const judul = document.getElementById('input-judul').value;
const isi = document.getElementById('input-isi').value;
const fotoSrc = document.getElementById('preview-img').src;

const waktuSekarang = new Date();
const formatTanggal = waktuSekarang.toISOString().slice(0,10).replace(/-/g, '');
const nomorAcak = Math.floor(1000 + Math.random() * 9000);
const IDTiket = TKT-${formatTanggal}-${nomorAcak};

const hasilAnalisis = analisisUrgensiLaporan(judul, isi);

const dataBaru = {
ticketId: IDTiket,
nama: nama,
nik: nik,
kategori: kategori,
wilayah: wilayah,
judul: judul,
isi: isi,
foto: fotoSrc.startsWith('data:image') ? fotoSrc : "",
tanggal: waktuSekarang.toLocaleString('id-ID'),
status: "Menunggu",
isDarurat: hasilAnalisis.isDarurat,
catatanSistem: hasilAnalisis.catatan,
tanggapan: "Laporan telah masuk ke sistem dan menunggu verifikasi berkas oleh petugas instansi."
};

const daftarLaporan = ambilSemuaLaporan();
daftarLaporan.unshift(dataBaru);
simpanLaporanKeStorage(daftarLaporan);

alert(Laporan Berhasil Terkirim!\n\nNomor Tiket Anda:${IDTiket}\nGunakan Nomor Tiket ini untuk pengecekan berkala.`);

document.getElementById('form-pengaduan').reset();
document.getElementById('preview-box').classList.add('hidden');
tombolKirim.disabled = false;
tombolKirim.innerHTML = <i data-lucide="send" class="w-4 h-4"&gt;&lt;/i&gt; Kirim Laporan Pengaduan;

document.getElementById('input-lacak-id').value = IDTiket;
gantiTab('lacak');
cariTiketLaporan();
}

function cariTiketLaporan() {
const inputKey = document.getElementById('input-lacak-id').value.trim().toUpperCase();
const boxHasil = document.getElementById('hasil-lacak-box');

if (!inputKey) {
alert('Masukkan Nomor Tiket Pengaduan terlebih dahulu!');
return;
}

const daftar = ambilSemuaLaporan();
const dataDitemukan = daftar.find(item => item.ticketId.toUpperCase() === inputKey);

if (!dataDitemukan) {
alert('Nomor Tiket tidak ditemukan dalam basis data!');
boxHasil.classList.add('hidden');
return;
}

document.getElementById('hasil-id').textContent = dataDitemukan.ticketId;
document.getElementById('hasil-judul').textContent = dataDitemukan.judul;
document.getElementById('hasil-nama').textContent = dataDitemukan.nama;
document.getElementById('hasil-tanggal').textContent = dataDitemukan.tanggal;
document.getElementById('hasil-kategori').textContent = dataDitemukan.kategori;
document.getElementById('hasil-wilayah').textContent = dataDitemukan.wilayah;
document.getElementById('hasil-isi').textContent = dataDitemukan.isi;
document.getElementById('hasil-catatan-sistem').textContent = dataDitemukan.catatanSistem;
document.getElementById('hasil-tanggapan-text').textContent = dataDitemukan.tanggapan || 'Belum ada respon resmi.';

const containerBadge = document.getElementById('hasil-badge');
let warnaBadge = "bg-amber-100 text-amber-900 border-amber-300";
if (dataDitemukan.status === 'Diproses') warnaBadge = "bg-blue-100 text-blue-900 border-blue-300";
if (dataDitemukan.status === 'Selesai') warnaBadge = "bg-emerald-100 text-emerald-900 border-emerald-300";
if (dataDitemukan.status === 'Ditolak') warnaBadge = "bg-rose-100 text-rose-900 border-rose-300";

containerBadge.innerHTML = <span class="px-3 py-1 rounded-full text-xs font-bold border ${warnaBadge}">${dataDitemukan.status}&lt;/span>;

boxHasil.classList.remove('hidden');
lucide.createIcons();
}

function perbaruiStatistikDashboard() {
const daftar = ambilSemuaLaporan();
document.getElementById('stat-total').textContent = daftar.length;
document.getElementById('stat-proses').textContent = daftar.filter(item => item.status === 'Diproses').length;
document.getElementById('stat-selesai').textContent = daftar.filter(item => item.status === 'Selesai').length;
document.getElementById('stat-urgen').textContent = daftar.filter(item => item.isDarurat).length;
}

function muatDaftarPengaduanTerbaru() {
const daftar3Teratas = ambilSemuaLaporan().slice(0, 3);
const container = document.getElementById('beranda-recent-list');
container.innerHTML = '';

if (daftar3Teratas.length === 0) {
container.innerHTML = <p class="text-xs text-slate-500 col-span-3"&gt;Belum ada pengaduan yang tersimpan.&lt;/p>;
return;
}

daftar3Teratas.forEach(item => {
const elemenKartu = document.createElement('div');
elemenKartu.className = "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between";
elemenKartu.innerHTML = &lt;div class="space-y-1.5"&gt; &lt;div class="flex items-center justify-between text-[11px]"&gt; &lt;span class="font-bold text-blue-600"&gt;${item.ticketId}</span>
<span class="text-slate-400 font-medium">${item.tanggal}&lt;/span&gt; &lt;/div&gt; &lt;h4 class="font-bold text-slate-900 text-sm line-clamp-1"&gt;${item.judul}</h4>
<p class="text-xs text-slate-600 line-clamp-2">${item.isi}&lt;/p&gt; &lt;/div&gt; &lt;div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs"&gt; &lt;span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px] border border-slate-200"&gt;${item.kategori}</span>
<span class="font-bold text-slate-800 text-[11px]">${item.status}&lt;/span&gt; &lt;/div&gt;;
container.appendChild(elemenKartu);
});
}

function muatTabelAdmin() {
const opsiFilter = document.getElementById('filter-status-tabel').value;
let daftar = ambilSemuaLaporan();

if (opsiFilter !== 'SEMUA') {
daftar = daftar.filter(item => item.status === opsiFilter);
}

const tbody = document.getElementById('tabel-body-admin');
tbody.innerHTML = '';

daftar.forEach(item => {
const baris = document.createElement('tr');
baris.className = "hover:bg-slate-50 border-b border-slate-200 transition-all";
baris.innerHTML = &lt;td class="p-2.5"&gt; &lt;div class="font-bold text-slate-900"&gt;${item.ticketId}</div>
<div class="text-[10px] text-slate-500">${item.tanggal}&lt;/div&gt; &lt;/td&gt; &lt;td class="p-2.5"&gt; &lt;div class="font-semibold text-slate-900"&gt;${item.nama}</div>
<div class="text-[10px] text-slate-500">NIK: ${item.nik}&lt;/div&gt; &lt;/td&gt; &lt;td class="p-2.5 max-w-xs"&gt; &lt;div class="font-semibold text-slate-900 truncate"&gt;${item.judul}</div>
<div class="text-[10px] text-blue-600 font-bold">${item.kategori}&lt;/div&gt; &lt;/td&gt; &lt;td class="p-2.5"&gt; ${item.isDarurat ?
<span class="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded text-[10px] inline-flex items-center gap-1"&gt;&lt;i data-lucide="alert-triangle" class="w-3 h-3"&gt;&lt;/i&gt; Tingkat Tinggi&lt;/span> :
<span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 font-medium rounded text-[10px]"&gt;Standar&lt;/span>
}
</td>
<td class="p-2.5">
<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${ item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : item.status === 'Diproses' ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-amber-100 text-amber-900 border-amber-300' }"&gt;${item.status}</span>
</td>
<td class="p-2.5 text-right">
<button onclick="bukaModalEdit('${item.ticketId}')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs"&gt; Tanggapi &lt;/button&gt; &lt;/td&gt;;
tbody.appendChild(baris);
});
lucide.createIcons();
}

function bukaModalEdit(ticketId) {
const daftar = ambilSemuaLaporan();
const data = daftar.find(item => item.ticketId === ticketId);
if (!data) return;

document.getElementById('modal-id-tiket').value = ticketId;
document.getElementById('modal-select-status').value = data.status;
document.getElementById('modal-text-respon').value = data.tanggapan || '';
document.getElementById('modal-update').classList.remove('hidden');
}

function tutupModal() {
document.getElementById('modal-update').classList.add('hidden');
}

function simpanResponPetugas() {
const ticketId = document.getElementById('modal-id-tiket').value;
const statusBaru = document.getElementById('modal-select-status').value;
const tanggapanBaru = document.getElementById('modal-text-respon').value;

const daftar = ambilSemuaLaporan();
const indeks = daftar.findIndex(item => item.ticketId === ticketId);

if (indeks !== -1) {
daftar[indeks].status = statusBaru;
daftar[indeks].tanggapan = tanggapanBaru;
simpanLaporanKeStorage(daftar);
muatTabelAdmin();
muatGrafikMonitoring();
tutupModal();
alert('Tanggapan dan status laporan berhasil diperbarui!');
}
}

function muatGrafikMonitoring() {
const daftar = ambilSemuaLaporan();

// Olah Data Kategori
const hitungKategori = {};
daftar.forEach(item => hitungKategori[item.kategori] = (hitungKategori[item.kategori] || 0) + 1);

const canvasKat = document.getElementById('chartGrupKategori').getContext('2d');
if (chartKategoriRef) chartKategoriRef.destroy();

chartKategoriRef = new Chart(canvasKat, {
type: 'doughnut',
data: {
labels: Object.keys(hitungKategori),
datasets: [{
data: Object.values(hitungKategori),
backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}]
},
options: { responsive: true, maintainAspectRatio: false }
});

// Olah Data Status
const hitungStatus = { 'Menunggu': 0, 'Diproses': 0, 'Selesai': 0, 'Ditolak': 0 };
daftar.forEach(item => hitungStatus[item.status] = (hitungStatus[item.status] || 0) + 1);

const canvasStat = document.getElementById('chartGrupStatus').getContext('2d');
if (chartStatusRef) chartStatusRef.destroy();

chartStatusRef = new Chart(canvasStat, {
type: 'bar',
data: {
labels: Object.keys(hitungStatus),
datasets: [{
label: 'Jumlah Pengaduan',
data: Object.values(hitungStatus),
backgroundColor: '#0f172a'
}]
},
options: { responsive: true, maintainAspectRatio: false }
});
}

function downloadFormatJSON() {
const dataTeks = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ambilSemuaLaporan(), null, 2));
const elemenDownload = document.createElement('a');
elemenDownload.setAttribute("href", dataTeks);
elemenDownload.setAttribute("download", Data_SIPEMAS_${new Date().toISOString().slice(0,10)}.json);
document.body.appendChild(elemenDownload);
elemenDownload.click();
elemenDownload.remove();
}