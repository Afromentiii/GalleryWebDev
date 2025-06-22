# Dokumentacja projektu
## Wymagania
1. Node.js
2. MongoDB
3. (Opcjonalne) MongoDB Compass
## 🟥 Ważne informacje!
1. Aplikacja posiada wbudowane konto admin z hasłem admin.
## ⚙️ Instrukcja uruchomienia
1. Uruchomić server.js znajdujący się w katalogu www za pomocą polecenia node
## ⚙️ Instrukcja importu (MongoDB Compass)
1. Pobrać przykładowe dane np. z folderu example_import z repozytorium
2. W MongoDB Compass stworzyć następujące połączenie: mongodb://localhost:27017/GalleryDB
3. Usunąć rekord z adminem w kolekcji users, ponieważ przykład zawiera admina.
4. Wejść w GalleryDB i dla każdej znajdującej się tam kolekcji -> nacisnąć przycisk ADD DATA -> import JSON
5. Przerzucić zdjęcia z example_import/images do public/images.
