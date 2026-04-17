# Git Branch
- main ( NO BUG, FIXED POST PRODUCTION JANGAN DISENTUH )
- develop ( Tempat semua fitur baru dikumpulkan sebelum rilis.)
- feature/[nama-fitur] (Branch khusus untuk mengerjakan satu tugas.) 

# Command
Wajib Sebelum Ngoding (buat update file)
- git checkout develop 
- git pull origin develop 
- git checkout -b feature/nama-fitur

Wajib Sesudah Ngoding (Update & Push file)
- git add . 
- git commit -m "Yang lagi dibuat"
- git push origin feature/nama-fitur

## Menambahkan Branch Baru (Local) - Untuk jika ada fitur baru 
Jika ingin menambahkan branch baru (Contoh: feature/nama-fitur), gunakan command berikut:
- git checkout -b feature/nama-fitur

## Menambahkan Branch Baru (Github) - Untuk jika ada fitur baru 
Jika ingin menambahkan branch baru (Contoh: feature/nama-fitur), gunakan command berikut:
- git push origin feature/nama-fitur
** Harus konfirmasi ke team sebelum membuat branch baru **

## Notes
Menghindari Konflik (Rebase) - Jika dibutuhkan
Sebelum kamu melakukan push, tarik kode terbaru lagi dari pusat agar branch kamu tidak tertinggal:
Bash
git pull --rebase origin develop
Tips: Menggunakan --rebase akan membuat histori commit tim kamu terlihat lebih rapi dan lurus.

## Link Github
https://github.com/Hafizcod/CardToo.git