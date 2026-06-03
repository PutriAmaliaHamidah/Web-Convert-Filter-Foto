const uploadInput = document.getElementById('upload');
const filterSelect = document.getElementById('filter');
const formatSelect = document.getElementById('format');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImage = null; // Menyimpan foto asli

// 1. Saat foto diunggah
uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Atur ukuran canvas sesuai ukuran asli foto
            canvas.width = img.width;
            canvas.height = img.height;
            originalImage = img; // Simpan gambar asli
            
            canvas.style.display = 'block'; // Tampilkan canvas
            applyFilter(); // Terapkan filter (default: normal)
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

// 2. Saat pilihan filter diubah
filterSelect.addEventListener('change', applyFilter);

// Fungsi untuk menerapkan warna
function applyFilter() {
    if (!originalImage) return; // Jangan lakukan apa-apa jika belum ada foto

    // Gambar ulang foto asli ke canvas sebelum diberi filter
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    const filterType = filterSelect.value;
    if (filterType === 'normal') return; // Jika normal, selesai di sini

    // Ambil data piksel gambar dari canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop melalui setiap piksel (setiap piksel punya 4 nilai: Red, Green, Blue, Alpha)
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];     // Merah
        let g = data[i + 1]; // Hijau
        let b = data[i + 2]; // Biru
        
        if (filterType === 'grayscale') {
            // Rumus standar grayscale (Rata-rata tertimbang)
            let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
            data[i] = data[i+1] = data[i+2] = gray;
        } 
        else if (filterType === 'red') {
            data[i+1] = 0; // Hilangkan Hijau
            data[i+2] = 0; // Hilangkan Biru
        } 
        else if (filterType === 'green') {
            data[i] = 0;   // Hilangkan Merah
            data[i+2] = 0; // Hilangkan Biru
        } 
        else if (filterType === 'blue') {
            data[i] = 0;   // Hilangkan Merah
            data[i+1] = 0; // Hilangkan Hijau
        }
    }

    // Kembalikan data piksel yang sudah diubah ke canvas
    ctx.putImageData(imageData, 0, 0);
}

// 3. Saat tombol download diklik (Proses Convert Format)
downloadBtn.addEventListener('click', function() {
    if (!originalImage) {
        alert('Silakan unggah foto terlebih dahulu!');
        return;
    }

    const format = formatSelect.value; // Ambil nilai format (jpeg, png, webp)
    const mimeType = 'image/' + format;
    
    // Ubah isi canvas menjadi Data URL (link download)
    const dataURL = canvas.toDataURL(mimeType, 0.9); // 0.9 adalah kualitas gambar (0-1)

    // Buat elemen <a> sementara untuk memicu download otomatis
    const link = document.createElement('a');
    link.download = `hasil_edit.${format}`; // Nama file hasil unduhan
    link.href = dataURL;
    link.click(); // Jalankan klik otomatis
});