# Command
Wajib Sebelum Ngoding (buat update file)
- git checkout develop 
- git pull origin develop 
- git checkout -b feature/nama-fitur

Wajib Sesudah Ngoding (Update & Push file)
- git add . 
- git commit -m "Yang lagi dibuat"
- git push origin feature/nama-fitur

## 📑 Struktur File
- Struktur detail Projects: cek [[notes]]
## Penginstallan Library
Yang perlu di install agar lancar karena pake Next.js dan tailwind CSS
1. Buka terminal di vscode
2. Cek Framework di terminal
	```bash
	node -v
	```
3. Install framework di terminal vscode (jika step 2 tidak terpenuhi)
	```bash
	npm install
	```
4.  Tunggu sampe semua library terinstall dan run *step 2*
5. Kalo ada error tanyain hafiiz

## 👩‍💻 Guide Contributor
1. **Clone repo**
    ```bash
    git clone https://github.com/Bjidua/CardToo.git
    ```
2. **Buat branch untuk fitur/bugfix baru**
    ```bash
    git checkout -b fitur/navbar
    ```
3. **Commit dengan pesan jelas**
    ```bash
    git commit -m "Add navigation bar"
    ```
4. **Push ke branch remote**
    ```bash
    git push origin fitur/navbar
    ```
5. **Pull Request**
    - Buka GitHub → buat PR ke `develop` setelah selesai task
    
6. **Sync kode sebelum update**
    ```bash
    git pull origin develop
    ```
7. **Jangan push file yang di .gitignore**

## ⚠️ Note Workflow
- Semua file utama.
- File sensitif, build, node_modules, cache, hasil npm install → IGNORE
- Kalau ada asset yang terlalu besar/sensitif, jangan masuk repo. Share manual.


## 📝 License
- _Tugas Kuliah_

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